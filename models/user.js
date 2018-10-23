const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  emailAddress: String,
  password: String
});

const User=mongoose.model('user',UserSchema);
// DO you have a collection called user? if Not, I am gonna create it

module.exports=User;