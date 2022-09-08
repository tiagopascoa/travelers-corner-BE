const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const travelPostSchema = new Schema(
  {
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tags: [String],
    imageUrl: {
      type: String,
      default: "",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    comments: [
      {
        type: new mongoose.Schema(
          {
            user: {
              type: Schema.Types.ObjectId,
              ref: "Users",
            },
            comment: String,
          },
          { timestamps: true }
        ),
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
  },
  { timestamps: true }
);

const TravelPost = mongoose.model("Travel Post", travelPostSchema);

module.exports = TravelPost;
