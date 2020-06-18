var express = require("express");
var request = require("request");
var bodyParser = require("body-parser");
var UserModel = require('./user_schema.js');

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
       sendNotifications(req.body.newspaper_id,req.body.newspaper_url);
      }

    });

}

  res.sendStatus(200);
}
});



function sendNotifications(newspaper_id, newspaper_url) {


  UserModel.
    find({newspaper_id:newspaper_id}).
    cursor().
    on('data', function(doc) {

      var user_id = doc.chatfuel_user_id;
      var newspaper_url = doc.newspaper_url;
      var url = "https://api.chatfuel.com/bots/5eea2db2011f3036ca77eada/users/".user_id."/send";

      request({
        url: url,
        qs: { chatfuel_token : env.CHATFUEL_TOKEN,
              chatfuel_message_tag : "ACCOUNT_UPDATE",
              chatfuel_block_name : "test",
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


/*


  request({
    url: "https://api.chatfuel.com/bots/5eea2db2011f3036ca77eada/users/3876548032385982/send?chatfuel_token=mELtlMAHYqR0BvgEiMq8zVek3uYUK3OJMbtyrdNPTrQB9ndV0fM7lWTFZbM4MZvD&chatfuel_message_tag=ACCOUNT_UPDATE&chatfuel_block_name=test&newspaper_id=gbich-editions",
    method: "POST"
  }, function(error, response, body) {
    if (error) {
      console.log("Error sending message: " + response.error);
    }
    if(!error) console.log("Notification envoyée");
  });
*/
}
