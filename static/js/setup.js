$(function() {
    var windowLoc = $(location).attr('pathname');

    switch (windowLoc) {
        case "/":
            add_product_ajax_GET();
            add_tag();
            delete_tag();
            add_existing_tag();
            add_product_ajax_POST();
            break;
        case "/search":
            search_ajax_GET();
            search_ajax_POST();
            search_unique_tags_GET();
            select_category_POST();
            menu_category_POST();
            load_favorite_count()
            break;
    }





});