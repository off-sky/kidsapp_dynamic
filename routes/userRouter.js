var express = require('express');
var router = express.Router();
var User = require('../models/users');
var passport = require('passport');
var Verify = require('./verify');
var config = require('../config')


router.get('/', function (req, res, next) {
  User.find({}, function (err, user) {
    if (err) {
      return res.status(500).json({
        err: 'not enough privileges'
      });
    }
    res.json(user);
  });
});

router.post('/register', function (req, res) {
  User.register(new User({username: req.body.username}),
  req.body.password, function (err, user) {
        if (err) {
          return res.status(500).json({err: err});
        }
        if (req.body.firstName) {
          user.firstName = req.body.firstName;
       }
       if (req.body.lastName) {
          user.lastName = req.body.lastName;
       }
       if (req.body.email) {
          user.email = req.body.email;
       }
       if (req.body.password) {
          user.password = req.body.password;
       }
       if (req.body.group) {
          user.group = req.body.group;
       }
      if (req.body.position) {
          user.position = req.body.position;
       }
       if (req.body.adminCode == config.adminCode) {
          user.admin = true;
       }
      user.save(function (err, user) {
      passport.authenticate('local')(req, res, function () {
          var token = Verify.getToken(user);
        return res.status(200).json({status: 'Registration Successful!', token: token});
      });
    });
  });
});

router.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function (err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }

      var token = Verify.getToken(user);
      res.status(200).json({
        status: 'Login successful!',
        success: true,
        token: token
      });
    });
  })(req, res, next);
});

module.exports = router;
