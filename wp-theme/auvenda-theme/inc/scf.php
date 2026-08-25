<?php
defined('ABSPATH') || exit;

add_filter('acf/settings/save_json', function($path) { return get_template_directory() . '/acf-json'; });
add_filter('acf/settings/load_json', function($paths) { $paths[] = get_template_directory() . '/acf-json'; return $paths; });
add_action('acf/init', function() {
    if (!function_exists('acf_add_options_page')) return;
    acf_add_options_page(array('page_title' => 'Auvenda settings', 'menu_title' => 'Auvenda settings', 'menu_slug' => 'auvenda-settings', 'redirect' => false));
});
