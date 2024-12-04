const Post = require("../models/Post");

const {
  postValidationSchema,
  commentValidationSchema,
} = require("../validation/postValidation");

const createPost = async (req, res) => {
  try {
    const parseData = postValidationSchema.parse({
      title: req.body.title,
      description: req.body.description,
      image: req.file ? req.file.path : null,
    });

    const newPost = new Post({
      title: parseData.title,
      description: parseData.description,
      image: parseData.image,
    });
    await newPost.save();
    res
      .status(200)
      .json({ message: "new post created successfully", post: newPost });
  } catch (error) {
    res
      .status(400)
      .json({ error: error.errors ? error.errors : error.message }); //correction
  }
};

const AddComment = async (req, res) => {
  try {
    const commentData = {
      comment: req.body.comment,
      user: req.user.username,
    };

    const parsedComment = commentValidationSchema.parse(commentData);

    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({
      user: parsedComment.user,
      comment: parsedComment.comment,
      replies: [],
    });

    await post.save();
    res.status(200).json({
      message: "Comment added successfully",
      post,
    });
  } catch (error) {
    res
      .status(400)
      .json({ error: error.errors ? error.errors : error.message });
  }
};

// const ReplyToComment = async (req, res) => {
//   try {
//     // Validate the reply data
//     const replyData = {
//       comment: req.body.comment,
//       user: req.user.username,
//     };

//     const parsedReply = commentValidationSchema.parse(replyData);

//     const post = await Post.findById(req.params.postId);

//     if (!post) {
//       return res.status(404).json({ message: "Post not found" });
//     }

//     const commentIndex = post.comments.findIndex(
//       (comment) => comment._id.toString() === req.params.commentId
//     );

//     if (commentIndex === -1) {
//       return res.status(404).json({ message: "Comment not found" });
//     }

//     post.comments[commentIndex].replies.push({
//       user: parsedReply.user,
//       reply: parsedReply.comment,
//     });

//     await post.save(); // Save the updated post

//     res.status(200).json({
//       message: "Reply added successfully",
//       post,
//     });
//   } catch (error) {
//     res
//       .status(400)
//       .json({ error: error.errors ? error.errors : error.message });
//   }
// };

const ReplyToComment = async (req, res) => {
  try {
    const ReplyData = {
      comment: req.body.comment,
      user: req.user.username,
    };

    const parsedReply = commentValidationSchema.parse(ReplyData);

    const postMatch = await Post.aggregate([
      { $match: { _id: new ObjectId(req.params.postId) } },
      { $project: { comments: 1 } },
    ]);

    if (!postMatch.length) {
      return res.status(404).json({ message: "post not found" });
    }

    const foundCommentIndex = await postMatch.findIndex(
      (comment) => comment._id.toString() === req.params.commentId
    );

    if (foundCommentIndex === -1) {
      return res.status(400).json({ message: "comment not found" });
    }

    //psuh : add
    await Post.updateOne(
      {
        _id: req.params.postId,
        "comments._id": req.params.commentId,
      },
      {
        $push: {
          "comments.$.replies": {
            user: ReplyData.user,
            reply: ReplyData.comment,
          },
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const DeletePost = async (req, res) => {
  const { id } = req.params;
  const filter = await Post.findById(id);
  if (!filter) {
    return res.status(401).json({
      message: "post not found",
    });
  }
  await filter.deleteOne();
  res.status(200).json({
    message: "post deleted Successfully",
  });
};

// Saari posts ko retrieve karne ka function using aggregate
const getAllPosts = async (req, res) => {
  try {
    // Fetch all posts using aggregation
    const posts = await Post.aggregate([
      { $match: {} }, // Empty match to get all posts
    ]);

    // Send posts in response to Postman
    res.status(200).json({ message: "Posts fetched successfully", posts }); // Ensure this line is present
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching posts", details: err.message });
  }
};

const mongoose = require("mongoose"); // Import mongoose

const singlePost = async (req, res) => {
  try {
    const postId = req.params.postId;

    // Validate the ObjectId using mongoose.Types.ObjectId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    // Find the post using aggregate
    const singlepost = await Post.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(postId) } }, // Directly using mongoose.Types.ObjectId
    ]);

    // Check if the post was found
    if (singlepost.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Send the post as response
    res.status(200).json({
      singlepost,
      message: "Post fetched successfully",
      singlePost: singlepost[0],
    });
  } catch (error) {
    console.error(error); // Optional: to log the error in the server logs
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getImageColumn = async (req, res) => {
  try {
    // Fetching only the 'image' field from all posts
    // const posts = await Post.find().select("image");
    const posts = await Post.find({}, "image"); // Empty filter {} to get all posts, 'image' specifies that only image field should be fetched
    // const posts = await Post.aggregate([
    //   { $project: { image: 1 } } // $project to include only the image field
    // ]);

    if (posts.length === 0) {
      return res.status(404).json({ message: "No posts found" });
    }
    const images = posts.map((post) => post.image);

    res.status(200).json({
      message: "Images fetched successfully",
      images: posts,
      images: images,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const countAllCommentsByPost = async (req, res) => {
  try {
    // Fetch postId from request params
    const { postId } = req.params;

    const result = await Post.aggregate([
      // Match the specific post by its _id
      { $match: { _id: new mongoose.Types.ObjectId(postId) } },

      // Unwind the comments array to process each comment individually
      { $unwind: "$comments" },

      // Unwind the replies array inside each comment (if present)
      {
        $unwind: {
          path: "$comments.replies",
          preserveNullAndEmptyArrays: true, // Handle empty replies arrays
        },
      },

      // Group by post _id to count all comments and replies
      {
        $group: {
          _id: "$_id", // Group by post _id
          totalComments: { $sum: 1 }, // Count each comment and reply
        },
      },
    ]);

    // Handle the case if no comments are found for the post
    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "No comments found for this post" });
    }

    res.status(200).json({
      message: "Total comments counted successfully",
      postId: postId,
      totalComments: result[0].totalComments,
    });
  } catch (error) {
    console.error("Error counting comments:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getPaginatedPosts = async (req, res) => {
  try {
    // Page number ko query se le rahe hain, agar page nahi hai toh 1 by default
    const page = parseInt(req.query.page) || 1; // 'page' variable ko correctly name dena hai

    const postOnPage = 2; // Number of posts per page

    // Fetch posts with pagination logic
    const posts = await Post.find()
      .limit(postOnPage) // Number of posts per page
      .skip((page - 1) * postOnPage); // Skip the posts already viewed

    // Agar posts milti hain, toh response bhejna
    res.status(200).json({
      message: "Posts fetched successfully",
      currentPage: page, // 'pages' ko 'page' se replace karna
      posts: posts,
    });
  } catch (error) {
    // Agar koi error aaye toh error message bhejna
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createPost,
  AddComment,
  ReplyToComment,
  DeletePost,
  getAllPosts,
  singlePost,
  getImageColumn,
  countAllCommentsByPost,
  getPaginatedPosts,
};
