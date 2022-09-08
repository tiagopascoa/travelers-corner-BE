const User = require("../models/userModel");
const TravelPost = require("../models/travelPostModel");
var ObjectId = require("mongodb").ObjectId;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sendEmail = require("../configs/sendEmail");

//JWT
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    // Create token to login in user after signup
    const token = createToken(user._id);
    // Response from DB
    res.status(200).json({
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      homeCity: user.homeCity,
      homeCountry: user.homeCountry,
      email,
      imageUrl: user.imageUrl,
      following: user.following,
      token,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Signup user
const signupUser = async (req, res) => {
  const {
    firstName,
    lastName,
    homeCity,
    homeCountry,
    email,
    password,
    imageUrl,
  } = req.body;
  try {
    const user = await User.signup(
      firstName,
      lastName,
      homeCity,
      homeCountry,
      email,
      password,
      imageUrl
    );
    // Create token to login in user after signup
    const token = createToken(user._id);
    // Response from DB
    res.status(200).json({
      userId: user._id,
      firstName,
      lastName,
      homeCity,
      homeCountry,
      email,
      imageUrl,
      following: user.following,
      token,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get user by Id
const getUser = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.id }).populate(
      "following"
    );
    console.log(user);
    res.status(200).json({
      email: user.email,
      firstName: user.firstName,
      following: user.following,
      homeCity: user.homeCity,
      homeCountry: user.homeCountry,
      imageUrl: user.imageUrl,
      lastName: user.lastName,
      _id: user._id,
    });
  } catch (e) {
    res.status(500).json({ message: `error occurred ${e}` });
  }
};

// Send forgot password email
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw Error("Email address not found!");
    }
    const token = createToken(user._id);
    const url = `${process.env.CLIENT_HOSTNAME}/reset-password/${token}`;
    await sendEmail(
      email,
      "travelerscornersocial@gmail.com",
      "Travelers Corner - Reset Password Link",
      `<div>Click the link bellow to reset your password</div><br/>
      <div><a href="${url}">Click here<a> <div>`
    );
    return res
      .status(200)
      .json({ message: "Email has been sent successfully!" });
  } catch (e) {
    res.status(400).json({ message: `error occurred ${e}` });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  const { password, token } = req.body;
  try {
    /* const { token } = req.params; */
    const decoded = jwt.verify(token, process.env.SECRET);
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const updateUser = await User.findByIdAndUpdate(decoded._id, {
      password: hash,
    });
    res.status(200).json({ message: "Password updated", user: updateUser });
  } catch (e) {
    res.status(400).json({ message: `error occurred ${e}` });
  }
};

// Reset password
const updateProfile = async (req, res) => {
  const {
    userId,
    email,
    firstName,
    lastName,
    homeCity,
    homeCountry,
    imageUrl,
  } = req.body;
  try {
    const updateUser = await User.findByIdAndUpdate(
      userId,
      {
        email,
        firstName,
        lastName,
        homeCity,
        homeCountry,
        imageUrl,
      },
      { new: true }
    );
    res.status(200).json({
      message: "User profile updated",
      user: {
        email: updateUser.email,
        firstName: updateUser.firstName,
        lastName: updateUser.lastName,
        homeCity: updateUser.homeCity,
        homeCountry: updateUser.homeCountry,
        imageUrl: updateUser.imageUrl,
        following: updateUser.following,
      },
    });
  } catch (e) {
    res.status(400).json({ message: `error occurred ${e}` });
  }
};

const deleteUserProfile = async (req, res) => {
  const { userId } = req.body;
  try {
    const deletedPosts = await TravelPost.deleteMany({
      user: ObjectId(`${userId}`),
    });
    console.log("deletedPosts count: ", deletedPosts);
    await User.findByIdAndDelete(userId);
    res.status(200).json({
      message: "User profile and posts deleted",
    });
  } catch (e) {
    res.status(400).json({ message: `error occurred ${e}` });
  }
};

const addToFollowing = async (req, res) => {
  const { userId, userToFollowId } = req.body;
  try {
    const userTofollow = await User.findById(userToFollowId);
    const updateUser = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { following: userTofollow },
      },
      { new: true }
    );
    res.status(200).json({
      message: "User profile updated",
      user: {
        following: updateUser.following,
      },
    });
  } catch (e) {
    res.status(500).json({ message: `erro occurred ${e}` });
  }
};

const removeFromFollowing = async (req, res) => {
  const { userId, userToUnfollowId } = req.body;
  try {
    const userToUnfollow = await User.findById(userToUnfollowId);
    console.log(userToUnfollow);
    const updateUser = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { following: ObjectId(`${userToUnfollow._id}`) },
      },
      { new: true }
    );
    res.status(200).json({
      message: "User profile updated",
      user: {
        following: updateUser.following,
      },
    });
  } catch (e) {
    res.status(500).json({ message: `erro occurred ${e}` });
  }
};

module.exports = {
  loginUser,
  signupUser,
  getUser,
  forgotPassword,
  resetPassword,
  updateProfile,
  deleteUserProfile,
  addToFollowing,
  removeFromFollowing,
};
