const TravelPost = require("../models/travelPostModel");
/* const { post } = require("../routes/travelPosts"); */
var ObjectId = require("mongodb").ObjectId;

// GET all travel posts
const getAllTravelPosts = async (req, res) => {
  try {
    const allTravelPosts = await TravelPost.find()
      .populate("user")
      .populate("comments.user");
    const travelPosts = allTravelPosts.map((post) => {
      return {
        ...post._doc,
        user: {
          _id: post.user._id,
          firstName: post.user.firstName,
          lastName: post.user.lastName,
          imageUrl: post.user.imageUrl,
        },
        comments: post.comments.map((comment) => {
          return {
            ...comment._doc,
            user: {
              __id: comment.user._id,
              firstName: comment.user.firstName,
              lastName: comment.user.lastName,
              imageUrl: comment.user.imageUrl,
            },
          };
        }),
      };
    });
    res.status(200).json(travelPosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTravelPostById = async (req, res) => {
  try {
    const travelPost = await TravelPost.findById(req.params.id)
      .populate("user")
      .populate("comments.user");
    const post = {
      ...travelPost._doc,
      user: {
        _id: travelPost.user._id,
        firstName: travelPost.user.firstName,
        lastName: travelPost.user.lastName,
        imageUrl: travelPost.user.imageUrl,
      },
      comments: travelPost.comments.map((comment) => {
        return {
          ...comment._doc,
          user: {
            __id: comment.user._id,
            firstName: comment.user.firstName,
            lastName: comment.user.lastName,
            imageUrl: comment.user.imageUrl,
          },
        };
      }),
    };
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST a new travel post
const createNewTravelPost = async (req, res) => {
  const { city, country, description, tags, imageUrl } = req.body;
  try {
    const travelPost = await TravelPost.create({
      city,
      country,
      description,
      tags,
      imageUrl,
      user: req.user,
    });
    res.status(200).json(travelPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Get User Travel Post
const getUserTravelPosts = async (req, res) => {
  try {
    const userPosts = await TravelPost.find({
      user: ObjectId(`${req.params.id}`),
    }).populate("user");
    console.log(userPosts);
    res.status(200).json(userPosts);
  } catch (e) {
    res.status(500).json({ message: `error occurred ${e}` });
  }
};

//New comment
const newComment = async (req, res) => {
  const { comment, postId } = req.body;
  try {
    const travelPost = await TravelPost.findById(postId)
      .populate("user")
      .populate("comments.user");
    travelPost.comments.push({
      comment,
      user: req.user,
    });
    await travelPost.save();
    res.status(200).json(travelPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//TODO Delete comment

//New Like
const newLike = async (req, res) => {
  const { postId } = req.body;
  try {
    const travelPost = await TravelPost.findByIdAndUpdate(
      postId,
      {
        $addToSet: { likes: req.user },
      },
      { new: true }
    )
      .populate("user")
      .populate("comments.user");
    res.status(200).json({
      message: "Travel post updated with new like from current user",
      post: travelPost,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteLike = async (req, res) => {
  const { postId } = req.body;
  try {
    const travelPost = await TravelPost.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: req.user._id },
      },
      { new: true }
    )
      .populate("user")
      .populate("comments.user");
    res.status(200).json({
      message: "Travel post updated, user like deleted",
      post: travelPost,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createNewTravelPost,
  getAllTravelPosts,
  getUserTravelPosts,
  getTravelPostById,
  newComment,
  newLike,
  deleteLike,
};
