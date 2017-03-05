var express = require("express");
var testResultRouter = express.Router();
var testResults = require('../models/testResults');
var Verify = require('./verify');

testResultRouter.route('/')

.get(function(req, res, next){
        testResults.find({}).exec(function(err, results){
             if (err) throw err;
            res.json(results);
        })
    })

.post(function(req, res, next){
    testResults.create(req.body, function(err, testResult){
        if (err) throw err;
        console.log('A new test result created!');
        var id = testResult._id;
        res.json({id: id});
    });
})

testResultRouter.route('/:trId')
.get(function(req, res, next){
        testResults.findById(req.params.trId)
            .exec(function(err, testResult){
            if (err) throw err;
            res.json(testResult);  
        })
    })

module.exports = testResultRouter;