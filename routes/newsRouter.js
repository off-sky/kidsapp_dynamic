var express = require('express');
var newsRouter = express.Router();
var News = require('../models/news');
var Verify = require('./verify');

newsRouter.route('/')

    .get(function(req, res, next){
        News.find({})
                .exec(function(err, news){
               if (err) throw err;
            
            
                res.json(news)
        })
    })
    .post(Verify.verifyAdmin, function(req, res, next){
        News.create(req.body, function(err, news){
            if (err) throw err;
            console.log('News created!');
            var id = news._id;
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Added the news with id: '+ id);
        });
    })

    .delete(Verify.verifyAdmin, function(req, res, next){
        res.send('Delete all news');
    })

newsRouter.route('/:id')
    
    .get(function(req, res, next){
        News.findById(req.params.id)
            .exec(function(err, news){
            if (err) throw err;
            res.json(news);  
        })
    })

    .put(Verify.verifyAdmin, function(req, res, next){
        News.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {
            new: true
        }, function(err, news){
            if (err) throw err;
            res.json(news);
        })
    })

    .delete(Verify.verifyAdmin, function(req, res, next){
        News.findByIdAndRemove(req.params.id, function (err, resp){
            if (err) throw err;
            res.json(resp);
        })
    })

module.exports = newsRouter;