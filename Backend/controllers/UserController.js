// const express = require("express");
// const bcrypt = require("bcryptjs");
// const { registerSchema, loginSchema } = require("../validation/userValidation");
// const User = require("../models/User");
// const jwt = require("jsonwebtoken");

// // Register user
// const registerUser = async (req, res) => {
//   try {
//     // Validate request body
//     const parseBody = registerSchema.safeParse(req.body);
//     console.log("Parsed Body:", parseBody);

//     // If validation fails, return errors
//     if (!parseBody.success) {
//       console.log("Validation Errors:", parseBody.error.errors);
//       return res.status(400).json({
//         message: "Validation Error",
//         error: parseBody.error.errors,
//       });
//     }

//     // If validation is successful, destructure the data
//     const { username, email, password } = parseBody.data;

//     // Hash the password
//     const hashPassword = await bcrypt.hash(password, 10);

//     // Create a new user
//     const newUser = new User({
//       username,
//       email,
//       password: hashPassword,
//     });

//     // Save the user to the database
//     await newUser.save();

//     // Send success response
//     return res.status(201).json({ message: "User registered successfully" });
//   } catch (error) {
//     console.error("Error:", error);
//     return res.status(500).json({
//       message: "Error while registering user",
//       error: error.message,
//     });
//   }
// };

// // Login user
// const loginUser = async (req, res) => {
//   try {
//     const parseBody = loginSchema.safeParse(req.body);
//     if (!parseBody.success) {
//       return res.status(400).json({
//         message: "Validation error",
//         errors: parseBody.error.errors,
//       });
//     }

//     const { email, password } = parseBody.data;
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     // Generate JWT token
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "1d",
//     });

//     // Send success response with token
//     return res
//       .status(200)
//       .json({ message: "User logged in successfully", token });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Error while logging in",
//       error: error.message,
//     });
//   }
// };

// // Logout user
// const logoutUser = (req, res) => {
//   res.status(200).json({ message: "User logged out successfully" });
// };

// module.exports = { registerUser, loginUser, logoutUser };

const express = require("express");
const bcrypt = require("bcryptjs");
const { registerSchema, loginSchema } = require("../validation/userValidation");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Register user
const registerUser = async (req, res) => {
  try {
    const parseBody = registerSchema.safeParse(req.body); // Validate body data
    if (!parseBody.success) {
      return res.status(400).json({
        message: "Validation Error",
        error: parseBody.error.errors,
      });
    }

    const { username, email, password } = parseBody.data;

    const hashPassword = await bcrypt.hash(password, 10); // Password ko hash karna

    const newUser = new User({
      username,
      email,
      password: hashPassword,
    });

    await newUser.save(); // Save the user to the database
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Error while registering user",
      error: error.message,
    });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const parseBody = loginSchema.safeParse(req.body); // Validate login data
    if (!parseBody.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: parseBody.error.errors,
      });
    }

    const { email, password } = parseBody.data;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ user }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    console.log(token);
    return res.status(200).json({
      message: "User logged in successfully",
      token,
      // user: { id: user._id, username: user.username },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while logging in",
      error: error.message,
    });
  }
};

const logoutUser = (req, res) => {
  res.status(200).json({ message: "User logged out successfully" });
};

module.exports = { registerUser, loginUser, logoutUser };
