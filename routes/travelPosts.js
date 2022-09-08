const express = require("express");
// Controllers
const {
  createNewTravelPost,
  getAllTravelPosts,
  getUserTravelPosts,
  getTravelPostById,
  newComment,
  newLike,
  deleteLike,
} = require("../controllers/travelPostController");
//Middleware
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// RequireAuth is a middleware that checks if the user is authenticated
router.use(requireAuth);

//GET all Travel Posts
router.get("/get-all-posts", getAllTravelPosts);

//CREATE a new Travel Post
router.post("/new-post", createNewTravelPost);

//GET User Travel Posts
router.get("/:id/get-user-posts", getUserTravelPosts);

//GET Travel Post by ID
router.get("/:id/get-post", getTravelPostById);

//CREATE a new comment
router.post("/new-comment", newComment);

//UPDATE Travel Post with new like
router.put("/new-like", newLike);

//DELETE Travel Post like
router.put("/delete-like", deleteLike);

module.exports = router;
