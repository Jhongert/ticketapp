(function() {
  var path;

  path = require('path');

  module.exports = {
    development: {
      db: 'mongodb://localhost/ticketman_dev',
      //db: 'mongodb://heroku_jxzsxd7z:ca16e7l70k1dnpttlhuf6vm2o5@ds125623.mlab.com:25623/heroku_jxzsxd7z',
     
      ssl: {
        ca: "../ssl/__luminartech_com.ca-bundle", 
        cert: "../ssl/luminartech_com.crt",
        key: "../ssl/luminartech_com.key"
        }
    },
    test: {
      db: 'mongodb://localhost/ticketman_test'
    },
    production: {
      db: 'mongodb://localhost/ticketman',
      //db: 'mongodb://heroku_jxzsxd7z:ca16e7l70k1dnpttlhuf6vm2o5@ds125623.mlab.com:25623/heroku_jxzsxd7z',
      app: {
        name: 'Ticket System'
      }
    }
  };

}).call(this);
