const express = require('express');
const passport = require('passport');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const router = express.Router();

var controller;
controller = require("../controllers/ticket");

router.get('/tickets', ensureLoggedIn, controller.index);
router.get('/tickets/count.json', ensureLoggedIn, controller.count);
router.get('/tickets/list.json', ensureLoggedIn, controller.list);
router.post('/tickets/new', ensureLoggedIn, controller.create);
router.get('/tickets/:id', ensureLoggedIn, controller.show);
router.post('/tickets/:id/abandon', ensureLoggedIn, controller.abandon);
router.post('/tickets/:id/complete', ensureLoggedIn, controller.complete);
router.post('/tickets/:id/comment', ensureLoggedIn, controller.adminComment);

module.exports = router;