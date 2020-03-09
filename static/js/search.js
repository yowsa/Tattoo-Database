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