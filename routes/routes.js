const UsersController= require('../controllers/users_controller');
const CoursesController = require('../controllers/courses_controller');

module.exports = (app) =>{
  app.get('/api', UsersController.greeting);
  app.get('/api/users', UsersController.getUsers);// get the all users
  app.get('/api/users/:id', UsersController.find);// get the user by id
  app.post('/api/users', UsersController.create);//Passing a reference to avoid instant run
  app.put('/api/users/:id', UsersController.edit);//Update user by id
  app.delete('/api/users/:id', UsersController.delete);//Delete User by id
};