const Post = require("../models/post"); // Adjust path according to your setup

// Get all posts by a user
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: { userId: req.user.id },
    });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Get a single post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (post) {
      res.json(post);
    } else {
      res.status(404).send("Post not found");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Create a new post
exports.createPost = async (req, res) => {
  const { title, body } = req.body;
  try {
    const post = await Post.create({ title, body, userId: req.user.id });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Update a post
exports.updatePost = async (req, res) => {
  const { title, body } = req.body;
  try {
    // Attempt to find the post by its ID
    const post = await Post.findByPk(req.params.id);

    if (!post) {
      // If the post doesn't exist, return a 404 error
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the logged-in user is the owner of the post
    console.log(post.userId, req.user.id, "========");
    if (post.userId != req.user.id) {
      // If not, return a 403 error for unauthorized access
      return res
        .status(403)
        .json({ message: "Not authorized to update this post" });
    }

    // If the post exists and the user is the owner, proceed to update the post
    const updatedPost = await Post.update(
      { title, body },
      { where: { id: req.params.id } },
    );

    // Return the updated post as a confirmation of success
    res.status(200).json(updatedPost);
  } catch (error) {
    // Handle any other errors that occur during the update process
    console.error("An error occurred while updating the post:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    // Attempt to find the post by its ID
    console.log(req.params.id, "000000000000000000000000000000000000");
    const post = await Post.findByPk(req.params.id);
    console.log("afterrrrrr", post);

    if (!post) {
      // If the post doesn't exist, return a 404 error
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the logged-in user is the owner of the post
    if (post.userId !== req.user.id) {
      // If not, return a 403 error for unauthorized access
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }

    // If the post exists and the user is the owner, proceed to delete the post
    const result = await Post.destroy({
      where: { id: req.params.id },
    });

    if (result > 0) {
      return res.json({ message: "Post deleted" });
    } else {
      // In case the deletion does not go through, but it should have
      return res.status(500).json({ message: "Failed to delete the post" });
    }
  } catch (error) {
    console.log("00000000000000000000000000000");
    // Handle any other errors that occur during the deletion process
    console.error("An error occurred while deleting the post:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
