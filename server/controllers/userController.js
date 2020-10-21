const User = require('../models/User');
const notificationSchema = require('../models/Notification');
const pushnotificationSchema = require('../models/PushNotification');
const passport = require('passport');
const mongoose = require("mongoose");
const multer = require("multer");
const cloudinary = require('../helpers/helper');
const pushController = require('./pushController');
var ObjectId = require('mongoose').Types.ObjectId;

exports.getUsers = async (req,res,next) => {
    await User.find({},(err,users) => {
        res.json(users);
    });
};

exports.getAuthUser = (req, res) => {
    if (!req.isAuthUser) {
      res.status(403).json({
        message: "You are unauthenticated. Please sign in or sign up"
      });
      return res.redirect("/signin");
    }
    res.status(200).send(req.user);
};

exports.getUserById = async (req,res,next,id) => {
    var user = await User.findOne({username: id});
    req.profile = user;
    if(req.profile)
    {
        const ProfileId = mongoose.Types.ObjectId(req.profile._id);
        if(req.user && ProfileId.equals(req.user._id))
        {
            req.isAuthUser = true;
            next();
            return;
        }
    }
    next();
};

exports.getUserProfile = async(req,res,next) => {
    await User.findOne({username:req.params.userId},(err,user)=>{
        if(!user)
        {
            res.status(404).send('No User found by Id.');
        }
        else{
            res.status(200).send(user);
        }
    });
};

exports.getUserFeed = async(req,res, next) => {
    const {following,_id} = req.user;
    following.push(_id);
    await User.find({_id:{$nin:following}},(err,user)=>{
        if(err)
        {
            res.send([]);
        }
        else{
            res.json(user);
        }
    });
};


const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

  exports.uploadAvatar = async (req, res, next) => {
    const upload = multer({ storage }).single('avatar');
    upload(req, res, async function(err) {
        var checkUser = await User.findOne({
                                             $or: [{
                                                 email: req.body.email
                                             }, {
                                                 username: req.body.username
                                             }]
                                         });
        if(checkUser &&  checkUser._id != req.body.id && checkUser.username == req.body.username)
        {
            return res.status(400).send(`User with username as  ${req.body.username} already exisits`);
        }
        else if(checkUser &&  checkUser._id != req.body.id && checkUser.email == req.body.email)
        {
            return res.status(400).send(`User with email as  ${req.body.email} already exisits`);
        }
      if (err) {
        return res.status(400).send(err)
      }
      const {avatar,username} = req.profile;
      if(req.file && req.file.path) {
        if(avatar.includes('https://res.cloudinary.com/'))
        {
            var fileName = `avatars/${avatar.match(/([^\/]+)(?=\.\w+$)/)[0]}`;
            await cloudinary.cloudinaryDelete(req,res,next,fileName);
        }
        const path = req.file.path;
        const uniqueFilename = `avatars/${username}-${Date.parse(new Date())}`;
          var ImageDetails =  await cloudinary.cloudinaryUpload(req,res,next,path,uniqueFilename);
          if(ImageDetails.secure_url)
          {
              console.log(ImageDetails.public_id)
              req.body.avatar = ImageDetails.secure_url;
              module.exports.updateUser(req,res);
              res.status(200).send(`Updated User`)
          }
          else{
              res.status(400).send(`Not able to Update the Profile Image`)
          }
      }
      else{
            req.body.avatar = avatar;
            module.exports.updateUser(req,res);
            res.status(200).send(`Updated User`)
      }
    })
};

  exports.updateUser = async (req, res) => {
    req.body.updatedAt = new Date().toISOString();
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $set: {avatar : req.body.avatar,name:req.body.name,username:req.body.username,email:req.body.email,about:req.body.about} },
      { new: true}
    );
  };

