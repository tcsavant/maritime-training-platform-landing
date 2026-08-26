<?php
defined('ABSPATH') || exit;

function auvenda_enqueue_assets() {
    $dir = get_template_directory();
    $uri = get_template_directory_uri();
    $is_catalogue = is_page_template('page-catalogue.php') || is_post_type_archive('course') || is_tax('course_direction');
    $is_service = is_404() || is_page_template('page-maintenance.php') || (function_exists('auvenda_should_show_maintenance') && auvenda_should_show_maintenance());

    if ($is_catalogue) {
        wp_enqueue_style('auvenda-catalogue-design', $uri . '/styles.css', array(), filemtime($dir . '/styles.css'));
    } else {
        wp_enqueue_style('auvenda-landing-design', $uri . '/brand-styles.css', array(), filemtime($dir . '/brand-styles.css'));
        if ($is_service) wp_enqueue_style('auvenda-service-page', $uri . '/assets/css/service-pages.css', array('auvenda-landing-design'), filemtime($dir . '/assets/css/service-pages.css'));
    }
    wp_enqueue_style('auvenda-header', $uri . '/header.css', array(), filemtime($dir . '/header.css'));
    wp_enqueue_script('auvenda-main', $uri . '/assets/js/main.js', array(), filemtime($dir . '/assets/js/main.js'), true);
}
add_action('wp_enqueue_scripts', 'auvenda_enqueue_assets');
