$(function() {
    var windowLoc = $(location).attr('pathname');
    var add_product_url = "http://127.0.0.1:5000/api/add-products";
    var all_products_url = "http://127.0.0.1:5000/api/search";
    var bucket_url = "https://jf-test-bucket.s3.eu-west-2.amazonaws.com/"

    switch (windowLoc) {
        case "/":
            add_product_ajax_GET();
            add_product_ajax_POST();
            break;
        case "/search":
            search_ajax_GET();
            search_ajax_POST();
            break;
    }

    // SEARCH PRODUCTS
    function search_ajax_GET() {
        $.ajax({
            type: "GET",
            cache: false,
            url: all_products_url,
            dataType: "json",
            success: function(response_object) {
                load_search_result(bucket_url, response_object);
            },
            error: function(jqXHR) {
                alert("error: " + jqXHR.status);
                console.log(jqXHR);
            }
        })
    }

    function search_ajax_POST() {
        $('#search-word-button').on('click', function(event) {
            event.preventDefault();
            const word = $('#formSearchWord').val()

            $.ajax({
                type: "POST",
                cache: false,
                url: all_products_url + "/" + word,
                dataType: "json",
                success: function(response_object) {
                    console.log(response_object.Body)
                    load_search_result(bucket_url, response_object);
                },
                error: function(jqXHR) {
                    alert("error: " + jqXHR.status);
                    console.log(jqXHR);
                }
            })
        })
    }

    // ADD PRODUCTS
    function add_product_ajax_GET() {
        $.ajax({
            type: "GET",
            cache: false,
            url: add_product_url,
            dataType: "json",
            success: function(response_object) {
                load_existing_tags(response_object.Body)
            },
            error: function(jqXHR) {
                alert("error: " + jqXHR.status);
                console.log(jqXHR);
            }
        })
    }

    function add_product_ajax_POST() {
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
                url: add_product_url,
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
    }



});