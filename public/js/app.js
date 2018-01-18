var yourTickId = "Thank you for your submission. A Luminar representative will contact you shortly." 



$("#addTicket").on("click", function(event){
	event.preventDefault();
	
	var data = {
		title : $("#myTitle").val().trim(),
		category : $("#myCategory").val().trim(),
		priority : $("#myPriority").val().trim(),
		email : $("#myEmail").val().trim(),
		content : $(".md-textarea").val().trim(),
		company : $("#myCompany").val()
	}


	 // var title = $("#myTitle").val().trim();
	 // var category = $("#myCategory").val().trim();
	 // var priority = $("#myPriority").val().trim();
	 // var email = $("#myEmail").val().trim();
	 // var content = $(".md-textarea").val().trim();
	 // var company = $("#myCompany").val();
	
	$.post("/help/createTicket",data , function(ticket, err){

		console.log("data:", ticket);
		console.log("error: ", err);

		$("#ticketIdHolder").append("<h3>"+"Your Ticket ID is: "+ ticket.id+ "</h3>").prepend("<h3>"+yourTickId+"</h3>");

	})
});