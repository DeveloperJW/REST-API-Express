const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const User=require('./user');
const Joi = require('joi');
Joi.objectId=require('joi-objectid')(Joi);

const CourseSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  title:{
    type:String,
    required: true
  },
  description:{
    type:String,
    required: true
  },
  estimatedTime: String,
  materialsNeeded: String
});

const Course=mongoose.model('course',CourseSchema);

// Validation using Joi library
function validateCourse(course) {
  const schema = {
    user: Joi.objectId().required(),
    title: Joi.string().min(5).max(255).required(),
    description: Joi.string().min(1).required(),
    estimatedTime: Joi.string(),
    materialsNeeded: Joi.string()
  };

  return Joi.validate(course, schema);
}

module.exports= {Course, validateCourse};