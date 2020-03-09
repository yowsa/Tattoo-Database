function masonry_load(bucket_url, response_object) {
    $('.search-images-col').html("");
    var col = 0
    response_object.forEach(item => {
        var html = "<img src='" +
            bucket_url +
            item.PngPath + "'" +
            "data-id='" + item.ItemId + "'" +
            "data-vectorpath='" + item.VectorPath + "'" +
            "data-tags='" + item.Tags + "'" +
            "class='img-fluid modal-img'>"
        $('#search-images-col-' + (col + 1)).append(html);
        col = (col + 1) % 3;
    });
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