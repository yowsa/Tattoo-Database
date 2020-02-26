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

    $('#add-product-button').on('click', function(event) {
        event.preventDefault();
        const vector_file = document.getElementById('formVectorInput').files[0];
        const png_file = document.getElementById('formPngInput').files[0] ? document.getElementById('formPngInput').files[0] : false;
        const tags = get_product_tags();
        if (!vector_file) {
            alert_message("Add a vector file");
            return
        };
        if (!tags.length) {
            alert_message("Add at least one tag");
            return
        };
        var formData = new FormData();
        formData.append('vector_file', vector_file);
        formData.append('png_file', png_file);
        formData.append('tags', tags);

        $.ajax({
            type: "POST",
            cache: false,
            processData: false,
            contentType: false,
            data: formData,
            url: qurl,
            dataType: "json",
            success: function(response_object) {
                console.log(response_object)
                clear_add_product_form()
            },
            error: function(jqXHR) {
                alert("error: " + jqXHR.status);
                console.log(jqXHR);
            }
        })



    })


});