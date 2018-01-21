const express = require('express');
const passport = require('passport');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const router = express.Router();

var controller;
controller = require("../ticketman/lib/controllers/ticket");

router.get('/tickets', controller.index);

// router.get('/help', ensureLoggedIn, function(req, res, next){
// 	res.render('help');
// });

// router.get('/pig', ensureLoggedIn, function(req, res, next){
// 	res.render('pig');
// });

// router.get('/sampledata', ensureLoggedIn, function(req, res, next){
// 	res.render('sampledata');
// });

// router.get('/sdk', ensureLoggedIn, function(req, res, next){
// 	res.render('sdk');
// });

// router.get('/user', ensureLoggedIn, function(req, res, next){
//   res.render('user', {
//     user: req.user
//   });
// });


    // var controller;
    // controller = require("../controllers/ticket");
    // app.get('/', controller.index);

    // app.get('/tickets', controller.index);
    // app.get('/tickets/company/:company', controller.company);
    // app.get('/tickets/list.json', controller.list);
    // app.get('/tickets/count.json', controller.count);
    // app.get('/tickets/:id', controller.show);
    // app.get('/tickets/:token/status', controller.showStatus);
    // app.post('/tickets/:id/abandon', controller.abandon);
    // app.post('/tickets/:id/complete', controller.complete);
    // app.post('/tickets/:id/giveup', controller.giveup);
    // app.post('/tickets/:id/comment', controller.adminComment);
    // app.post('/api/tickets/new', controller.create);
    // app.put('/api/tickets/assign', m.authWorker, controller.assign);
    // app.put('/api/tickets/:id/comment', m.authWorker, m.updateWorkerAt, controller.comment);
    // app.put('/api/tickets/:id/complete', m.authWorker, controller.complete);
    // app.put('/api/tickets/:id/giveup', m.authWorker, controller.giveup);
    // controller = require("../controllers/worker");
    // app.get('/workers.:format?', controller.index);
    // app.post('/workers/new.:format?', controller.create);
    // return app.post('/workers/trashed', controller.trashed);
 

module.exports = router;