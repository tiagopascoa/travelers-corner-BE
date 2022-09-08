require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const uploadFileRoutes = require("./routes/uploadFile");
const travelPostsRoutes = require("./routes/travelPosts");
const userRoutes = require("./routes/user");

// express app
const app = express();

const PORT = process.env.PORT || 4000;

//Cors
const cors = require("cors");

// middleware
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} request for '${req.path}'`);
  next();
});

app.use(
  cors({
    credentials: true,
    origin: [process.env.CLIENT_HOSTNAME],
  })
);

// routes
// -> Upload File
app.use("/api/uploadFile", uploadFileRoutes);
// -> Travel Posts
app.use("/api/travel-posts", travelPostsRoutes);
// -> User
app.use("/api/users", userRoutes);

// ℹ️ connects to the database
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    // listen for requests
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });
