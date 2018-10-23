const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User=require('./user');

const CourseSchema = new Schema({
  user: User,
  title:String,
  description:String,
  estimatedTime: String,
  materialsNeeded: String
});

const Course=mongoose.model('course',CourseSchema);

module.exports=Course;