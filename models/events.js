var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var photo = new Schema({
    ref: {
        type: String
    }
})

var eventSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: String
    },
    photos: [photo]
});

var Events = mongoose.model('Event', eventSchema);
module.exports = Events;
