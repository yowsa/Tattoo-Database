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
    var html = create_image_tag(bucket_url + item.PngPath, item.ItemId, item.VectorPath, item.Tags, item.PngPath)
    $('#search-images-col-' + (col + 1)).append(html);
    create_image_modal(html);
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

function create_image_modal(img_tag) {
    $(img_tag).on('click', function() {
        var id = $(this).attr('id')
        var favorite_icon = is_favorite(id) ? "favorite" : "favorite_border"
        showBSModal({
            title: id,
            body: "<img src='" +
                $(this).attr('src') + "'" +
                "data-id='" + $(this).data('id') + "'" +
                "data-vectorpath='" + $(this).data('vectorpath') + "'" +
                "data-tags='" + $(this).data('tags') + "'" +
                "class='img-fluid modal-img'>" +
                "</br>Tags: " + $(this).data('tags') +
                "</br><a href='" + bucket_url + $(this).data('vectorpath') + "'>Download Vector </a>" +
                "<i class='material-icons favorite'>" + favorite_icon + "</i>",
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
        set_favorite(this);
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



function set_favorite(item) {
    $('.favorite').on('click', function() {
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