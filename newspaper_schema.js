var http = require ('http');
var mongoose = require ("mongoose");

var uristring =   process.env.MONGODB_URI;
var theport = process.env.PORT || 5000;

var Schema = mongoose.Schema;

var NewspaperSchema = new Schema({
     editor_name: String,
     real_name: String,
     last_id:String
     });
 module.exports = mongoose.model('newspaper', NewspaperSchema );

//var UserModel = mongoose.model('users', UserSchema );
