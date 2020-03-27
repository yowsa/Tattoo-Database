var windowLoc = $(location).attr('pathname');
var local = true

var url_host = $(location).attr('host');

if (local) {
    var add_product_url = "http://127.0.0.1:5000/api/add-products";
    var product_url = "http://127.0.0.1:5000/api/product";
    var tags_url = "http://127.0.0.1:5000/api/tags";
    var all_products_url = "http://127.0.0.1:5000/api/search";
} else {
    var add_product_url = "http://tattoos-env.eu-west-2.elasticbeanstalk.com/api/add-products";
    var product_url = "http://tattoos-env.eu-west-2.elasticbeanstalk.com/api/product";
    var tags_url = "http://tattoos-env.eu-west-2.elasticbeanstalk.com/api/tags";
    var all_products_url = "http://tattoos-env.eu-west-2.elasticbeanstalk.com/api/search";
}


var bucket_url = "https://jf-test-bucket.s3.eu-west-2.amazonaws.com/";

// SEARCH PRODUCTS
function search_ajax_GET() {
    $.ajax({
        type: "GET",
        cache: false,
        url: all_products_url,
        dataType: "json",
        success: function(response_object) {
            load_images(bucket_url, response_object.Body)
        },
        error: function(jqXHR) {
            alert("error: " + jqXHR.status);
            console.log(jqXHR);
        }
    })
}

function search_unique_tags_GET() {
    $.ajax({
        type: "GET",
        cache: false,
        url: tags_url,
        dataType: "json",
        success: function(response_object) {
            load_tag_selector(response_object.Body);
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
        search_word(word);
    })
}

function select_category_POST() {
    $('.tag-selector').on('change', function() {
        search_word(this.value);
    });
}

function menu_category_POST() {
    $('.menu_category').on('click', function() {
        event.preventDefault();
        word = $(this).text();
        search_word(word);
    });
}

function search_word(word) {
    var api_url = all_products_url + "/" + word;
    var method = "POST";
    if (!word || word.toLowerCase() == 'all') {
        api_url = all_products_url;
        method = "GET";
    };
    $.ajax({
        type: method,
        cache: false,
        url: api_url,
        dataType: "json",
        success: function(response_object) {
            load_images(bucket_url, response_object.Body)
        },
        error: function(jqXHR) {
            alert("error: " + jqXHR.status);
            console.log(jqXHR);
        }
    })
}



// ADD PRODUCTS
function add_product_ajax_GET() {
    $.ajax({
        type: "GET",
        cache: false,
        url: tags_url,
        dataType: "json",
        success: function(response_object) {
            load_tag_cloud(response_object.Body)
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
                if (response_object.ErrorCode != "OK") {
                    alert_message(response_object.Message)
                } else {
                    alert_message(response_object.Message, "alert-success")
                }

            },
            error: function(jqXHR) {
                alert("error: " + jqXHR.status);
                console.log(jqXHR);
            }
        })
    })
}

function delete_product_ajax(html, item_id) {
    $(html).on('click', function(e) {
        event.preventDefault();

        $.ajax({
            type: "DELETE",
            cache: false,
            url: product_url + "/" + item_id,
            dataType: "json",
            success: function(response_object) {
                alert(response_object.Message)
                $(e.target).parents('.modal').modal('hide');
                $("#" + item_id).remove()

            },
            error: function(jqXHR) {
                alert("error: " + jqXHR.status);
                console.log(jqXHR);
            }
        })
    })
}