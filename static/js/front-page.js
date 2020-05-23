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
    element_link(front_lettering, false, "/lettering")

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