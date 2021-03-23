const notificationSchema = require('../models/Notification');
const pushnotificationSchema = require('../models/PushNotification');
var FCM = require('fcm-node');
var serverKey = process.env.SERVER_KEY_FCM; // put your server key here
var fcm = new FCM(serverKey);

exports.setToken = async (req, res,next)=>{
    var user = null;
    if(req.user)
        user = req.user._id;
    var pushData = await pushnotificationSchema.update({ token :req.body.token },{$addToSet:{user:user}}, { upsert : true });
    res.status(200).send("Added/Updated to Push Notification Model");
};

exports.getAllNotification = async (req, res,next)=>{
    var notifications = await notificationSchema.find({receiver:req.user._id}).sort({'createdAt': -1});
    res.status(200).send(notifications);
};

exports.markReadNotification = async (req, res,next)=>{
    var notifications = await notificationSchema.updateMany({ receiver:req.user._id, read: false}, { read: true });
    res.status(200).send(notifications);
}

exports.sendPush = async(pushData)=>{
    var message = {
      registration_ids:pushData.token,
      notification: {
        title: pushData.title,
        icon: pushData.icon,
        image:pushData.image,
        body:pushData.body,
        vibrate: [300, 100, 400],
        click_action:pushData.link
        },
        priority : "high"
    }
    fcm.send(message, function(err, response){
        if (err) {
            console.log(err);
        } else {
            console.log("Successfully sent with response: ", response);
        }
    });
}