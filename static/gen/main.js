function add_tag() {
    $('#formAddTagInput').keypress(function() {
        if (event.which == 13) {
            event.preventDefault();
            let tag = '<button type="button" class="btn btn-outline-dark tag">' + $('#formAddTagInput').val() + '</button>'
            $('#product-tags').append(tag);
            $('#product-tags').append(" ");
            $('#formAddTagInput').val("");
        }
    });
}

function delete_tag() {
    $('#product-tags').on('click', '.tag', function() {
        if ($('#product-tags').find(this).hasClass('existing-tag')) {
            $('#tag-cloud').append(this);
            $('#tag-cloud').append(" ");
        }
        $('#product-tags').find(this).remove();
    });
}

function add_existing_tag() {
    $('#tag-cloud').on('click', '.tag', function() {
        $('#product-tags').append(this);
        $('#product-tags').append(" ");
    });
}

function load_existing_tags(unique_tags_info) {
    unique_tags_info.forEach(tag_info => {
        let tag_html = '<button type="button" class="btn btn-outline-dark tag existing-tag">' + tag_info[0] + '</button>'
        $('#tag-cloud').append(tag_html);
        $('#tag-cloud').append(" ");
    });
}

function get_product_tags() {
    let tags = [];
    $('#product-tags button').each(function() {
        tags.push($(this).text());
    });
    return tags;
}

function clear_add_product_form() {
    $('#add-product-form').trigger("reset");
    const product_tags = $('#product-tags').html()
    $('#tag-cloud').append(product_tags);
    $('#product-tags').text("")
}

function alert_message(message) {
    $('#alerts').append('<div class="alert alert-danger" role="alert">' +
        message + '</div>');
}


function setup() {
    add_tag();
    delete_tag();
    add_existing_tag();
}


$(function() {
    setup();
});
function load_search_result(bucket_url, response_object) {
    $('#search-images').html("")
    response_object.Body.forEach(item => {
        $('#search-images').append("<img src='" + bucket_url + item.PngPath + "'>");
    });

}
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