var express = require('express');
var eventsRouter = express.Router();
var Events = require('../models/events');
var Verify = require('./verify');

eventsRouter.route('/')

    .get(function(req, res, next){
        Events.find({}).exec(function(err, docs){
            if (err) throw err;
            res.json(docs);
        })
    })

    .post(Verify.verifyAdmin, function(req, res, next){
        Events.create(req.body, function(err, event){
            if (err) throw err;
            console.log('Event created!');
            var id = event._id;
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Added the event with id: '+ id);
        });
    })

    .delete(Verify.verifyAdmin, function(req, res, next){
        res.send('Delete all events');
    })

eventsRouter.route('/:id')
    
    .get(function(req, res, next){
         Events.findById(req.params.id)
            .exec(function(err, event){
            if (err) throw err;
            res.json(event);
            
        })
    })


    .put(Verify.verifyAdmin, function(req, res, next){
        Events.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {
            new: true
        }, function(err, event){
            if (err) throw err;
            res.json(event);
        })
    })

    .delete(Verify.verifyAdmin, function(req, res, next){
        Events.findByIdAndRemove(req.params.id, function (err, resp){
            if (err) throw err;
            res.json(resp);
        })
    })
eventsRouter.route('/:id/:photoId')
    .get(function(req, res, next){
    Events.findById(req.params.id)
    .exec(function(err, event){
       if (err) throw err;
        var photo = event.photos.id(req.params.photoId);
        res.json(photo);
    })
})

module.exports = eventsRouter;