<?php
defined('ABSPATH') || exit;

function auvenda_enqueue_assets() {
    $dir = get_template_directory();
    $uri = get_template_directory_uri();
    $is_catalogue = is_page_template('page-catalogue.php') || is_post_type_archive('course') || is_tax('course_direction');
    $is_service = is_404() || is_page_template('page-maintenance.php') || (function_exists('auvenda_should_show_maintenance') && auvenda_should_show_maintenance());

    if ($is_service) {
        $page_handle = 'auvenda-service-page';
        wp_enqueue_style($page_handle, $uri . '/assets/css/service-pages.css', array(), filemtime($dir . '/assets/css/service-pages.css'));
    } elseif ($is_catalogue) {
        $page_handle = 'auvenda-catalogue-page';
        wp_enqueue_style($page_handle, $uri . '/assets/css/pages/catalogue.css', array(), filemtime($dir . '/assets/css/pages/catalogue.css'));
    } else {
        $page_handle = 'auvenda-landing-page';
        wp_enqueue_style($page_handle, $uri . '/assets/css/pages/landing.css', array(), filemtime($dir . '/assets/css/pages/landing.css'));
    }
    wp_enqueue_style('auvenda-common', $uri . '/assets/css/common.css', array($page_handle), filemtime($dir . '/assets/css/common.css'));
    wp_enqueue_script('auvenda-main', $uri . '/assets/js/main.js', array(), filemtime($dir . '/assets/js/main.js'), true);
}
add_action('wp_enqueue_scripts', 'auvenda_enqueue_assets');
