const express = require("express");
const router = express.Router();
//Middleware
const requireAuth = require("../middleware/requireAuth");
// Controllers
const {
  loginUser,
  signupUser,
  getUser,
  forgotPassword,
  resetPassword,
  updateProfile,
  deleteUserProfile,
  addToFollowing,
  removeFromFollowing,
} = require("../controllers/userController");

// Login
router.post("/login", loginUser);
// Signup
router.post("/signup", signupUser);
// Forgot Password
router.post("/forgot-password", forgotPassword);
// Reset Password
router.post("/reset-password", resetPassword);

// RequireAuth is a middleware that checks if the user is authenticated
router.use(requireAuth);
// Get user by Id
router.get("/:id/get-user", getUser);
// Update profile
router.put("/update-profile", updateProfile);
// Delete user
router.post("/delete-user", deleteUserProfile);
// Add User to Following
router.put("/add-to-following", addToFollowing);
// Remove User from Following
router.put("/remove-from-following", removeFromFollowing);

module.exports = router;
