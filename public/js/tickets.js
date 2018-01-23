var yourTickId = "Thank you for your submission. A Luminar representative will contact you shortly." 



$("#addTicket").on("click", function(event){
	event.preventDefault();
	
	var data = {
		title : $("#myTitle").val().trim(),
		priority : $("#myPriority").val().trim(),
		content : $(".md-textarea").val().trim()
	}
	
	$.post("/api/tickets/new",data , function(ticket, err){
		console.log(ticket);

		//$("#ticketIdHolder").append("<h3>"+"Your Ticket ID is: "+ ticket.id+ "</h3>").prepend("<h3>"+yourTickId+"</h3>");

	})
});

if(window.jQuery){

	var TICKET_STATUS_TO_INFO_TYPE = {
	  pending: 'default',
	  processing: 'primary',
	  completed: 'success',
	  abandoned: 'danger'
	};

	var genDateTag = function(date) {
	    var dateStr, isoStr;
	    isoStr = date instanceof Date ? date.toISOString() : date;
	    dateStr = date instanceof Date ? date.toDateString() : date;
	    return "<small title='" + isoStr + "' class='muted timeago'>" + dateStr + "</small>";
	};

	var genLabelByStatus = function(status) {
	    return "<span class='label label-" + (TICKET_STATUS_TO_INFO_TYPE[status] || 'default') + "'>" + status + "</span>";
	}

	var mscroller = $(window).mongooseEndlessScroll({
	    itemsToKeep: -1,
	    serviceUrl : "/api/tickets/list.json",
	    container : $("#list"),
	    intervalFrequency: 200,
	  	elControlDown : $("#loading-next"),
	  	htmlEnableScrollUp : "<i class='fa fa-chevron-up'></i> More Newerer Tickets",
	  	htmlEnableScrollDown :  "<i class='fa fa-chevron-down'></i> More Older Tickets",
	  	htmlLoading : "<i class='fa fa-spinner fa-spin'></i> Loading...",
	  	onChange : function(){
	    	if($(".timeago").length > 0) $(".timeago").prettyDate({"interval":false});
	  	},
	  	formatItem: function(item) {
	    	return "<a href=\"api/tickets/" + item._id + "\" class=\"list-group-item\" id=\"" + item._id + "\">\n  <div class=\"row\"><div class=\"col-md-1\">" + (genLabelByStatus(item.status)) + " </div>\n  <div class=\"col-md-3\"><small><code>" + item._id + "</code></small></div>\n  <div class=\"col-md-4\">" + item.title + "</div>\n  <div class=\"col-md-1\">" + item.priority + "</div>\n  <div class=\"col-md-1 text-right\">" + (genDateTag(item.created_at)) + "</div>\n  <div class=\"col-md-1 text-right\">" + (genDateTag(item.updated_at)) + "</div>\n  <div class=\"col-md-1\">" + item.attempts + "</div></div></a>";
	  	}

	});

	// refresh ticket counts
	$(document).ready(function() {
	  	setInterval(function(){
	    	$.get("/api/tickets/count.json", function(data){
	      		for(var key in data){
	        		$("#count-"+key).text(data[key]);
	      		}
	    	})
	  	}, 3000)
	});

	// listen to tab switch
	$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
	 	 mscroller.empty();
	  	var status = (e.target.id || "").substr(5);
	  	mscroller.query = status === "all" ? {} : {"status" : status};
	  	mscroller.fetchDown();
	});

}