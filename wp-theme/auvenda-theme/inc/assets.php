<?php
defined('ABSPATH') || exit;

function auvenda_enqueue_assets() {
    $dir = get_template_directory();
    $uri = get_template_directory_uri();
    foreach (array('tokens', 'typography', 'layout', 'base', 'header-footer') as $file) {
        wp_enqueue_style('auvenda-' . $file, $uri . '/assets/css/' . $file . '.css', array(), filemtime($dir . '/assets/css/' . $file . '.css'));
    }
    if (is_front_page()) wp_enqueue_style('auvenda-front-page', $uri . '/assets/css/front-page.css', array('auvenda-base'), filemtime($dir . '/assets/css/front-page.css'));
    if (is_404()) wp_enqueue_style('auvenda-404', $uri . '/assets/css/service-pages.css', array('auvenda-base'), filemtime($dir . '/assets/css/service-pages.css'));
    if (is_page_template('page-maintenance.php')) wp_enqueue_style('auvenda-maintenance', $uri . '/assets/css/service-pages.css', array('auvenda-base'), filemtime($dir . '/assets/css/service-pages.css'));
    if (is_page_template('page-catalogue.php')) wp_enqueue_style('auvenda-catalogue', $uri . '/assets/css/catalogue.css', array('auvenda-base'), filemtime($dir . '/assets/css/catalogue.css'));
    wp_enqueue_script('auvenda-main', $uri . '/assets/js/main.js', array(), filemtime($dir . '/assets/js/main.js'), true);
}
add_action('wp_enqueue_scripts', 'auvenda_enqueue_assets');
