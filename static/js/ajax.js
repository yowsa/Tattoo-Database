$(function() {
    var qurl = "http://127.0.0.1:5000/api/add-products";
    $.ajax({
        type: "GET",
        cache: false,
        // data: { keyword: search_word },
        url: qurl,
        dataType: "json",
        success: function(response_object) {
            load_existing_tags(response_object.Body)
        },
        error: function(jqXHR) {
            alert("error: " + jqXHR.status);
            console.log(jqXHR);
        }
    })
});