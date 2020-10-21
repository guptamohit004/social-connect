const User = require('../models/User');
const Post = require('../models/Post');
const passport = require('passport');
const mongoose = require("mongoose");
const multer = require("multer");
const cloudinary = require('../helpers/helper');
const notificationSchema = require('../models/Notification');
const pushnotificationSchema = require('../models/PushNotification');


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'public');
    },
    filename: function(req, file, cb) {
      cb(null, file.originalname);
    }
  });

exports.uploadImage = async (req, res, next) => {
      const upload = multer({ storage }).single('image');
      upload(req, res, async function(err) {
        if (err) {
          return res.send(err)
        }
        console.log(`File Uploaded to Server`);
        const {username} = req.profile;
        const path = req.file.path;
        req.body.caption=req.body.text
        const uniqueFilename = `posts/${username}/${req.body.caption.substring(0,10)}-${Date.parse(new Date())}`;
          var ImageDetails =  await cloudinary.cloudinaryUpload(req,res,next,path,uniqueFilename);

          if(ImageDetails.secure_url)
          {
              console.log(ImageDetails.public_id)
              req.body.image = ImageDetails.secure_url;
              module.exports.addPost(req,res,next);
          }
          else{
              res.status(400).send(`Not able to Update the Profile Image`)
          }
      })
  };

exports.addPost = async (req, res,next) => {
  req.body.postedBy = req.user._id;
  const post = await new Post(req.body).save();
  await Post.populate(post, {
    path: "postedBy",
    select: "_id name avatar"
  });
  res.json(post);
};

exports.getPostById = async (req, res, next, id) => {
  const post = await Post.findOne({ _id: id });
  req.post = post;

  const posterId = mongoose.Types.ObjectId(req.post.postedBy._id);
  if (req.user && posterId.equals(req.user._id)) {
    req.isPoster = true;
    return next();
  }
  next();
};

exports.deletePost = async (req, res) => {
  const { _id } = req.post;

  if (!req.isPoster) {
    return res.status(400).json({
      message: "You are not authorized to perform this action"
    });
  }
  const deletedPost = await Post.findOneAndDelete({ _id });
  res.json(deletedPost);
};

exports.getPostsByUser = async (req, res) => {
  const posts = await Post.find({ postedBy: req.profile._id }).sort({
    createdAt: "desc"
  });
  res.json(posts);
};

exports.getPostFeed = async (req, res) => {
  const { following, _id } = req.profile;

  following.push(_id);
  const posts = await Post.find({ postedBy: { $in: following } }).sort({
    createdAt: "desc"
  });
  res.json(posts);
};

exports.toggleLike = async (req, res) => {
  const { postId } = req.body;
  const post = await Post.findOne({ _id: postId });
  const likeIds = post.likes.map(id => id.toString());
  const authUserId = req.user._id.toString();
  var pushBody = {
    receiver:post.postedBy._id,
    sender:authUserId,
    image:post.image,
    type: "like"
   }
  if (likeIds.includes(authUserId)) {
    await post.likes.pull(authUserId);
    notificationSchema.remove(pushBody, (err, data) => {
        console.log("Deleted the notification");
    })
  } else {
    await post.likes.push(authUserId);
    if(!post.postedBy._id.equals(authUserId))
    {
      notificationSchema.create(pushBody, (err, notify) => {
          if (err) {
              console.log(err);
          } else {
            console.log("Added the notification");
          }
          });
    }
  }
  await post.save();
  res.json(post);
};

exports.toggleComment = async (req, res) => {
  const { comment, postId } = req.body;
  const post = await Post.findOne({ _id: postId });
  const authUserId = req.user._id.toString();
  var pushBody = {
    receiver:post.postedBy._id,
    sender:authUserId,
    image:post.image,
    type: "comment"
  }
  let operator;
  let data;
  if (req.url.includes("uncomment")) {
    operator = "$pull";
    data = { _id: comment._id };
    pushBody.text=comment.text;
    notificationSchema.remove(pushBody, (err, data) => {
        console.log("Deleted the notification");
    })
  } else {
    operator = "$push";
    data = { text: comment.text, postedBy: req.user._id };
    pushBody.text = comment.text;
    if(!post.postedBy._id.equals(authUserId))
    {
    notificationSchema.create(pushBody, (err, notify) => {
      if (err) {
          console.log(err);
      } else {
        console.log("Added the notification");
      }
      });
    }
  }
  const updatedPost = await Post.findOneAndUpdate(
    { _id: postId },
    { [operator]: { comments: data } },
    { new: true }
  )
    .populate("postedBy", "_id username name avatar")
    .populate("comments.postedBy", "_id username name avatar");
  res.json(updatedPost);
};
