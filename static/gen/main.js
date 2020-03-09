function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}



window.showBSModal = function self(options) {

    var options = $.extend({
        title: '',
        body: '',
        remote: false,
        backdrop: 'static',
        size: false,
        onShow: false,
        onHide: false,
        actions: false
    }, options);

    self.onShow = typeof options.onShow == 'function' ? options.onShow : function() {};
    self.onHide = typeof options.onHide == 'function' ? options.onHide : function() {};

    if (self.$modal == undefined) {
        self.$modal = $('<div class="modal fade"><div class="modal-dialog"><div class="modal-content"></div></div></div>').appendTo('body');
        self.$modal.on('shown.bs.modal', function(e) {
            self.onShow.call(this, e);
        });
        self.$modal.on('hidden.bs.modal', function(e) {
            self.onHide.call(this, e);
        });
    }

    var modalClass = {
        small: "modal-sm",
        large: "modal-lg"
    };

    self.$modal.data('bs.modal', false);
    self.$modal.find('.modal-dialog').removeClass().addClass('modal-dialog ' + (modalClass[options.size] || ''));
    self.$modal.find('.modal-content').html('<div class="modal-header"><h4 class="modal-title">${title}</h4><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body">${body}</div><div class="modal-footer"></div>'.replace('${title}', options.title).replace('${body}', options.body));

    var footer = self.$modal.find('.modal-footer');
    if (Object.prototype.toString.call(options.actions) == "[object Array]") {
        for (var i = 0, l = options.actions.length; i < l; i++) {
            options.actions[i].onClick = typeof options.actions[i].onClick == 'function' ? options.actions[i].onClick : function() {};
            $('<button type="button" class="btn ' + (options.actions[i].cssClass || '') + '">' + (options.actions[i].label || '{Label Missing!}') + '</button>').appendTo(footer).on('click', options.actions[i].onClick);
        }
    } else {
        $('<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>').appendTo(footer);
    }

    self.$modal.modal(options);
}
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

function load_tag_cloud(unique_tags_info) {
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


// function setup() {
//     add_tag();
//     delete_tag();
//     add_existing_tag();
// }


// $(function() {
//     setup();
// });
function load_search_result(bucket_url, response_object) {
    $('.search-images-col').html("");
    response_object.Body.forEach(item => {
        var shortest_col = get_shortest_col()
        var html = "<img src='" +
            bucket_url +
            item.PngPath + "'" +
            "data-id='" + item.ItemId + "'" +
            "data-vectorpath='" + item.VectorPath + "'" +
            "data-tags='" + item.Tags + "'" +
            "class='img-fluid modal-img'>"
        $('#' + shortest_col).append(html);
    });
    create_image_modal()

}

function get_shortest_col() {
    var allDivs = $('.search-images-col');
    var dvSmallest = allDivs[0];
    var shortest = $(allDivs[0]).attr('id');

    $(allDivs).each(function() {
        if ($(this).height() < $(dvSmallest).height()) {
            dvSmallest = $(this);
            shortest = $(this).attr('id');
        }
    });
    return shortest
}


function load_tag_selector(unique_tags_info) {
    unique_tags_info.forEach(tag_info => {
        const tag_html = '<option value="' + tag_info[0] + '">' + capitalize(tag_info[0]) + '</option>'
        $('.tag-selector').append(tag_html);
    });
}

function create_image_modal() {
    $('.modal-img').on('click', function() {
        showBSModal({
            title: $(this).data('id'),
            body: "<img src='" +
                $(this).attr('src') +
                "' class='img-fluid modal-img'>" +
                "</br>Tags: " + $(this).data('tags') +
                "</br><a href='" + bucket_url + $(this).data('vectorpath') + "'>Download Vector </a>",
            size: "large",
            backdrop: true,
            actions: [{
                label: 'Cancel',
                cssClass: 'btn-success',
                onClick: function(e) {
                    $(e.target).parents('.modal').modal('hide');
                }
            }]
        });
    });
}
var add_product_url = "http://127.0.0.1:5000/api/add-products";
var tags_url = "http://127.0.0.1:5000/api/tags";
var all_products_url = "http://127.0.0.1:5000/api/search";
var bucket_url = "https://jf-test-bucket.s3.eu-west-2.amazonaws.com/";

// SEARCH PRODUCTS
function search_ajax_GET() {
    $.ajax({
        type: "GET",
        cache: false,
        url: all_products_url,
        dataType: "json",
        success: function(response_object) {
            load_search_result(bucket_url, response_object);
            // create_image_modal();
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
    $.ajax({
        type: "POST",
        cache: false,
        url: all_products_url + "/" + word,
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
            },
            error: function(jqXHR) {
                alert("error: " + jqXHR.status);
                console.log(jqXHR);
            }
        })
    })
}
$(function() {
    var windowLoc = $(location).attr('pathname');

    switch (windowLoc) {
        case "/":
            add_product_ajax_GET();
            add_tag();
            delete_tag();
            add_existing_tag();
            add_product_ajax_POST();
            break;
        case "/search":
            search_ajax_GET();
            search_ajax_POST();
            search_unique_tags_GET();
            select_category_POST();
            menu_category_POST();
            break;
    }





});