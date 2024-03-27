const express = require('express');
const router = express.Router();
const userModel = require('./users');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

// Passport Configuration
passport.use(new localStrategy(userModel.authenticate()));
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile')
});

router.post('/register', function(req, res) {
  const { username, email, password, fullName } = req.body;
  const userData = new userModel({ username, email, fullName });

  userModel.register(userData, password, function(err, user) {
    if (err) {
      console.error('Error registering user:', err);
      return res.status(500).send('Error registering user');
    }

    passport.authenticate('local')(req, res, function() {
      res.redirect('/profile');
    });
  });
});

// Route for rendering the login page
router.get('/login', function(req, res) {
  res.render('login');
});

// Route for handling login form submission
router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/login', // Redirect back to login page on authentication failure
}));

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

router.get('/feed' ,isLoggedIn, function(req,res){
  res.render('feed')
})



module.exports = router;
