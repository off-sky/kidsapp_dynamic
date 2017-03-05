var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var newsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    position: {
        type: String
    },
    date: {
        type: String
    },
    photo: {
        type: String
    },
    text: {
        type: String,
        required: true
    }
});

var News = mongoose.model('New', newsSchema);
module.exports = News;