const express = require('express');
const passport = require('passport');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const router = express.Router();

router.get('/faqs', ensureLoggedIn, function(req, res, next){
	res.render('faqs');
});

router.get('/help', function(req, res, next){
	res.render('help', {
      title: 'All Tickets',
      tickets: []
    });
});

router.get('/pig', ensureLoggedIn, function(req, res, next){
	res.render('pig');
});

router.get('/sampledata', ensureLoggedIn, function(req, res, next){
	res.render('sampledata');
});

router.get('/sdk', ensureLoggedIn, function(req, res, next){
	res.render('sdk');
});

router.get('/user', ensureLoggedIn, function(req, res, next){
  res.render('user', {
    user: req.user
  });
});

module.exports = router;