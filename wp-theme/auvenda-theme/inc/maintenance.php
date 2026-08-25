<?php
defined('ABSPATH') || exit;

function auvenda_maintenance_enabled() {
    return (bool) auvenda_field('maintenance_enabled', false, 'option');
}

function auvenda_should_show_maintenance() {
    if (!auvenda_maintenance_enabled() || is_admin()) return false;
    if ((function_exists('wp_doing_ajax') && wp_doing_ajax()) || (defined('DOING_CRON') && DOING_CRON)) return false;
    if ((defined('REST_REQUEST') && REST_REQUEST) || (defined('WP_CLI') && WP_CLI)) return false;
    return !(is_user_logged_in() && current_user_can('manage_options'));
}

function auvenda_maintenance_template($template) {
    if (!auvenda_should_show_maintenance()) return $template;

    status_header(503);
    nocache_headers();
    header('Retry-After: 3600');

    return get_template_directory() . '/page-maintenance.php';
}
add_filter('template_include', 'auvenda_maintenance_template', 99);
