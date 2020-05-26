function update_fonts() {
    $('#formTryFont').on('input', function() {
        $('.fonts').text($(this).val());
    });

    $('#formTryFont').on('keypress', function(event) {
        if (event.which === 13) {
            $('#formTryFont').blur();
        }
    })

    $('.letter-spacing-button').on('click', function() {
        var value = $(this).val();
        $('.fonts').css('letter-spacing', value)
    });

    $('.font-size-spacing-button').on('click', function() {
        var value = $(this).val();
        $('.fonts').css('font-size', value)
    });
}