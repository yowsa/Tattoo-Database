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