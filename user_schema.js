var http = require ('http');
var mongoose = require ("mongoose");

var uristring =   process.env.MONGODB_URI;
var theport = process.env.PORT || 5000;

var Schema = mongoose.Schema;

var UserSchema = new Schema({
     chatfuel_user_id: String,
     newspaper_id: String,
     newspaper_url:String
     });
 module.exports = mongoose.model('notifications', UserSchema );

//var UserModel = mongoose.model('users', UserSchema );
