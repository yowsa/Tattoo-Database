var bucket_url;

function load_paths() {
    $.ajax({
        type: "GET",
        cache: false,
        url: "/api/paths",
        dataType: "json",
        success: function(response_object) {
            $('#bucket-url').val(response_object['bucket_url'])
            bucket_url = response_object['bucket_url'];
        },
        error: function(jqXHR) {
            alert("error: " + jqXHR.status);
            console.log(jqXHR);
        }
    })

}



// SEARCH PRODUCTS
function load_front_page_GET() {
    $.ajax({
        type: "GET",
        cache: false,
        url: "/api/search/random",
        dataType: "json",
        success: function(response_object) {
            front_page(response_object.Body)
        },
        error: function(jqXHR) {
            alert("error: " + jqXHR.status);
            console.log(jqXHR);
        }
    })
}


function search_ajax_GET() {
    $.ajax({
        type: "GET",
        cache: false,
        url: "/api/search",
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
        url: "/api/tags",
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
    $('#search-word-button').on('keypress click', function(event) {
        event.preventDefault();
        if (event.which === 13 || event.type === 'click') {
            const word = $('#formSearchWord').val();
            $('#formSearchWord').blur();
            $('.tag-selector').get(0).selectedIndex = 0;
            search_word(word);
        }
    })
}

function select_category_POST() {
    $('.tag-selector').on('change', function() {
        $('#formSearchWord').val("");
        search_word(this.value);
    });
}

function tag_search_POST() {
    $('.search-tags').on('click', function() {
        event.preventDefault();
        word = $(this).attr('value');
        search_word(word);
    });
}

function search_word(word) {
    var api_url = "/api/search/" + word;
    var method = "POST";
    if (!word || word.toLowerCase() == 'all') {
        api_url = "/api/search";
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
        url: "/api/tags",
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
            url: "/api/add-products",
            dataType: "json",
            success: function(response_object) {
                clear_add_product_form()
                if (response_object.ErrorCode != "OK") {
                    alert_message(response_object.Message)
                } else {
                    load_latest_added_product(response_object.PngPath, response_object.Body, response_object.Tags)
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
    $(html).on('click', function(event) {
        event.preventDefault();

        $.ajax({
            type: "DELETE",
            cache: false,
            url: "/api/product/" + item_id,
            dataType: "json",
            success: function(response_object) {
                alert(response_object.Message)
                $('.modal').modal('hide');
                $("#" + item_id).remove()

            },
            error: function(jqXHR) {
                alert("error: " + jqXHR.status);
                console.log(jqXHR);
            }
        })
    })
}

function update_tags_ajax(element, item_id, tag_element) {
    $(element).on('click', function(event) {
        event.preventDefault();
        var tags = tag_element[0]["innerText"]

        $.ajax({
            type: "PUT",
            data: JSON.stringify({ "tags": tags }),
            contentType: "application/json",
            cache: false,
            url: "/api/product/" + item_id,
            dataType: "json",
            success: function(response_object) {
                alert(response_object.Message)
                if ($('.modal.show').length) {
                    $('.modal').modal('hide');
                }
            },
            error: function(jqXHR) {
                alert("error: " + jqXHR.status);
                console.log(jqXHR);
            }
        })
    })

}