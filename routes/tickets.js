const express = require('express');
const passport = require('passport');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const router = express.Router();

var controller;
controller = require("../controllers/ticket");

router.get('/', ensureLoggedIn, controller.index);
router.get('/list.json', ensureLoggedIn, controller.list);
router.get('/count.json', ensureLoggedIn, controller.count);
router.post('/new', ensureLoggedIn, controller.create);
router.get('/:id', ensureLoggedIn, controller.show);
router.post('/:id/abandon', ensureLoggedIn, controller.abandon);
router.post('/:id/complete', ensureLoggedIn, controller.complete);
router.post('/:id/comment', ensureLoggedIn, controller.adminComment);

module.exports = router;