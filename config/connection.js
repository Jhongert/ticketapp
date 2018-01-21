var mongoose = require('mongoose');

mongoose.Promise = Promise;

mongoose.connect('mongodb://localhost/ticketappdb');
//mongoose.connect('mongodb://heroku_4962b7w2:4ak9oils3680dclgrhprn0js3b@ds139884.mlab.com:39884/heroku_4962b7w2');

var db = mongoose.connection;

db.on('error', function(){
	console.log('Connection error')
});

db.once('open', function(){
	console.log('Connected to DB')
});

module.exports = db;