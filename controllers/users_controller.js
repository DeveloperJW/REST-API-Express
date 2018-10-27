const bcrypt = require('bcrypt');
const {User, validateUser, authenticate} = require('../models/user')

module.exports = {
  greeting (req, res) {
    res.send({hi: 'there'})
  },

  async create (req, res) {
    const userProps = req.body;
    const {error} = validateUser(userProps);
    if (error) {
      return res.status(400).send({message: error.details[0].message});
    }
    // check if the user has registered
    let user = await User.findOne({emailAddress: userProps.emailAddress});
    if (user) {
      return res.status(400).send({message: "There is already an account associated with this email."})
    }
    // currently, the user variable is null, need to initialize before hashing the password
    user = new User(userProps);
    // Hash the user password using bcrypt and async/await syntactical sugar
    const salt= await bcrypt.genSalt(10);
    user.password=await bcrypt.hash(userProps.password, salt);
    await user.save();
    // res.status(201).send(user);
    // set the location header to '/' as requested
    res.location('/').status(201).send();
  },

  listUsers (req, res, next) {
    User.find({}).then(user => res.send(user)).catch(next)
  },

  async find (req, res) {
    const userId = req.params.id;
    const user=await User.findById(userId);
    if (!user) {
      return res.status(404).send({message: 'There is no user with the given id'});
    }
    res.status(200).send(user);
  },

  async edit (req, res) {
    const userId = req.params.id;
    const userProps = req.body;
    const {error} = validateUser(userProps);
    if (error) {
      return res.status(400).send({message: error.details[0].message});
    }
    const user= await User.findByIdAndUpdate(userId, userProps);
    if (!user){
      return res.status(404).send({message: 'There is no user with the given id'});
    }
    res.status(204).send(user);

  },
  async delete (req, res) {
    const userId = req.params.id;
    const user = await User.findByIdAndRemove(userId);
    if (!user) {
      return res.status(404).send({message: 'There is no user with the given id'});
    }
    res.status(204).send(user);
  },
  async login (req, res) {
    const userProps = req.body;
    const password=userProps.password;
    const {error} = authenticate(userProps);
    if (error) {
      return res.status(400).send({message: error.details[0].message});
    }
    // check if the user has registered
    let user = await User.findOne({emailAddress: userProps.emailAddress});
    if (!user) {
      return res.status(400).send({message: "There is no user matching the given email address."});
    }
    // decrypt the password saved in MongoDB and compare with user's input password
    const result=await bcrypt.compare(password,user.password);
    if (!result){
      return res.status(401).send({message: "Wrong email or password."})
    } else{
      req.session.userId=user._id;
      // redirect to the home page when user successfully logs in
      // console.log('the password is correct.');
      return res.redirect('/');
    }
  },
}