exports.deleteUser = async (req, res) => {
    const { userId } = req.params;

    if (!req.isAuthUser) {
      return res.status(400).json({
        message: "You are not authorized to perform this action"
      });
    }
    const deletedUser = await User.findOneAndDelete({ _id: userId });
    res.json(deletedUser);
  };


exports.addFollowing = async (req,res,next) => {
    console.log(req.body.follow);
    if(!ObjectId.isValid(req.body.follow))
    {
        req.body.follow = await User.findOne({username:req.body.follow})
        req.body.follow = req.body.follow._id;
    }
    const ProfileId = mongoose.Types.ObjectId(req.user._id);
    if(!req.body.follow)
    {
        return res.status(400).send('Please enter a User to Be Followed');
    }
    else if(ProfileId.equals(req.body.follow)){
        return res.status(400).send(`You Can't Follow Yourself.😉😉`);
    }
    else{
           await User.findOneAndUpdate(
                {_id: req.user._id},{$addToSet:{following:req.body.follow}},async(err,user) =>{
                    if(err)
                    {
                       return res.status(400).send(`Not able to Follow, Try Again Later`);
                    }
                    else{
                        console.log("Updated user, Add Following");
                        await module.exports.addFollower(req,res,next);
                        return res.status(200).send(`Successfully Followed`);
                    }
                });
        }
};

exports.addFollower = async (req,res,next) => {
    await User.findOneAndUpdate(
        {_id: req.body.follow},{$addToSet:{followers:req.user._id}},{new:true},(err,user) =>{
            if(err)
            {
                return res.status(400).send(`Not able to Follow, Try Again Later`);
            }
            else{
                var pushBody = {
                    receiver:req.body.follow,
                    sender:req.user._id,
                    type: "follow"
                }
                notificationSchema.create(pushBody, (err, data) => {
                    if (err) {
                        console.log(err);
                    } else {
                        pushnotificationSchema.find({user:req.body.follow},(err,data)=>{
                            if(err){

                            }
                            else{
                                if(data.length>0)
                                {
                                    var pushData={
                                        token:[]
                                    };
                                    data.map((data)=>{
                                        pushData.token.push(data.token);
                                        pushData.title  = `${req.user.name} @(${req.user.username}) Started Following You.😊 `;
                                        pushData.body   = `${pushData.title}.
                                                             View there profile and get connected.`
                                        pushData.link   = `http://socialnext.herokuapp.com/profile/${req.user.username}`
                                        pushData.icon=req.user.avatar
                                    })
                                    pushController.sendPush(pushData);
                                }
                            }
                        })
                        console.log("Added to notifications");
                    }
                });
                console.log("Updated user, Added to Followers");
            }
        });
};

exports.deleteFollowing = async(req,res,next) => {
    if(!ObjectId.isValid(req.body.follow))
    {
        req.body.follow = await User.findOne({username:req.body.follow})
    }
    req.body.follow = req.body.follow._id;
    if(!req.body.follow)
    {
        res.status(400).send('Please enter a User to Be Followed');
        return;
    }
    await User.findOneAndUpdate(
        {_id: req.user._id},{$pull:{following:req.body.follow}},async(err,user) =>{
            if(err)
            {
                res.status(400).send(`Not able to Unfollow, Try Again Later`);
            }
            else{
                console.log("Updated user, and UnFollowing");
                await module.exports.deleteFollower(req,res,next);
            }
        });
};

exports.deleteFollower = async (req,res,next) => {
    await User.findOneAndUpdate(
        {_id: req.body.follow},{$pull:{followers:req.user._id}},{new:true},(err,user) =>{
            if(err)
            {
                res.status(400).send(`Not able to Unfollow, Try Again Later`);
            }
            else{
                var pushBody = {
                receiver:req.body.follow,
                sender:req.user._id,
                type: "follow"
            }
            notificationSchema.remove(pushBody, (err, data) => {
                console.log("Deleted the notification");
            })
                console.log("Updated user, Unfollowed the User");
                res.send(user);
            }
        });
};