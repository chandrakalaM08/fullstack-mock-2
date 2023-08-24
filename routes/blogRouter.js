const { Router } = require("express");
const { BlogModel } = require("../models/BlogModel");

const blogRouter = Router();

blogRouter.get("/", (req, res) => {
  res.send("Welcome to blogs route");
});

blogRouter.post("/blogs", async (req, res) => {
  try {
    let blogData = req.body;
    blogData.userid = req.id;
    let blog = await BlogModel.create(blogData);
    res.status(200).send({ msg: "Blog created", blog });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

blogRouter.get("/blogs", async (req, res) => {
  try {
    const { title, category, order } = req.query;
    console.log("here in params", title, category, order);
    let query = {};
    if (title) {
      query.title = { $regex: title, $options: "i" };
    }
    if (category) {
      query.category = category;
    }

    let sortedOrder;
    if (order === "asc") {
      sortedOrder = 1;
    } else if (order === "desc") {
      sortedOrder = -1;
    }

    let blogs = await BlogModel.find(query).sort({ date: sortedOrder });
    res.status(200).send({ msg: "Blog fetched", blogs });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

blogRouter.patch("/blogs/:id", async (req, res) => {
  try {
    let { id } = req.params;

    let post = await BlogModel.findById(id);
    if (!post) {
      res.send("Post not found");
      return;
    }

    let payload = req.body;
    let creatorId = post.userid;

    if (creatorId.toString() === req.id) {
      let updatedBlog = await BlogModel.findByIdAndUpdate(id, payload, {
        new: true,
      });

      res.send({ msg: "Post updated Successfully", updatedBlog });
      return;
    } else {
      res.send({ msg: "Not Authorized to update" });
    }
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

blogRouter.delete("/blogs/:id", async (req, res) => {
  try {
    let { id } = req.params;

    let post = await BlogModel.findById(id);
    if (!post) {
      res.send("Post not found");
      return;
    }

    let payload = req.body;
    let creatorId = post.userid;

    if (creatorId.toString() === req.id) {
      let deletedPost = await BlogModel.findByIdAndDelete(id);

      res.send({ msg: "Post deleted Successfully", deletedPost });
      return;
    } else {
      res.send({ msg: "Not Authorized to delete" });
    }
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

// like

blogRouter.patch("/blogs/:id/like", async (req, res) => {
  try {
    let { id } = req.params;

    let post = await BlogModel.findById(id);
    if (!post) {
      res.send("Post not found");
      return;
    }

    let payload = { likes: post.likes + 1 };
    let likedPost = await BlogModel.findByIdAndUpdate(id, payload, {
      new: true,
    });

    res.send({ msg: "Post liked Successfully", likedPost });
    return;
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

/// comments

blogRouter.patch("/blogs/:id/comment", async (req, res) => {
  try {
    let { id } = req.params;

    let post = await BlogModel.findById(id);
    if (!post) {
      res.send("Post not found");
      return;
    }

    let newcomment = {
      username: req.username,
      content: req.body.content,
    };
    console.log("new comment is", newcomment);
    let payload = { comments: [...post.comments, newcomment] };
    console.log("payload", payload);
    let commentedPost = await BlogModel.findByIdAndUpdate(id, payload, {
      new: true,
    });

    res.send({ msg: "Commented Successfully", commentedPost });
    return;
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

module.exports = { blogRouter };
