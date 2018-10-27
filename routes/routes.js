const UsersController= require('../controllers/users_controller');
const CoursesController = require('../controllers/courses_controller');
const mid = require('../middleware');

module.exports = (app) =>{
  // Users Route
  app.get('/api', UsersController.greeting);
  app.get('/api/users', mid.requiresLogin, UsersController.listUsers);// get the all users
  app.get('/api/users/:id', UsersController.find);// get the user by id
  app.post('/api/users', UsersController.create);//Passing a reference to avoid instant run
  app.put('/api/users/:id', UsersController.edit);//Update user by id
  app.delete('/api/users/:id', UsersController.delete);//Delete User by id
  // Courses Route
  app.get('/api/courses',CoursesController.listCourses);// get the all courses
  app.get('/api/courses/:id',CoursesController.find);// get the course by id
  app.post('/api/courses', mid.requiresLogin, CoursesController.create);//Passing a reference to avoid instant run
  app.put('/api/courses/:id', mid.requiresLogin,CoursesController.edit);//Update course by id
  app.delete('/api/courses/:id', mid.requiresLogin, CoursesController.delete);//Delete Course by id

  //register and login routers
  // GET /register
  app.get('/register', function(req, res, next) {
    return res.render('register', { title: 'Sign Up' });
  });

  // GET /login
  app.get('/login', function(req, res, next) {
    return res.render('login', { title: 'Log In'});
  });

  // POST /login
  app.post('/login', UsersController.login);
  // GET /logout
  app.get('/logout', function(req, res, next) {
    if (req.session) {
      // delete session object
      req.session.destroy(function(err) {
        if(err) {
          return next(err);
        } else {
          return res.redirect('/');
        }
      });
    }
  });
};
