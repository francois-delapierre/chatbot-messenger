const rp = require('request-promise');
const $ = require('cheerio');
var fs = require('fs');
var co = require('co');
var mongoose = require ("mongoose");
var NewspaperModel = require('./newspaper_schema.js');


var uristring =   process.env.MONGODB_URI || "mongodb://heroku_4wq6mjkn:cnh4mlou3abk7sf9bbdcvbhvkk@ds037252.mlab.com:37252/heroku_4wq6mjkn";
var theport = process.env.PORT || 5000;


mongoose.connect(uristring, function (err, res) {
if (err) {
console.log ('ERROR connecting to: ' + uristring + '. ' + err);
} else {
console.log ('Succeeded connected to: ' + uristring);
}
});



NewspaperModel.
  find().
  cursor().
  on('data', function(doc) {
    console.log(doc.real_name);
  }).
  on('end', function() { console.log('Journaux trouvés!'); });

/*
var editor_name = doc.editor_name;
const url = 'https://www.youscribe.com/'+editor_name;
console.log("Bonjour");
rp(url)
  .then(function(html){
    //success!
    const newspaperUrls = [];
    const newspaperId =[];
    for (let i = 0; i < 10; i++) {

      newspaperUrls.push($('.l-productResult-thumb > a', html)[i].attribs.href);

      var href=$('.l-productResult-thumb > a', html)[i].attribs.href;
      var id= href.substring(href.length - 7, href.length);
      newspaperId.push(id);

    }

    var lastId=Math.max(...newspaperId);
    console.log(newspaperUrls);
    console.log(newspaperId);
    console.log(lastId);
  })
  .catch(function(err){
    //handle error
  });
*/
