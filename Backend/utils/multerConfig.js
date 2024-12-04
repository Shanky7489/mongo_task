const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define the path of the uploads directory
const uploadsDir = path.join(__dirname, "../uploads");

// Check if the uploads folder exists, if not, create it
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true }); // Creates the folder if it doesn't exist
}

// Define storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("File:", file);
    cb(null, uploadsDir); // Now it will use the created directory
  },
  filename: (req, file, cb) => {
    console.log("File:", file);
    cb(null, Date.now() + path.extname(file.originalname)); // Generate a unique filename
  },
});

// Multer filter for accepting only image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // Accept image files
  } else {
    cb(new Error("Invalid file type, only images are allowed!"), false);
  }
};

// Configure multer upload
const upload = multer({ storage, fileFilter });

module.exports = upload;
