const bcrypt = require('bcrypt');
const {User, validateUser} = require('../models/user')

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
    res.status(201).send(user);
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
    // the followings code used the Promise-based syntax (save for reference)
    // User.findById({_id: userId}).
    //   then(user => res.status(200).send(user)).
    //   catch(next)
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

    // User.findByIdAndUpdate({_id: userId}, userProps).
    //   then(() => User.findById({_id: userId})).
    //   then(user => res.send(user)).
    //   catch(next)
  },
  async delete (req, res) {
    const userId = req.params.id;
    const user = await User.findByIdAndRemove(userId);
    if (!user) {
      return res.status(404).send({message: 'There is no user with the given id'});
    }
    res.status(204).send(user);
    // User.findByIdAndRemove({_id: userId}).
    //   then(user => res.status(204).send(user)).
    //   catch(next)
  },
}