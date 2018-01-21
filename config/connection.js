var mongoose = require('mongoose');

mongoose.Promise = Promise;

//mongoose.connect('mongodb://localhost/ticketappdb');
mongoose.connect('mongodb://heroku_1ckt89vm:meultnnq5dorikshr9o23r00a4@ds111258.mlab.com:11258/heroku_1ckt89vm');

var db = mongoose.connection;

db.on('error', function(){
	console.log('Connection error')
});

db.once('open', function(){
	console.log('Connected to DB')
});

module.exports = db;