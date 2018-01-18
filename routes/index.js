const express = require('express');
const passport = require('passport');
const router = express.Router();

const user = require('./user.js');
const help = require('./help.js');
const faqs = require('./faqs.js');
const pig = require('./pig.js');
const sdk = require('./sdk.js');
const sampledata = require('./sampledata.js');

const env = {
  AUTH0_CLIENT_ID: 'YgOyoROHdEqHodKl1apjFd_xRmXd6ihn',
  AUTH0_DOMAIN: 'jhongertf.auth0.com',
  AUTH0_CALLBACK_URL: 'https://hidden-tor-70059.herokuapp.com/callback'
    //process.env.AUTH0_CALLBACK_URL || 'https://hidden-crag-53375.herokuapp.com/callback'
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/login', passport.authenticate('auth0', {
  clientID: env.AUTH0_CLIENT_ID,
  domain: env.AUTH0_DOMAIN,
  redirectUri: env.AUTH0_CALLBACK_URL,
  responseType: 'code',
  audience: 'https://' + env.AUTH0_DOMAIN + '/userinfo',
  scope: 'openid profile user_metadata'}),
  function(req, res) {
    res.redirect("/");
});

router.get('/logout', function(req, res) {
    req.session.destroy();
    req.logout();
    res.redirect('/');
  
});


router.get('/callback',
  passport.authenticate('auth0', {
    failureRedirect: '/failure'
  }),
  function(req, res) {
    res.redirect(req.session.returnTo || '/user');
  }
);

router.get('/failure', function(req, res) {
  var error = req.flash("error");
  var error_description = req.flash("error_description");
  req.logout();
  res.render('failure', {
    error: error[0],
    error_description: error_description[0],
  });
});

router.use('/user', user);
router.use('/help', help);
router.use('/faqs', faqs);
router.use('/pig', pig);
router.use('/sdk', sdk);
router.use('/sampledata', sampledata);


module.exports = router;
