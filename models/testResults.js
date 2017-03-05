var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var testResultSchema = new Schema({
    test_name: String,
    username: String,
    overallRating : Number,
    level: Number,
    recommendedGrammar : [{
        name: String
    }],
    reading: {
        rating: Number
    },
    grammar: {
        rating: Number
    },
    lexis: {
        rating: Number
    },
    listening: {
        rating: Number
    },
    questionString: String
}, {
    timestamps: true
});

var testResults = mongoose.model('testResult', testResultSchema);
module.exports = testResults;