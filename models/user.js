const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');

const UserSchema = new Schema({
  firstName: {
    type:String,
    required: true
  },
  lastName: {
    type:String,
    required: true
  },
  emailAddress: {
    type: String,
    unique: true
  },
  password: {
    type:String,
    required: true
  }
});

// create User model and create a collection called user if not exists.
const User=mongoose.model('user', UserSchema);

// Validation using Joi library
function validateUser(user) {
  const schema = {
    firstName: Joi.string().min(1).max(50).required(),
    lastName: Joi.string().min(1).max(50).required(),
    emailAddress: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  };

  return Joi.validate(user, schema);
}

// module.exports={User, UserSchema};
module.exports= {User, validateUser};