const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const notificationSchema = new mongoose.Schema(
  {
    receiver: { type: ObjectId, ref: "User"},
    sender:   { type: ObjectId, ref: "User"},
    read: {
        type:Boolean,
        default:false
    },
    image:String,
    text:String,
    type: String,
    createdAt:{
        type: Date,
        default: Date.now
    }
  }
);
const autoPopulatePostedBy = function(next) {
    this.populate("receiver", "_id name username avatar");
    this.populate("sender", "_id name username avatar");
    next();
};
  notificationSchema
    .pre("findOne", autoPopulatePostedBy)
    .pre("find", autoPopulatePostedBy);

module.exports = mongoose.model("notification", notificationSchema);
