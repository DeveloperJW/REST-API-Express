const {Course, validateCourse} = require('../models/course');
const {User} = require('../models/user');

module.exports = {
  greeting (req, res) {
    res.send({hi: 'there'})
  },
  async create (req, res) {
    const courseProps = req.body;
    const {error} = validateCourse(courseProps);
    if (error) {
      return res.status(400).send({message: error.details[0].message});
    }
    // check if the userId exists in the database
    const user = await User.findById(courseProps.user);
    if (!user) {
      return res.status(400).send({message: "There is no such user with given userId."})
    }
    // currently, the course variable is null, need to initialize before hashing the password
    const course = new Course(courseProps);
    await course.save();
    res.status(201).send(course);
  },
  // Promised based syntax, display all courses from database
  listCourses (req, res, next) {
    Course.find({}).then(course => res.status(200).send(course)).catch(next)
  },

  async find (req, res) {
    const courseId = req.params.id;
    const course=await Course.findById(courseId);
    if (!course) {
      return res.status(404).send({message: 'There is no course with the given id'});
    }
    res.status(200).send(course);
  },

  async edit (req, res) {
    const courseId = req.params.id;
    const courseProps = req.body;
    const {error} = validateCourse(courseProps);
    if (error) {
      return res.status(400).send({message: error.details[0].message});
    }
    // check if the userId exists in the database
    const user = await User.findById(courseProps.user);
    if (!user) {
      return res.status(400).send({message: "There is no such user with given userId."})
    }
    const course= await Course.findByIdAndUpdate(courseId, courseProps);
    if (!course){
      return res.status(404).send({message: 'There is no course with the given id'});
    }
    res.status(204).send(course);

  },
  async delete (req, res) {
    const courseId = req.params.id;
    const course = await Course.findByIdAndRemove(courseId);
    if (!course) {
      return res.status(404).send({message: 'There is no course with the given id'});
    }
    res.status(204).send(course);
  },
}