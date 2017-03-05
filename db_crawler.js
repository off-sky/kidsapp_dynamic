var testResults = require('./models/testResults');
var config = require('./config');

exports.deleteOldTestResults = function(){
    console.log("Test results cleansing process started...");
    setInterval(function(){
       console.log("Cleansing run...");
       testResults.find({}, function(err, docs){
           if (err) throw err;
           docs.map(function(x){
               console.log("Checking test result: "+x._id);
               var ageInDays = Math.abs(Date.now() - x.createdAt) / 86399999;
               if (ageInDays > config.testResultStorageTimeInDays)
                   {
                       console.log("Removing old test result: "+x._id);
                       testResults.remove({_id: x._id}, function(err) {
                           if (err) console.log(err);
                       })
                   }
           })
       }) 
    }, config.testResultCleanserRunInterval)
}