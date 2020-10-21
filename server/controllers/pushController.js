const notificationSchema = require('../models/Notification');
const pushnotificationSchema = require('../models/PushNotification');
var FCM = require('fcm-node');
var serverKey = 'AAAA0ptuK-0:APA91bF8sAe5B42qKsCiEWo2Xn1vBIePo5dL9X0NEnLpF4_lAg_soq5KOG05YGpX2Ub4jV-j5utqaCYR14DSI-zpzz_WdHrCpm-MkG251K87enTNqF6p_QHKiMSnFE4P7ArPo2mvq2Q8'; // put your server key here
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
    console.log(pushData)
    var message = {
      registration_ids:pushData.token,
      notification: {
        title: pushData.title,
        icon: pushData.icon,
        body:pushData.body,
        vibrate: [200, 100, 200],
        click_action:pushData.link,
        actions: [
          {
            title: "Like",
            action: "like",
            icon: "https://firebase.google.com/images/brand-guidelines/logo-vertical.png",
          },
          {
            title: "Unsubscribe",
            action: "unsubscribe",
            icon: "https://firebase.google.com/images/brand-guidelines/logo-vertical.png"
          }
        ]
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