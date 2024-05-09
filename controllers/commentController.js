const Comment = require("../models/comment");
const Post = require("../models/post");

const commentController = {
  // Fetch all comments for a specific post
  getCommentsByPostId: async (req, res) => {
    try {
      const comments = await Comment.findAll({
        where: { postId: req.params.id },
      });
      res.json(comments);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  // Create a new comment on a post
  createComment: async (req, res) => {
    try {
      const { text } = req.body;
      const newComment = await Comment.create({
        text,
        userId: req.user.id,
        postId: req.params.id,
      });
      res.status(201).json(newComment);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  // Update an existing comment
  updateComment: async (req, res) => {
    try {
      //check if comment creator before editing
      const { text } = req.body;
      const result = await Comment.update(
        { text },
        {
          where: {
            id: req.params.commentId,
            postId: req.params.postId,
            userId: req.user.id,
          },
        },
      );
      if (result[0] > 0) {
        res.send({ message: "Comment updated successfully" });
      } else {
        res
          .status(404)
          .send({ message: "Comment not found or user unauthorized" });
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  // Delete a comment
  deleteComment: async (req, res) => {
    try {
      // Find the comment along with the post to check ownership
      const comment = await Comment.findOne({
        where: { id: req.params.commentId },
      });

      // If the comment does not exist, send a 404 error
      if (!comment) {
        return res.status(404).send({ message: "Comment not found" });
      }

      // Check if the authenticated user is either the comment owner or the post owner
      if (
        comment.userId === req.user.id ||
        comment.post.userId === req.user.id
      ) {
        // If the check passes, delete the comment
        await comment.destroy();
        res.send({ message: "Comment deleted successfully" });
      } else {
        // If the user is neither, send a 403 error
        res
          .status(403)
          .send({ message: "You are not authorized to delete this comment" });
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },
};

module.exports = commentController;
