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

      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);

      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log('Sender PSID: ' + sender_psid);



      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.postback) {
          processPostback(event);
        }
        else if(event.message)
        {
          processMessage(sender_psid,event);
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
      console.log("premier message envoyé");
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



}

function processMessage(senderId,event)
{
  console.log("on est arrivé à la fonction processMessage");

  if(event.message.quick_reply)
  { console.log("on atrouvé le payload : " + event.message.quick_reply);
  /*  var messagePayload = event.message.quick_reply.payload;
    if(messagePayload == "abonnement")
    {
        console.log("on a checké le messagePayload, et c'est abonnement ! ");
      var message = "Ok super nouvelle ! Pour la presse de quel pays souhaitez vous recevoir des notifications ? ";
      sendMessage(senderId, {text: message,quick_replies:[
      {
        "content_type":"text",
        "title":"Côte d'Ivoire",
        "payload":"civ"
      },{
        "content_type":"text",
        "title":"Sénégal",
        "payload":"senegal"
      },{
        "content_type":"text",
        "title":"Brukina-Faso",
        "payload":"burkina"
      }
    ]});
  }*/
  }
  else
  { console.log("pas de payload dans le message");}

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
