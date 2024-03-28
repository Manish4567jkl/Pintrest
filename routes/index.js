const express = require('express');
const router = express.Router();
const userModel = require('./users');
const passport = require('passport');
const upload = require('./multer');
const postModel = require('./posts'); // Import postModel
const localStrategy = require('passport-local').Strategy;

// Passport Configuration
passport.use(new localStrategy(userModel.authenticate()));
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/profile', isLoggedIn, async function(req, res) {
  try {
    if (!req.session.passport || !req.session.passport.user) {
      return res.status(401).send('User not authenticated');
    }
    const user = await userModel.findOne({ username: req.session.passport.user })
    .populate("posts")
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.render('profile', { user });
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).send('Internal server error');
  }
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
  res.render('login', { error: req.flash('error') }); // Sending a flash message
});

// Route for handling login form submission
router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true // Redirect back to login page on authentication failure
}));

router.get('/logout', function(req, res) {
  req.logout(); // Remove callback as it's not needed
  res.redirect('/');
});

router.post('/upload', upload.single('file'), async function(req, res, next) {
  if (!req.file) {
    return res.status(404).send('No files were given');
  }
  try {
    const user = await userModel.findOne({ username: req.session.passport.user });
    if (!user) {
      return res.status(404).send('User not found');
    }
    const postData = await postModel.create({
      images: req.file.filename,
      postText: req.body.caption,
      user: user._id
    });
    user.posts.push(postData._id); // Fixed variable name
    await user.save();
    res.redirect('/profile')

  } catch (err) {
    
    console.error('Error uploading post:', err);
    res.status(500).send('Internal server error');
  }
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

router.get('/feed', isLoggedIn, function(req, res) {
  res.render('feed');
});

module.exports = router;
