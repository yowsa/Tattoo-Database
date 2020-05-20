$(function() {
    var windowLoc = $(location).attr('pathname');

    load_paths();

    switch (windowLoc) {
        case "/":
            add_product_ajax_GET();
            add_tag();
            delete_tag();
            add_existing_tag();
            add_product_ajax_POST();
            break;
        case "/search":
            load_front_page_GET();
            clear_selection();
            search_ajax_POST();
            search_unique_tags_GET();
            select_category_POST();
            tag_search_POST();
            load_favorite_count();
            load_favorites();
            break;
        case "/search/edit":
            load_front_page_GET();
            clear_selection();
            search_ajax_POST();
            search_unique_tags_GET();
            select_category_POST();
            tag_search_POST();
            load_favorite_count();
            load_favorites();
            break;
        case "/lettering":
            update_fonts();
            break;
        case "/login":
            login()
            break;

    }





});