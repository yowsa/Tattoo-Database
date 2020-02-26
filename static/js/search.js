function load_search_result(bucket_url, response_object) {
    $('#search-images').html("")
    response_object.Body.forEach(item => {
        $('#search-images').append("<img src='" + bucket_url + item.PngPath + "'>");
    });

}