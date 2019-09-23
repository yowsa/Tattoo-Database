let data = "";


$.ajax({
	type:"GET",
	dataType: "json",
	url: "/all",
	data: data,
	success: function(x){
		console.log(x);

	}

})