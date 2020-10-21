const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const pushnotificationSchema = new mongoose.Schema(
  {
    user: [{ type: ObjectId, ref: "User" }],
    token:String,
    createdAt:{
        type: Date,
        default: Date.now
    }
  }
);
const autoPopulatePostedBy = function(next) {
    this.populate("user", "_id name username avatar");
    next();
};
  pushnotificationSchema
    .pre("findOne", autoPopulatePostedBy)
    .pre("find", autoPopulatePostedBy);

module.exports = mongoose.model("pushnotification", pushnotificationSchema);
