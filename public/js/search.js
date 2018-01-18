$("#filter").keyup(function () {
	// body...

	//retrieve this input field text 
	var filter = $(this).val();
	console.log("filter:", filter);
	//loop trough the site info

	$(".faqsList .blocks").each(function(){

		//If the tags do not contain the text phrase fade it out
		if($(this).text().search(new RegExp(filter, "i")) <0) {
			$(this).fadeOut();
		}else {
			//show the text item if the phrase matches
			$(this).show();
		}
	});
});