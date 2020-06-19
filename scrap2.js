var express = require("express");
var request = require("request");
const rp = require('request-promise');
const $ = require('cheerio');
var fs = require('fs');
var co = require('co');
var mongoose = require ("mongoose");
var NewspaperModel = require('./newspaper_schema.js');
var UserModel = require('./user_schema.js');


run().catch(error => console.log(error.stack));

async function run(){

//Définition des paramètres de connexion à Mongoose
var uristring =   process.env.MONGODB_URI || "mongodb://heroku_4wq6mjkn:cnh4mlou3abk7sf9bbdcvbhvkk@ds037252.mlab.com:37252/heroku_4wq6mjkn";
var theport = process.env.PORT || 5000;

//Connexion à Mongoose
await mongoose.connect(uristring, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


async function scrapLastId(editor_name)
{
  //Construction de l'URL des pages éditeurs
  const url = 'https://www.youscribe.com/'+editor_name+"/";
  //Connexion à cette URL
  rp(url)
    .then(function(html){
      const newspaperUrls = [];
      const newspaperId = [];
      //Scroll les 10 premiers items de la page éditeurs
      //Par défaut, les pages éditeurs affichent les items les plus récents en premier
      for (let i = 0; i < 10; i++) {
        //Récupération des tags href
        newspaperUrls.push($('.l-productResult-thumb > a', html)[i].attribs.href);

        var href=$('.l-productResult-thumb > a', html)[i].attribs.href;

        //On tronque pour garder la partie avec l'ID produit
        var id= href.substring(href.length - 7, href.length);

        //On insère l'ID produit dans un tableau
        newspaperId.push(id);
      }

      //Récupère l'ID le plus élevé => i.e. le produit le plus récent
      var lastId = Math.max(...newspaperId);

      return lastId;
});
}

scrapLastId("gbich-editions").then(function(result){
  console.log(result);
});




/*
const cursor = NewspaperModel.find().cursor();

for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
  console.log(doc); // Prints documents one at a time
}
*/
/*
NewspaperModel.find().
  then(newspaper => {
    console.log(newspaper.length);
    for(var i=0;i<newspaper.length;i++)
    {
    console.log(newspaper[i].editor_name);
  }
  });
*/
await process.exit();

}
