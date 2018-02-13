const express = require('express');
const passport = require('passport');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const router = express.Router();

router.get('/help', ensureLoggedIn, function(req, res, next){
	res.render('help', {
      title: 'All Tickets',
      tickets: []
    });
});

module.exports = router;