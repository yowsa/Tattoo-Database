$(function() {
    var windowLoc = $(location).attr('pathname');

    load_paths();

    switch (windowLoc) {
        case "/add":
            add_product_ajax_GET();
            add_tag();
            delete_tag();
            add_existing_tag();
            add_product_ajax_POST();
            break;
        case "/":
            load_front_page_GET();
            clear_favorites();
            search_ajax_POST();
            search_unique_tags_GET();
            select_category_POST();
            tag_search_POST();
            load_favorite_count();
            load_favorites();
            break;
        case "/edit":
            load_front_page_GET();
            clear_favorites();
            search_ajax_POST();
            search_unique_tags_GET();
            select_category_POST();
            tag_search_POST();
            load_favorite_count();
            load_favorites();
            break;
        case "/fontfinder":
            update_fonts();
            break;
        case "/login":
            login()
            break;

    }





});