var express = require("express");
var request = require("request");
const rp = require('request-promise');
const $ = require('cheerio');
var fs = require('fs');
var co = require('co');
var mongoose = require ("mongoose");
var NewspaperModel = require('./newspaper_schema.js');
var UserModel = require('./user_schema.js');



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
    var editor_name = doc.editor_name;
    const url = 'https://www.youscribe.com/'+editor_name+"/";
    console.log(url);
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

        if(lastId>doc.last_id)
        {
           NewspaperModel.updateOne({ editor_name: doc.editor_name }, { last_id: lastId },function(err){

               if (err) return handleError(err);
               if(!err)
               {
                 var urlNewspaper = "http://www.youscribe.com/Product/Index/"+lastId;
                 console.log("Id mis à jour pour "+doc.editor_name);
                 sendNotifications(doc.editor_name,urlNewspaper, doc.real_name);
               }

             });
        }

      })
      .catch(function(err){
        //handle error
      });

  }).
  on('end', function() { console.log('Vérification des journaux les plus récents terminée'); });



  function sendNotifications(newspaper_id, newspaper_url, newspaper_name) {


    UserModel.
      find({newspaper_id:newspaper_id}).
      cursor().
      on('data', function(doc) {

        var user_id = doc.chatfuel_user_id;
        var url = "https://api.chatfuel.com/bots/5eea2db2011f3036ca77eada/users/"+user_id+"/send";

        request({
          url: url,
          qs: { chatfuel_token : process.env.CHATFUEL_TOKEN,
                chatfuel_message_tag : "ACCOUNT_UPDATE",
                chatfuel_block_name : "test",
                newspaper_name : newspaper_name,
                newspaper_url : newspaper_url
          },
          method: "POST"
        }, function(error, response, body) {
          if (error) {
            console.log("Error sending message: " + response.error);
          }
        });

        console.log(doc.chatfuel_user_id);

      }).
      on('end', function() { console.log('Notifications envoyées!'); });



  }
