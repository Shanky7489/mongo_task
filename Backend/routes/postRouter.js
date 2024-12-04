const express = require("express");
const {
  createPost,
  AddComment,
  ReplyToComment,
  DeletePost,
  getAllPosts,
  singlePost,
  getImageColumn,
  countAllComments,
  countAllCommentsByPost,
  getPaginatedPosts,
} = require("../controllers/PostController");
const upload = require("../utils/multerConfig");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/create", upload.single("image"), createPost);
router.post("/comment/:postId", auth, AddComment);
router.post("/comment/:postId/reply/:commentId", auth, ReplyToComment);
router.post("/delete/:id", auth, DeletePost);
router.get("/getallpost", getAllPosts);
router.get("/getsinglepost/:postId", singlePost);
router.get("/getimagecolumn", getImageColumn);
router.get("/allcommentes/:postId", countAllCommentsByPost);
router.get("/pagination/:pages", getPaginatedPosts);

module.exports = router;
