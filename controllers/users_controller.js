const User=require('../models/user');

module.exports ={
  greeting(req, res) {
    res.send({hi: 'there'});
  },

  create(req, res, next){
    // console.log(req.body);
    const userProps = req.body;
    User.create(userProps)
      .then(user=>res.status(201).send(user))
      .catch(next);
  },
  getUsers(req,res) {
    User.find({})
      .then(user=>res.send(user));
  },
  find(req,res,next){
    const userId=req.params.id;
    User.findById({_id:userId})
      .then(user=>res.send(user))
      .catch(next);
  },
  edit(req, res, next){
    const userId=req.params.id;
    const userProps=req.body;
    User.findByIdAndUpdate({_id: userId}, userProps)
      .then(()=>User.findById({_id:userId}))
      .then(user=>res.send(user))
      .catch(next);
  },
  delete(req, res, next){
    const userId=req.params.id;
    User.findByIdAndRemove({_id:userId})
      .then(user=>res.status(204).send(user))
      .catch(next);
  }
};