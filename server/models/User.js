const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const mongodbErrorHandler = require("mongoose-mongodb-errors");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: "Email is required"
    },
    username: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: "Username is required"
    },
    name: {
      type: String,
      trim: true,
      required: "Name is required"
    },
    avatar: {
      type: String,
      required: "Avatar image is required",
      default: "/images/profile-image.jpg"
    },
    about: {
      type: String,
      trim: true
    },
    following: [{ type: ObjectId, ref: "User" }],
    followers: [{ type: ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

const autoPopulateFollowingAndFollowers = function(next) {
  this.populate("following", "_id username name avatar");
  this.populate("followers", "_id username name avatar");
  next();
};

userSchema.pre("findOne", autoPopulateFollowingAndFollowers);

userSchema.plugin(passportLocalMongoose, {usernameQueryFields: ['email'] });

userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model("User", userSchema);
