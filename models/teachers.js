var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var teachersSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    position: {
        type: String
    },
    photo: {
        type: String
    },
    description: {
        type: String,
        required: true
    }
});

var Teachers = mongoose.model('Teacher', teachersSchema);
module.exports = Teachers;