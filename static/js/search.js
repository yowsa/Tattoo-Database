function masonry_load(bucket_url, response_object) {
    $('.search-images-col').html("");
    var col = 0
    response_object.forEach(item => {
        var html = create_image_tag(bucket_url + item.PngPath, item.ItemId, item.VectorPath, item.Tags)
        $('#search-images-col-' + (col + 1)).append(html);
        col = (col + 1) % 3;
    });
}

function create_image_tag(src, id, VectorPath, tags) {
    return $('<img>', { src: src, id: id, class: 'img-fluid modal-img' }).data({ vectorpath: VectorPath, tags: tags }).get(0)
}

function load_tag_selector(unique_tags_info) {
    unique_tags_info.forEach(tag_info => {
        const tag_html = '<option value="' + tag_info[0] + '">' + capitalize(tag_info[0]) + '</option>'
        $('.tag-selector').append(tag_html);
    });
}

function create_image_modal() {
    $('.modal-img').on('click', function() {
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

function load_images(bucket_url, response_object) {
    $('#pagination-container').pagination({
        dataSource: response_object,
        locator: 'Body',
        pageSize: 9,
        className: 'paginationjs-small',
        callback: function(data, pagination) {
            masonry_load(bucket_url, data);
            create_image_modal();
        }
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

// function load_favorites() {
//     Object.keys(localStorage).forEach(function(key) {
//         var a = localStorage.getItem(key)
//         $('#favorites').append(localStorage.getItem(key))
//     });
// }


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
            localStorage.setItem($(item).attr('id'), JSON.stringify({ src: $(item).attr('src'), id: $(item).attr('id'), vectorpath: $(item).data('vectorpath'), tags: $(item).data('tags') }));
            load_favorite_count()
        }
    });

}