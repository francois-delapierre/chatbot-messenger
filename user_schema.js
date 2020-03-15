var http = require ('http');
var mongoose = require ("mongoose");

var uristring =   process.env.MONGODB_URI;
var theport = process.env.PORT || 5000;

var Schema = mongoose.Schema;

var UserSchema = new Schema({
     psid: String,
     subscriptionVDA: String,
     });
 module.exports = mongoose.model('users', UserSchema );

//var UserModel = mongoose.model('users', UserSchema );
