var express = require("express");
var request = require("request");
var bodyParser = require("body-parser");

const rp = require('request-promise');
const $ = require('cheerio');
var fs = require('fs');
var co = require('co');

var UserModel = require('./user_schema.js');
var NewspaperModel = require('./newspaper_schema.js');

var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 5000));

// Server index page
app.get("/", function (req, res) {
  res.send("Deployed!");
});

var http = require ('http');
var mongoose = require ("mongoose");
var uristring =   process.env.MONGODB_URI;
var theport = process.env.PORT || 5000;



mongoose.connect(uristring, function (err, res) {
if (err) {
console.log ('ERROR connecting to: ' + uristring + '. ' + err);
} else {
console.log ('Succeeded connected to: ' + uristring);
}
});




//Verification du webhook si besoin

app.get("/webhook", function (req, res) {
  if (req.header("VERIFICATION_TOKEN") === process.env.VERIFICATION_TOKEN) {
    console.log("Verified webhook");

    res.sendStatus(200);
  } else {
    console.error("Verification failed. The tokens do not match.");
    console.log(process.env.VERIFICATION_TOKEN);
    console.log(req.query["VERIFICATION_TOKEN"]);
    res.sendStatus(403);
  }
});

// Traitement des requêtes POST
app.post("/webhook", function (req, res) {


if (req.header("VERIFICATION_TOKEN") === process.env.VERIFICATION_TOKEN) {

  // Gestion des notifications

  if(req.body.object=="notifications")
  {
    console.log(req.body.user_id);
    console.log(req.body.newspaper);
    console.log(req.body.status);

    //On regarde si l'utilisateur existe déjà,et s'il est déjà inscrit aux notifications du journal
    UserModel.count({chatfuel_user_id: req.body.user_id , newspaper_id:req.body.newspaper}, function (err, count){
    if(count>0){
    console.log('Utilisateur a déjà activé la notification');

    //On test si l'utilisateur veut désactiver la notification
    if(req.body.status =="desactivate")
    {
    var currentUser =  UserModel.remove({ chatfuel_user_id: req.body.user_id , newspaper_id:req.body.newspaper },function(err){

        if (err) return handleError(err);
        if(!err) console.log("notification supprimée");

      });
    }

    }

    //S'il n'est pas inscript pour cette notification, on l'ajoute
    else {
      console.log("ajout de l'utilisateur");
      var currentUser = new UserModel({ chatfuel_user_id: req.body.user_id , newspaper_id:req.body.newspaper });
      currentUser.save(function (err) {
        if (err) return handleError(err);
        });
      }
      });
  }



//Envoi des notifications via les requêtes du backend Youscribe
if(req.body.object=="send_notifications")
{
  console.log(req.body.newspaper_id);
  console.log(req.body.newspaper_url);

  UserModel.updateMany({newspaper_id : req.body.newspaper_id},{newspaper_url:req.body.newspaper_url},function(err){

      if (err) return handleError(err);
      if(!err)
      {
        console.log("Notifications prêtes à être envoyées");

      }

    });

}

  res.sendStatus(200);
}
});
