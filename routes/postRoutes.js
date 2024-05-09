const express = require("express");
const router = express.Router(); 
const postController = require("../controllers/postController"); 
const commentController = require("../controllers/commentController"); 
const { authenticate, isAdmin } = require("../middleware/authmiddleware"); 

// Fetch all posts by a user
router.get("/", authenticate, postController.getAllPosts);

// Fetch a single post by ID
router.get("/:id", authenticate, postController.getPostById);

// Fetch all comments on a specific post
router.get(
  "/:id/comments",
  authenticate,
  commentController.getCommentsByPostId,
); // New route for comments

// Create a new post
router.post("/", authenticate, postController.createPost);

// Add a comment to a post
router.post("/:id/comments", authenticate, commentController.createComment); 

// Update a post
router.patch("/:id", authenticate, postController.updatePost);

// Update a comment on a post
router.patch(
  "/:postId/comments/:commentId",
  authenticate,
  commentController.updateComment,
); // New route for updating comments

// Delete a post
router.delete("/:id", authenticate, postController.deletePost);

// Delete a comment from a post
router.delete(
  "/:postId/comments/:commentId",
  authenticate,
  commentController.deleteComment,
); // New route for deleting comments

module.exports = router;
