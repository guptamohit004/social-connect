const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const postSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      required: "Post content is required"
    },
    image: {
      type: String
    },
    likes: [{ type: ObjectId, ref: "User" }],
    comments: [
      {
        text: String,
        createdAt: { type: Date, default: Date.now },
        postedBy: { type: ObjectId, ref: "User" }
      }
    ],
    postedBy: { type: ObjectId, ref: "User" },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { autoIndex: false }
);

const autoPopulatePostedBy = function(next) {
  this.populate("postedBy", "_id username name avatar");
  this.populate("comments.postedBy", "_id username name avatar");
  next();
};

postSchema
  .pre("findOne", autoPopulatePostedBy)
  .pre("find", autoPopulatePostedBy);
postSchema.index({ postedBy: 1, createdAt: 1 });

module.exports = mongoose.model("Post", postSchema);
