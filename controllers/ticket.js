(function() {
  var MAX_ATTEMPTS_BEFORE_ABANDON, MAX_TIME_ALLOWED_FOR_PROCESSING, STATUS, Ticket, crypto, debuglog, mongoose;

  const nodemailer = require("nodemailer");
  mongoose = require('mongoose');

  require('../models/ticket');

  Ticket = mongoose.model('Ticket');

  crypto = require('crypto');

  STATUS = require("../enums/ticket_status");

  MAX_ATTEMPTS_BEFORE_ABANDON = 16;

  MAX_TIME_ALLOWED_FOR_PROCESSING = 1000 * 60 * 60;

  debuglog = require("debug")("ticketman:controller:ticket");

  exports.index = function(req, res, next) {
    debuglog("index");
    res.render('tickets', {
      title: 'All Tickets',
      tickets: []
    });
  };

  exports.list = function(req, res, next) {

    var query, company;
    debuglog("list req.query: %j", req.query);
    query = Ticket.paginate(req.query || {}, '_id').select('-comments -content');

    company = req.user._json["http://app/user_metadata"].company;

    if(company !== "abc"){
      query.where({company: company});
    }

    if (req.query.status != null) {
      query.where({
        status: req.query.status
      });
    }
    query.execPagination(function(err, result) {
      if (err != null) {
        return next(err);
      }
      result.success = true;
      return res.json(result);
    });
  };

  exports.count = function(req, res, next) {
    var result, query, company;
    result = {};
    query = {};

    company = req.user._json["http://app/user_metadata"].company;

    if(company !== "abc"){
      query.company = company;
    }

      Ticket.count(query, function(err, count) {
      if (err != null) {
        next(err);
      }
      result.all = count;
      query.status = STATUS.PENDING;
      Ticket.count(query, function(err, count) {
        if (err != null) {
          next(err);
        }
        result[STATUS.PENDING] = count;
        query.status = STATUS.PROCESSING;
        Ticket.count(query, function(err, count) {
          if (err != null) {
            next(err);
          }
          result[STATUS.PROCESSING] = count;
          query.status = STATUS.COMPLETE;
          Ticket.count(query, function(err, count) {
            if (err != null) {
              next(err);
            }
            result[STATUS.COMPLETE] = count;
            query.status = STATUS.ABANDON;
            Ticket.count(query, function(err, count) {
              if (err != null) {
                next(err);
              }
              result[STATUS.ABANDON] = count;
              res.json(result);
            });
          });
        });
      });
    });
  };

  exports.show = function(req, res, next) {
    var id;
    debuglog("show");
    id = String(req.params.id || '');
    if (id == null) {
      return next();
    }
    Ticket.findById(id, function(err, ticket) {
      if (err != null) {
        return next(err);
      }
      res.render('showticket', {
        title: 'All Tickets',
        ticket: ticket
      });
    });
  };

  exports.create = function(req, res, next) {
    var ticket, title;
    debuglog("create");
    title = (req.body || {}).title;
    req.body.email = req.user._json.email;
    req.body.company = req.user._json["http://app/user_metadata"].company;
    req.body.owner_id = req.user.nickname;
    req.body.token = crypto.createHash('md5').update(title).digest('hex').toLowerCase();
    ticket = new Ticket(req.body);
    ticket.save((function(_this) {
      
        // return function(err) {
        //   if (err != null) {
        //     return res.json({
        //       success: false,
        //       error: err.toString()
        //     });
        //   } else {
        //     return res.json({
        //       success: true,
        //       ticket: ticket
        //     });
        //   }
        // };

        //send email upon pressing the 'Add Ticket' button
        let transporter = nodemailer.createTransport({
          service: 'gmail',
          secure: false,
          port: 25,
          auth: {
              user: 'jhongertf@gmail.com',
              pass: 'password!'
          },
          tls: {
            rejectUnauthorized: false
          }
        });
        //Body of email message
        let HelperOptions = {
          from: ticket.nickname + ' &lt;' + ticket.email + '&gt;',
          to: 'jhongertf@gmail.com',
          subject:'Ticket Submission',
          text:"From:" +ticket.owner_id +"\n"+ "\n"+ "Email: " + ticket.email+"\n" + "\n"+ "Priority: " +ticket.priority +"\n"+ "\n"+ "TicketID: " + ticket.id +"\n" +"\n" + "Ticket Content: " +ticket.content 
        };

        //sends mail
        transporter.sendMail(HelperOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
          console.log("The message was sent!");
          console.log(info);
        });

        res.redirect('/tickets'); 
    })(this));
  };

  exports.assign = function(req, res, next) {
    debuglog("assign, req.worker:%j", req.worker);
    req.body.worker = req.worker.name;
    Ticket.arrangeAssignment(req.body, function(err, ticket) {
      if (err != null) {
        return next(err);
      }
      if (ticket == null) {
        return res.json({
          success: false,
          error: "no pending ticket of " + req.body.category
        });
      }
      ticket.comments = [];
      return res.json({
        success: true,
        ticket: ticket
      });
    });
  };

  exports.comment = function(req, res, next) {
    var id;
    id = req.params.id || '';
    if (id == null) {
      return next();
    }
    req.body.name = req.worker.name;
    Ticket.addComment(id, req.body, function(err, ticket) {
      if (err != null) {
        return next(err);
      }
      if (ticket == null) {
        return res.json({
          success: false,
          error: "no commented ticket of " + id
        });
      }
      return res.json({
        success: true,
        ticket: ticket
      });
    });
  };

  exports.complete = function(req, res, next) {
    var id;
    id = String(req.params.id || '');
    if (id == null) {
      return next();
    }
    req.body.id = id;
    req.body.user = req.user.nickname;
    Ticket.changeStatus(req.body, STATUS.COMPLETE, function(err, ticket) {
      if (err != null) {
        return next(err);
      }
      if (ticket == null) {
        return next();
      }
      return res.redirect("/tickets");
    });
  };

  exports.giveup = function(req, res, next) {
    var comment, id;
    id = String(req.params.id || '');
    if (id == null) {
      return next();
    }
    req.body.id = id;
    comment = {
      name: req.body.name || req.worker.name,
      kind: "danger",
      content: req.body.reason || (req.worker.name + " fail to process this ticket")
    };
    Ticket.addComment(id, comment, function(err, ticket) {
      var targetStatus;
      if (err != null) {
        return next(err);
      }
      if (ticket == null) {
        return res.json({
          success: false,
          error: "missing ticket of " + id
        });
      }
      targetStatus = ticket.attempts < MAX_ATTEMPTS_BEFORE_ABANDON ? STATUS.PENDING : STATUS.ABANDON;
      Ticket.changeStatus(req.body, targetStatus, function(err, ticket) {
        if (err != null) {
          return next(err);
        }
        if (ticket == null) {
          return next();
        }
        ticket.update({
          $inc: {
            attempts: 1
          }
        }, function(err, numberAffected) {
          if (err != null) {
            return next(err);
          }
          ticket.attempts = numberAffected;
          return res.json(ticket);
        });
      });
    });
  };

  exports.abandon = function(req, res, next) {
    var id;
    id = String(req.params.id || '');
    if (id == null) {
      return next();
    }
    Ticket.findById(id, function(err, ticket) {
      if (err != null) {
        return next(err);
      }
      if (ticket == null) {
        return next();
      }
      if (ticket.status !== STATUS.PENDING) {
        return next(new Error("only pending ticket could be abandoned"));
      }
      Ticket.changeStatus({
        id: ticket.id,
        user: req.user.nickname
      }, STATUS.ABANDON, function(err, ticket) {
        if (err != null) {
          return next(err);
        }
        if (ticket == null) {
          return next();
        }
        return res.redirect("/tickets");
      });
    });
  };

  exports.adminComment = function(req, res, next) {
    var id;
    id = String(req.params.id || '');
    if (id == null) {
      return next();
    }
    req.body.content = req.body.content.trim();
    console.log("[ticket::==========] req.body.content:" + req.body.content);
    if (!req.body.content) {
      return next(new Error("please say something"));
    }
    req.body.kind = "warning";
    //req.body.name = "admin";
    req.body.name = req.user.nickname;
    Ticket.addComment(id, req.body, function(err, ticket) {
      if (err != null) {
        return next(err);
      }
      if (ticket == null) {
        return next();
      }
      return res.redirect("/tickets/" + id);
    });
  };

  exports.showStatus = function(req, res, next) {
    var query, token;
    token = req.params.token;
    if (!token) {
      res.json({
        "success": false,
        "error": "missing param token"
      });
      return;
    }
    query = {
      token: token
    };
    Ticket.findOne(query, function(err, ticket) {
      var data;
      if (err != null) {
        res.json({
          "success": false,
          "error": "" + err
        });
        return;
      }
      data = {
        "success": true
      };
      if (ticket != null) {
        data['result'] = {
          id: ticket.id,
          status: ticket.status
        };
      } else {
        data['result'] = null;
      }
      return res.json(data);
    });
  };

  setInterval(function() {
    var query;
    query = {
      $and: [
        {
          status: STATUS.PROCESSING
        }, {
          updated_at: {
            $lt: Date.now() - MAX_TIME_ALLOWED_FOR_PROCESSING
          }
        }
      ]
    };
    return Ticket.findOne(query, function(err, ticket) {
      var content, targetStatus;
      if (err != null) {
        console.error("ERROR [ticket::interval::cleanup] error:" + err);
        return;
      }
      if (ticket == null) {
        return;
      }
      if (ticket.attempts < MAX_ATTEMPTS_BEFORE_ABANDON) {
        content = "ticket processing overtime, set back to retry.";
        targetStatus = STATUS.PENDING;
      } else {
        content = "ticket exceeds max attemption, so abandon";
        targetStatus = STATUS.ABANDON;
      }
      ticket.comments.push({
        name: "admin",
        kind: "danger",
        content: content,
        date: Date.now()
      });
      ticket.status = targetStatus;
      ticket.save(function(err) {});
    });
  }, 2000);

}).call(this);
