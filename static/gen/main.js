function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function update_tags(element, tags) {
    $(element).on('click', function() {
        // console.log(element)
        // console.log("hellooooo");
        console.log(tags)

    })
}



window.showBSModal = function self(options) {

    var options = $.extend({
        title: '',
        body: '',
        img: '',
        tags: '',
        icon_text: '',
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
    self.$modal.find('.modal-content').html('<div class="modal-body"><button type="button" class="close modal-close" data-dismiss="modal" aria-label="Close"><span class="material-icons">close</span></button>${img} ${body}<div class="row pt-3"><div class="col d-flex modal-tags">${tags}</div><div class="col d-flex h-100 justify-content-end"><i class="material-icons favorite modal-favorite">${icon_text}</i></div></div><span class="small-id">${title}</span></div>'.replace('${title}', options.title).replace('${body}', options.body).replace('${img}', options.img).replace('${tags}', options.tags).replace('${icon_text}', options.icon_text));

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

function alert_message(message, alert_type = "alert-danger") {
    $('#alerts').html('<div class="alert ' + alert_type + '" role="role">' +
        message + '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
        '<span aria-hidden="true"> &times;</span>' +
        '</button></div>');
}


function load_latest_added_product(png_path, item_id, tags) {
    var row = $('<div>').addClass('row').prependTo($("#added-products"));
    var img = $('<img>', { src: bucket_url + png_path, class: "img-thumbnail" });
    var tag_list = $('<span>').text(tags).attr('contenteditable', 'true')
    $('<div>').addClass('col-2').html(img).appendTo(row);
    var tag_div = $('<div>').addClass('col-10').html(tag_list).appendTo(row);
    $('<p>').appendTo(tag_div);
    var update_button = $('<button>').addClass("update-tags").text("Update tags").appendTo(tag_div);
    var delete_button = $('<button>').addClass("delete_item").text("Delete item").appendTo(tag_div);
    update_tags_ajax(update_button, item_id, tag_list)
    delete_product_ajax(delete_button, item_id);
    $(delete_button).on('click', function() {
        $(row).remove()
    })
}
function update_fonts() {
    $('#formTryFont').on('input', function() {
        $('.fonts').text($(this).val());
    });

    $('.letter-spacing-button').on('click', function() {
        var value = $(this).val();
        $('.fonts').css('letter-spacing', value)
    });

    $('.font-size-spacing-button').on('click', function() {
        var value = $(this).val();
        $('.fonts').css('font-size', value)
    });
}
function front_page(items) {
    $(window).unbind('scroll');
    $('.search-images-col').html("");

    var front_img_1 = $('<div />', { id: 'front-img-1', class: 'loaded-image d-flex justify-content-center align-items-center text-center' }).html($('<img />', {
        class: 'img-fluid',
        src: bucket_url + 'front-page/front1.png',
    })).appendTo('#search-images-col-1')
    $('<span />').addClass('position-absolute').html('<h4>TWO MAKES A GROUP</h4><span>Delicate tattoos for frends and lovers to share</span>').appendTo('#front-img-1')
    element_link(front_img_1, "test", false)

    load_image(bucket_url, items[0], 1)

    var front_lettering = $('<div />', { id: 'front-lettering', class: 'd-flex flex-column justify-content-around align-items-center text-center' }).html('<p class="front-lettering-1">Aa</p><p class="front-lettering-2">Aa</p><p class="front-lettering-3">Aa</p><p class="front-lettering-4">Aa</p><p class="front-lettering-5">BLAEK <br/> <span>FONTFINDER</span></p~').appendTo('#search-images-col-3')
    element_link(front_lettering, false, "lettering")

    load_image(bucket_url, items[1], 0)

    var front_img_2 = $('<div />', { id: 'front-img-2', class: 'loaded-image d-flex justify-content-center align-items-center text-center' }).html($('<img />', {
        class: 'img-fluid',
        src: bucket_url + 'front-page/front2.jpg',
    })).appendTo('#search-images-col-2')
    $('<span />').addClass('position-absolute').text('FINGER TATTOOS').appendTo('#front-img-2')
    element_link(front_img_2, "test", false)

    load_image(bucket_url, items[2], 2)

    var front_img_3 = $('<div />', { id: 'front-img-3', class: 'loaded-image d-flex justify-content-center align-items-center text-center' }).html($('<img />', {
        class: 'img-fluid',
        src: bucket_url + 'front-page/front3.jpg',
    })).appendTo('#search-images-col-2')
    $('<span />').addClass('position-absolute').text('CONTINOUS LINE').appendTo('#front-img-3')
    element_link(front_img_3, "test", false)

    load_image(bucket_url, items[3], 0)
    load_image(bucket_url, items[4], 0)
    load_image(bucket_url, items[5], 1)
    load_image(bucket_url, items[6], 2)

    // $('.font-page-search').on('click', function() {
    //     event.preventDefault();
    //     word = $(this).attr('value');
    //     search_word(word);
    // });
}

function element_link(element, word, link) {
    $(element).on('click', function() {
        event.preventDefault();
        console.log('hello')
        if (word) {
            search_word(word);
        }
        if (link) {
            window.location.href = link;
        }
    })
}

function clear_selection() {
    $('#clear-selection').on('click', function() {
        load_front_page_GET()
    })
}
function load_images(bucket_url, items) {

    $(window).unbind('scroll');
    $('.search-images-col').html("");
    var initial_load = 9;
    var load_on_scroll = 3;
    var positions = masonry_load(bucket_url, items, 0, initial_load, 0);

    $(window).scroll(function() {
        if ($(window).scrollTop() >= $(document).height() - $(window).height() - 10) {
            var idx = positions[0];
            var col = positions[1];
            if (idx <= items.length) {
                positions = masonry_load(bucket_url, items, idx, load_on_scroll, col);
            }
        }
    });
}

function masonry_load(bucket_url, items, image_index, images_to_load = 1, col = 0) {
    var load_to = image_index + images_to_load > items.length ? items.length : image_index + images_to_load
    for (var i = image_index; i < load_to; i++) {
        col = load_image(bucket_url, items[i], col)
    }
    return [i, col]
}

function load_image(bucket_url, item, col) {
    var img_tag = create_image_tag(bucket_url + item.PngPath, item.ItemId, item.VectorPath, item.Tags, item.PngPath)
    var is_fav_icon = is_favorite(item.ItemId) ? "favorite" : "favorite_border"
    var fav_icon = $('<i />').addClass('material-icons favorite search-favorite').text(is_fav_icon);
    if (item.ImageBrightness < 0.5) {
        fav_icon.css('color', "white");
    }
    var html = $("<div />").addClass('loaded-image').html(fav_icon)
    $(img_tag).appendTo(html)
    $('#search-images-col-' + (col + 1)).append(html);
    create_image_modal(img_tag);
    set_favorite(fav_icon, img_tag)
    return (col + 1) % 3;
}

function create_image_tag(src, id, VectorPath, tags, PngPath) {
    return $('<img>', { src: src, id: id, class: 'img-fluid modal-img' }).data({ vectorpath: VectorPath, pngpath: PngPath, tags: tags }).get(0)
}

function load_tag_selector(unique_tags_info) {
    unique_tags_info.forEach(tag_info => {
        const tag_html = '<option value="' + tag_info[0] + '">' + capitalize(tag_info[0]) + '</option>'
        $('.tag-selector').append(tag_html);
    });
}

function get_tag_links(tags) {
    var tag_div = $('<div />');
    tags.forEach(function(tag) {
        $('<a />').attr('href', '#').addClass('modal-tag').text(tag).appendTo(tag_div);
    });
    return tag_div;
}

function create_image_modal(img_tag) {
    $(img_tag).on('click', function() {
        var id = $(this).attr('id');
        var is_fav_icon = is_favorite(id) ? "favorite" : "favorite_border";
        var tags = get_tag_links($(this).data('tags'))

        showBSModal({
            title: id,
            img: $(img_tag).get(0).outerHTML,
            tags: $(tags).get(0).outerHTML,
            icon_text: is_fav_icon,
            size: "large",
            backdrop: true,
        });
        switch (windowLoc) {
            case "/search/edit":
                $('<p />').html($("<a>", { href: bucket_url + $(this).data('vectorpath') }).text("Download Vector")).appendTo($(".modal-body"))

                var delete_btn_obj = $('<p />').html($("<a>", { href: '#', class: "delete-item" }).data({ dismiss: "modal" }).text("Delete")).appendTo($(".modal-body"))
                delete_product_ajax(delete_btn_obj, id);
                break;
        }
        $('.modal-tag').on('click', function() {
            event.preventDefault();
            word = $(this).text();
            search_word(word);
            $('.modal').modal('hide')

        });


        set_favorite($('.modal-favorite'), this);
        $('.modal').on('hidden.bs.modal', function(e) {
            update_favorite($(img_tag).prev(), img_tag)
        })
    });
}

function clear_favorites() {
    localStorage.clear()
}

function is_favorite(id) {
    return id in localStorage
}

function load_favorite_count() {
    $('#favorite-count').text(localStorage.length)
}

function load_favorites() {
    $('#show-favorites').on('click', function() {
        var items = []
        Object.keys(localStorage).forEach(function(key) {
            var item = localStorage.getItem(key)
            items.push(JSON.parse(item))
        });
        load_images(bucket_url, items)
    });
}


function update_favorite(fav_obj, item) {
    var id = $(item).attr('id')
    if (is_favorite(id)) {
        $(fav_obj).text("favorite")
        load_favorite_count()
    } else {
        $(fav_obj).text("favorite_border")
        load_favorite_count()
    }

}

function set_favorite(fav_icon, item) {
    $(fav_icon).on('click', function() {
        event.preventDefault();
        var id = $(item).attr('id')
        if (is_favorite(id)) {
            localStorage.removeItem(id)
            $(this).text("favorite_border")
            load_favorite_count()
        } else {
            $(this).text("favorite")
            localStorage.setItem($(item).attr('id'), JSON.stringify({ ItemId: $(item).attr('id'), VectorPath: $(item).data('vectorpath'), PngPath: $(item).data('pngpath'), Tags: $(item).data('tags') }));
            load_favorite_count()
        }
    });

}
var windowLoc = $(location).attr('pathname');
var local = true

var url_host = $(location).attr('host');

if (local) {
    var add_product_url = "http://127.0.0.1:5000/api/add-products";
    var product_url = "http://127.0.0.1:5000/api/product";
    var tags_url = "http://127.0.0.1:5000/api/tags";
    var all_products_url = "http://127.0.0.1:5000/api/search";
    var front_images = "http: //127.0.0.1:5000/images/front-page/"
} else {
    var add_product_url = "http://tattoos-env.eu-west-2.elasticbeanstalk.com/api/add-products";
    var product_url = "http://tattoos-env.eu-west-2.elasticbeanstalk.com/api/product";
    var tags_url = "http://tattoos-env.eu-west-2.elasticbeanstalk.com/api/tags";
    var all_products_url = "http://tattoos-env.eu-west-2.elasticbeanstalk.com/api/search";
    var front_images = ""
}


var bucket_url = "https://jf-test-bucket.s3.eu-west-2.amazonaws.com/";

// SEARCH PRODUCTS
function load_front_page_GET() {
    $.ajax({
        type: "GET",
        cache: false,
        url: all_products_url + "/random",
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

function tag_search_POST() {
    $('.search-tags').on('click', function() {
        event.preventDefault();
        word = $(this).attr('value');
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
                clear_add_product_form()
                if (response_object.ErrorCode != "OK") {
                    console.log(response_object)
                    alert_message(response_object.Message)
                } else {
                    load_latest_added_product(response_object.PngPath, response_object.Body, response_object.Tags)
                    console.log(response_object)
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
            url: product_url + "/" + item_id,
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
            url: product_url + "/" + item_id,
            dataType: "json",
            success: function(response_object) {
                alert(response_object.Message)
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
            load_front_page_GET();
            clear_selection();
            search_ajax_POST();
            search_unique_tags_GET();
            select_category_POST();
            tag_search_POST();
            load_favorite_count();
            load_favorites();
            break;
        case "/search/edit":
            load_front_page_GET();
            clear_selection();
            search_ajax_POST();
            search_unique_tags_GET();
            select_category_POST();
            tag_search_POST();
            load_favorite_count();
            load_favorites();
            break;
        case "/lettering":
            update_fonts();
            break;
        case "/login":
            login()
            break;

    }





});