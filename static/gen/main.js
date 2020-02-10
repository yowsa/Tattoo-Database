function add_tag() {
    $('#formAddTagInput').keypress(function(event) {
        if (event.which == 13) {
            event.preventDefault();
            tag = "<span class='tag'>" + $('#formAddTagInput').val() + "</span>"
            $('#product-tags').append(tag);
            $('#product-tags').append(" ");
            $('#formAddTagInput').val("")
        }
    });
}

function delete_tag() {
    $('#product-tags').on('click', '.tag', function(event) {
        if ($('#product-tags').find(this).hasClass('existing-tag')) {
            $('#tag-cloud').append(this);
            $('#tag-cloud').append(" ");
        }
        $('#product-tags').find(this).remove();
    });
}

function add_existing_tag() {
    $('#tag-cloud').on('click', '.tag', function(event) {
        $('#product-tags').append(this);
        $('#product-tags').append(" ");
    });

}

function load_existing_tags(unique_tags_info) {
    unique_tags_info.forEach(tag_info => {
        tag_html = "<span class='tag existing-tag'>" + tag_info[0] + "</span>"
        $('#tag-cloud').append(tag_html);
        $('#tag-cloud').append(" ");
    });
}


function setup() {
    add_tag()
    delete_tag()
    add_existing_tag()
}


$(function() {
    setup()
});
$(function() {
    var qurl = "http://127.0.0.1:5000/api/add-products";
    $.ajax({
        type: "GET",
        cache: false,
        // data: { keyword: search_word },
        url: qurl,
        dataType: "json",
        success: function(response_object) {
            load_existing_tags(response_object.Body)
        },
        error: function(jqXHR) {
            alert("error: " + jqXHR.status);
            console.log(jqXHR);
        }
    })
});