const User = require('../models/User');
const session = require('../models/sessions');
const passport = require('passport');
const axios = require('axios');
const requestIpadd= require('request-ip');
const DeviceDetector = require('node-device-detector');
var ObjectId = require('mongoose').Types.ObjectId;

// Validate a User's Signup Process inputs.
exports.validateSignup = (req,res,next) => {
    req.sanitizeBody('name');
    req.sanitizeBody('email');
    req.sanitizeBody('password');
    req.sanitizeBody('username');

    req.checkBody('name','Enter A Name').notEmpty();

    req.checkBody('email','Email is needed to Sign Up').notEmpty();
    req.checkBody('email','Email is not Valid').isEmail().normalizeEmail();

    req.checkBody('password','Enter A Password').notEmpty();
    req.checkBody('password','Password Should have length 4 to 10').isLength({min:4,max:10});

    req.checkBody('username','Enter A Username').notEmpty();
    req.checkBody('username','Username Should have length 4 to 15').isLength({min:4,max:15});

    const errors = req.validationErrors();
    if(errors)
    {
      const firstError = errors.map(error => error.msg)[0];
      return res.status(400).send(firstError);
    }
    next();
};
// Sing Up Controller.
exports.signup = async(req,res) => {
    const {email,name,password,username} = req.body;
    const user = await new User({ name, email, password,username });
    await User.register(user, password, (err, user) => {
      if (err) {
        console.log(err.message);
        return res.status(500).send(err.message);
      }
      if(user)
      {
          res.status(200).send(`Signed Up`);
      }
    });
};

// Get all the sessions.
exports.sessions=async(req,res,next)=>{
  var result=[];
  await session.find({ "expires" : { "$gte" : new Date() } })
  .then((data)=>{
      data.forEach(function(message){
        var body = JSON.parse(message.session);
        if(body.passport.user == req.user.username && body.city)
        {
          var obj={
            id:message._id,
            city:body.city,
            ip:body.ip,
            regionName:body.regionName,
            country:body.country,
            name:body.name,
            osinfo:body.osinfo,
            device:body.device,
            expires:message.expires
          }
          result.push(obj);
        }
      });
  });
  res.send(result);
}

// Logout of a particular session.
exports.logoutofSession = async(req,res,next)=>{
    await session.findOneAndUpdate({_id:req.body.sessionId},{expires:new Date()},(err,data)=>{
    if(err)
      res.status(400).send('Not logged out');
    else
      res.status(200).send('logged out');
  });
}

// Get Ip and Device Details of a user.
exports.getDeviceandIPDetails = async(req,res,next)=>{
  var clientIp = await requestIpadd.getClientIp(req);
    if (process.env.NODE_ENV !== "production") {
        clientIp = "122.173.29.199";
    }
    try {
      const response = await axios.get(`http://ip-api.com/json/${clientIp}`);
      req.session.ip=response.data.query;
      req.session.city=response.data.city;
      req.session.regionName=response.data.regionName;
      req.session.name=response.data.regionName;
      req.session.country=response.data.country;
    } catch (error) {
      console.log(error.response.body);
    }
  const detector = new DeviceDetector;
  const result = detector.detect(req.body.agent);
  req.session.osinfo = `${result.os.name} v${result.os.version}`;
  req.session.device = `${result.device.brand} ${result.device.model}`;
  return req;
}

// Controller for the sign in process.
exports.signin = async(req,res,next) =>{
    req = await module.exports.getDeviceandIPDetails(req,res,next);

    req.sanitizeBody('username');
    req.checkBody('username','Enter A Valid Username / Email to Login').notEmpty();

    req.sanitizeBody('password');
    req.checkBody('password','Enter A Password').notEmpty();
    req.checkBody('password','Password Should have length 4 to 10').isLength({min:4,max:10});

    const errors = req.validationErrors();
    if(errors)
    {
      const firstError = errors.map(error => error.msg)[0];
      return res.status(400).send(firstError);
    }
    else{
        passport.authenticate("local", {
            failureFlash: {
              type: 'messageFailure',
              message: 'Email already taken.'
            },
            successFlash: {
              type: 'messageSuccess',
              message: 'Successfully signed up.'
            }
         }, (err, user, info) => {
            if (err) {
              return res.status(500).json(err.message);
            }
            if (!user) {
              return res.status(400).json(info.name.match(/[A-Z][a-z]+|[0-9]+/g).join(" "));
            }
            req.logIn(user, err => {
              if (err) {
                return res.status(500).json(err.message);
              }
              res.status(200).send(`Signed Up`);
            });
          })(req, res, next);
    }
};

// Sign Out the user.
exports.signout = (req, res) => {
    res.clearCookie("socialConnect");
    req.logout();
    res.json({ message: "You are now signed out!" });
  };

  exports.checkAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/signin");
  };