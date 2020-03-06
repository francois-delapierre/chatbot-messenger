var express = require("express");
var request = require("request");
var bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 5000));

// Server index page
app.get("/", function (req, res) {
  res.send("Deployed!");
});

// Facebook Webhook
// Used for verification
app.get("/webhook", function (req, res) {
  if (req.query["hub.verify_token"] === process.env.VERIFICATION_TOKEN) {
    console.log("Verified webhook");
    res.status(200).send(req.query["hub.challenge"]);
  } else {
    console.error("Verification failed. The tokens do not match.");
    res.sendStatus(403);
  }
});


// All callbacks for Messenger will be POST-ed here
app.post("/webhook", function (req, res) {
  // Make sure this is a page subscription
  if (req.body.object == "page") {
    // Iterate over each entry
    // There may be multiple entries if batched
    req.body.entry.forEach(function(entry) {
      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.postback) {
          processPostback(event);
        }
      });
    });

    res.sendStatus(200);
  }
});

function processPostback(event) {
  var senderId = event.sender.id;
  var payload = event.postback.payload;

  if (payload === "Greeting") {
    // Get user's first name from the User Profile API
    // and include it in the greeting
    request({
      url: "https://graph.facebook.com/v2.6/" + senderId,
      qs: {
        access_token: process.env.PAGE_ACCESS_TOKEN,
        fields: "first_name"
      },
      method: "GET"
    }, function(error, response, body) {
      var greeting = "";
      if (error) {
        console.log("Error getting user's name: " +  error);
      } else {
        var bodyObj = JSON.parse(body);
        name = bodyObj.first_name;
        greeting = "Bonjour " + name + ". ";
      }
      var message = greeting + "Je suis Marie, bienvenue chez YouScribe ! Je te propose de t'abonner aux notifications pour recevoir la presse tous les jours dans ton téléphone ! <3 ";
      sendMessage(senderId, {text: message,quick_replies:[
      {
        "content_type":"text",
        "title":"S'abonner",
        "payload":"abonnement"        
      },{
        "content_type":"text",
        "title":"Non merci",
        "payload":"no_abonnement"
      }
    ]});
      
            
        
    });
  }
    
    /* else if (payload === "abonnement") {
    // Get user's first name from the User Profile API
    // and include it in the greeting
    request({
      url: "https://graph.facebook.com/v2.6/" + senderId,
      qs: {
        access_token: process.env.PAGE_ACCESS_TOKEN,
        fields: "first_name"
      },
      method: "GET"
    }, function(error, response, body) {
      var rep_abonnement = "";
      if (error) {
        console.log("Error getting user's name: " +  error);
      } else {
        var bodyObj = JSON.parse(body);
        name = bodyObj.first_name;
        rep_abonnement = "Ok " + name + "! ";
      }
      var message2 = rep_abonnement + "Merci à toi, on va t'envoyer des notifications quand des nouveaux titres de presse sortent ! La presse de quel pays t'intéresse ? ";
      sendMessage(senderId, {text: message2,quick_replies:[
      {
        "content_type":"text",
        "title":"France",
        "payload":"france"        
      },{
        "content_type":"text",
        "title":"Côte d'Ivoire",
        "payload":"civ"
      },{
        "content_type":"text",
        "title":"Sénégal",
        "payload":"senegal"
      },{
        "content_type":"text",
        "title":"Burkina-Faso",
        "payload":"burkina"
      }
    ]});
      
            
        
    });
  }*/
    
    
    
    
    
}

// sends message to user
function sendMessage(recipientId, message) {
  request({
    url: "https://graph.facebook.com/v2.6/me/messages",
    qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
    method: "POST",
    json: {
      recipient: {id: recipientId},
      message: message,
    }
  }, function(error, response, body) {
    if (error) {
      console.log("Error sending message: " + response.error);
    }
  });
}