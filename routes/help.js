const express = require('express');
const passport = require('passport');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const router = express.Router();
const bodyParser = require("path");
const nodemailer = require("nodemailer");
const request = require("request");
//grab TicketManager constructor
const TicketManager = require("ticketman").TicketManager;

router.get('/', ensureLoggedIn, function(req, res, next){ 
	var url, company;
	company = req.user._json["http://app/user_metadata"].company || "";

	url = "https://sheltered-everglades-91474.herokuapp.com/tickets/company/" + company;

	res.render('help', {
		url : url,
		company: company
	});
	
});

router.post("/createTicket",function(req,res){
	var PATH;
	
	PATH = "/api/tickets/new";

	options = {
        method: 'POST',
        url: "" + "https://sheltered-everglades-91474.herokuapp.com" + PATH,
        auth: {username: "ticket_access", password: "LumInar$1550"},
        json: {
          title: req.body.title,
          owner_id: req.user.nickname,
          category: req.body.category,
          content: req.body.content,
          priority: req.body.priority,
          company: req.user._json["http://app/user_metadata"].company,
          email: req.body.email
        }
    }

    sendTicket(options, function(err, ticket){
    	res.send(ticket);
    });
});

function sendTicket(options, callback){
    return request(options, function(err, res, body) {
        //debuglog("err:" + err + ", res.statusCode:" + (res != null ? res.statusCode : "n/a") + ", body:%j", body);
        if (err != null) {
          return callback(err);
        }
        if (res.statusCode !== 200) {
          return callback(new Error("Network error, res.statusCode:" + res.statusCode));
        }
        if (!((body != null) && body.success && body.ticket)) {
          return callback(new Error("Fail to create ticket:" + title + "#" + category + ", due to " + (body.error || "unknown error" + JSON.stringify(body))));
        }
        if (body.ticket._id != null) {
          body.ticket.id = body.ticket._id;
        }
        return callback(null, body.ticket);
    });
}

	// var ticketManager = new TicketManager(req.user.nickname, "https://sheltered-everglades-91474.herokuapp.com",{username: "ticket_access",password:"LumInar$1550"});
	
	
	// var title = req.body.title;
	// var category = req.body.category;
	// var priority = req.body.priority;
	// var company = req.user._json["http://app/user_metadata"].company;
	// var email = req.body.email;
	// var content = req.body.content;

	 // ticketManager.issue(title, category, content, function(err,ticket){
	 // 	console.log("error: ", err);
	 // 	console.log("ticket: ", ticket);
	 // 	console.log("finished");
		//res.send(ticket);
	

	//send email upon pressing the 'Add Ticket' button
	// let transporter = nodemailer.createTransport({
	//           service: 'gmail',
	//           secure: false,
	//           port: 25,
	//           auth: {
	//             user: 'maria.saavedra@luminartech.com',
	//             pass: 'Hayden25!'
	//           },
	//           tls: {
	//             rejectUnauthorized: false
	//           }
	//         });
	//       //Body of email message
	//       let HelperOptions = {
	//           from: req.body.Name + ' &lt;' + req.body.Email + '&gt;', //grab form data from the request body object
	//           to: 'customersupport@luminartech.com',
	//           subject:'Ticket Submission',
	//           text:"From:" +ticket.owner_id +"\n"+ "\n"+ "Email: " + req.body.email+"\n" + "\n"+ "Priority: " +req.body.priority +"\n"+ "\n"+ "TicketID: " + ticket.id +"\n" +"\n" + "Ticket Content: " +ticket.content 
	//       };

	//       //sends mail

	//       transporter.sendMail(HelperOptions, (error, info) => {
	//         if (error) {
	//           return console.log(error);
	//         }
	//         console.log("The message was sent!");
	//         console.log(info);
	//       });


	 //	res.send(ticket);
	 //});
//});

module.exports = router;