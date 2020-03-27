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
}