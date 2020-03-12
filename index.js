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

  activatePersistentMenu(senderId);

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
      if (error) {
        console.log("Error getting user's name: " +  error);
      } else {
        var bodyObj = JSON.parse(body);
        name = bodyObj.first_name;
      }
      sendGreeting(senderId,name);
    });
  }

  else if(payload == "NOTIFICATION_LETEMOIN")  {
      console.log("Payload détecté : " + payload);
      var message_a_envoyer = "Ok, on t'enverra des notifications à chaque fois que Le Témoin sort sur YouScribe";
      sendShortMessage(senderId, message_a_envoyer);
  }


  else if(payload == "NOTIFICATION_STADES")  {
      console.log("Payload détecté : " + payload);
      var message_a_envoyer = "Ok, on t'enverra des notifications à chaque fois que Stades sort sur YouScribe";
      sendShortMessage(senderId, message_a_envoyer);
  }

  else if(payload == "TALK_TO_YOUSCRIBE")  {
      console.log("Payload détecté : " + payload);
      var message_a_envoyer = "Ok, un membre de la team YouScribe va bientôt te contacter ! A tout de suite ! ;)";
      sendShortMessage(senderId, message_a_envoyer);
  }



}

function processMessage(senderId,event){
  console.log("Fonction en cours : processMessage");

  if(event.message.quick_reply)
  { console.log("quick_reply avec message text : "  +event.message.quick_reply.payload);
    var messagePayload = event.message.quick_reply.payload;

    if(messagePayload == "ABONNEMENT")  {
        console.log("Payload détecté : " + messagePayload);
        sendSelectCountry(senderId);
      }


    else if(messagePayload == "SENEGAL")  {
        console.log("Payload détecté : " + messagePayload);
        sendCarrouselSenegal(senderId);
    }
  }

  else
  { console.log("Pas de payload détecté");}
}





function activatePersistentMenu(recipientId) {
  console("Fonction en cours : activatePersistentMenu");
  request({
    url: "https://graph.facebook.com/v6.0/me/custom_user_settings",
    qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
    method: "POST",
    json: {
      psid: recipientId,
      persistent_menu: [
        {locale : "default",
        composer_input_disabled : "false",
        call_to_action : [
          {
            type : "postback",
            title : "Parler à la team YouScribe !",
            payload : "TALK_TO_YOUSCRIBE"
          },
          {
            type : "postback",
            title : "Redémarrer le bot",
            payload : "Greeting"
          },
          {
            type : "web_url",
            title : "Aller sur YouScribe",
            url : "https://www.youscribe.com/",
            webview_height_ratio : "full"
          }
        ]
        }
      ]
    }
  }, function(error, response, body) {
    if (error) {
      console.log("Error sending message: " + response.error);
    }
  });
}


function sendShortMessage(recipientId, message) {
  request({
    url: "https://graph.facebook.com/v2.6/me/messages",
    qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
    method: "POST",
    json: {
      recipient: {id: recipientId},
      message: {text : message}
    }
  }, function(error, response, body) {
    if (error) {
      console.log("Error sending message: " + response.error);
    }
  });
}


function sendGreeting(recipientId,userName) {
  request({
    url: "https://graph.facebook.com/v2.6/me/messages",
    qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
    method: "POST",
    json: {
      recipient: {id: recipientId},
      message: {
        text : "Bonjour "+ userName + " ! Je suis Marie, bienvenue chez YouScribe ! Je te propose de t'abonner aux notifications pour recevoir la presse tous les jours dans ton téléphone ! :) 📚 ",
        quick_replies : [
          { content_type : "text",
            title : "S'abonner",
            payload : "ABONNEMENT"
          },
          { content_type : "text",
            title : "Non merci",
            payload : "NON_ABONNEMENT"
          }
        ]

      }
    }
  }, function(error, response, body) {
    if (error) {
      console.log("Error sending message: " + response.error);
    }
  });
}


function sendSelectCountry(recipientId) {
  request({
    url: "https://graph.facebook.com/v2.6/me/messages",
    qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
    method: "POST",
    json: {
      recipient: {id: recipientId},
      message: {
        text : "Ok  super nouvelle ! Pour la presse de quel pays souhaitez vous recevoir des notifications ? ",
        quick_replies : [
          { content_type : "text",
            title : "🇸🇳 Sénégal",
            payload : "SENEGAL"
          },
          { content_type : "text",
            title : "🇨🇮 Côte d'Ivoire",
            payload : "COTE_D_IVOIRE"
          },
          { content_type : "text",
            title : "🇧🇫 Burkina-Faso",
            payload : "BURKINA_FASO"
          }
        ]

      }
    }
  }, function(error, response, body) {
    if (error) {
      console.log("Error sending message: " + response.error);
    }
  });
}


function sendCarrouselSenegal(recipientId) {
  console.log("Fonction en cours : sendCarrouselSenegal");
  request({
    url: "https://graph.facebook.com/v2.6/me/messages",
    qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
    method: "POST",
    json: {
      recipient: {id: recipientId},
      message: {
        attachment:{
          type: "template",
            payload: {
                template_type: "generic",
                image_aspect_ratio: "square",
                elements: [
                  {
            title: "Le Temoin",
            image_url:"http://delapierre.net/letemoin.jpg",
            subtitle: "Quotidien d'actualités" ,
            buttons: [
                {
                type: "postback",
                title: "Activer les notifications",
                payload: "NOTIFICATION_LETEMOIN"
                }
            ]
          },
          {
    title: "Stades",
    image_url:"http://delapierre.net/stades.jpg",
    subtitle: "Quotidien Sportif" ,
    buttons: [
        {
        type: "postback",
        title: "Activer les notifications",
        payload: "NOTIFICATION_STADES"
        }
    ]
  }
                ]
                      }
                    }
                }
  }
}, function(error, response, body) {
    if (error) {
      console.log("Error sending message: " + response.error);
    }
  });
}
