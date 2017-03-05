var express = require('express');
var teachersRouter = express.Router();
var Teachers = require('../models/teachers');
var Verify = require('./verify.js');

teachersRouter.route('/')

    .get(function(req, res, next){
        Teachers.find({}).exec(function(err, teachers){
             if (err) throw err;
            res.json(teachers);
        })
    })

    .post(Verify.verifyAdmin, function(req, res, next){
        Teachers.create(req.body, function(err, teacher){
            if (err) throw err;
            console.log('A new teacher created!');
            var id = teacher._id;
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Added the teacher with id: '+ id);
        });
    })

    .delete(Verify.verifyAdmin, function(req, res, next){
        res.send('Delete all teachers');
    })

teachersRouter.route('/:id')
    
    .get(function(req, res, next){
        Teachers.findById(req.params.id)
            .exec(function(err, teacher){
            if (err) throw err;
            res.json(teacher);  
        })
    })

    .put(Verify.verifyAdmin, function(req, res, next){
        Teachers.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {
            new: true
        }, function(err, teacher){
            if (err) throw err;
            res.json(teacher);
        })
    })

    .delete(Verify.verifyAdmin, function(req, res, next){
        Teachers.findByIdAndRemove(req.params.id, function (err, resp){
            if (err) throw err;
            res.json(resp);
        })
    })

module.exports = teachersRouter;