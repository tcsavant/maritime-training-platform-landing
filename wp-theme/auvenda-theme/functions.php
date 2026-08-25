<?php
defined('ABSPATH') || exit;

function auvenda_asset($path) { return get_template_directory_uri() . '/assets/' . ltrim($path, '/'); }
function auvenda_field($name, $fallback = '', $post_id = false) {
    $value = function_exists('get_field') ? get_field($name, $post_id) : null;
    return ($value === null || $value === '') ? $fallback : $value;
}
function auvenda_image_url($name, $fallback = '', $post_id = 'option') {
    $image = auvenda_field($name, '', $post_id);
    if (is_array($image) && !empty($image['url'])) return $image['url'];
    if (is_numeric($image)) return wp_get_attachment_image_url((int) $image, 'full') ?: $fallback;
    return is_string($image) && $image ? $image : $fallback;
}
function auvenda_home_url() { return function_exists('pll_home_url') ? pll_home_url() : home_url('/'); }
function auvenda_link($field, $label, $url) {
    $link = auvenda_field($field, '');
    if (is_array($link) && !empty($link['url'])) { $url = $link['url']; $label = $link['title'] ?: $label; }
    return '<a class="button" href="' . esc_url($url) . '">' . esc_html($label) . ' <b>→</b></a>';
}
function auvenda_language_switcher() {
    if (!function_exists('pll_the_languages')) return;
    $languages = pll_the_languages(array('raw' => 1));
    if (!$languages) return;
    echo '<div class="language-switcher" aria-label="' . esc_attr__('Language selector', 'auvenda-theme') . '">';
    echo '<button class="language-toggle" type="button" aria-expanded="false">';
    foreach ($languages as $language) if (!empty($language['current_lang'])) echo esc_html(strtoupper($language['slug'])) . '<span aria-hidden="true">⌄</span>';
    echo '</button><div class="language-list">';
    foreach ($languages as $language) {
        $classes = !empty($language['current_lang']) ? 'active' : '';
        printf('<a class="%1$s" href="%2$s" lang="%3$s">%4$s</a>', esc_attr($classes), esc_url($language['url']), esc_attr($language['slug']), esc_html(strtoupper($language['slug'])));
    }
    echo '</div></div>';
}
function auvenda_enqueue_assets() {
    $dir = get_template_directory(); $uri = get_template_directory_uri();
    foreach (array('tokens','typography','layout','base','header-footer') as $file) {
        wp_enqueue_style('auvenda-' . $file, $uri . '/assets/css/' . $file . '.css', array(), filemtime($dir . '/assets/css/' . $file . '.css'));
    }
    if (is_front_page()) wp_enqueue_style('auvenda-front-page', $uri . '/assets/css/front-page.css', array('auvenda-base'), filemtime($dir . '/assets/css/front-page.css'));
    if (is_404()) wp_enqueue_style('auvenda-404', $uri . '/assets/css/service-pages.css', array('auvenda-base'), filemtime($dir . '/assets/css/service-pages.css'));
    if (is_page_template('page-maintenance.php')) wp_enqueue_style('auvenda-maintenance', $uri . '/assets/css/service-pages.css', array('auvenda-base'), filemtime($dir . '/assets/css/service-pages.css'));
    if (is_page_template('page-catalogue.php')) wp_enqueue_style('auvenda-catalogue', $uri . '/assets/css/catalogue.css', array('auvenda-base'), filemtime($dir . '/assets/css/catalogue.css'));
    wp_enqueue_script('auvenda-main', $uri . '/assets/js/main.js', array(), filemtime($dir . '/assets/js/main.js'), true);
}
add_action('wp_enqueue_scripts', 'auvenda_enqueue_assets');
add_theme_support('title-tag'); add_theme_support('post-thumbnails');
register_nav_menus(array('primary' => __('Primary navigation', 'auvenda-theme'), 'footer' => __('Footer navigation', 'auvenda-theme')));

function auvenda_register_content() {
    register_post_type('course', array('labels' => array('name' => 'Courses', 'singular_name' => 'Course'), 'public' => true, 'show_in_rest' => true, 'has_archive' => 'courses', 'rewrite' => array('slug' => 'courses'), 'supports' => array('title','editor','excerpt','thumbnail')));
    register_taxonomy('course_direction', 'course', array('labels' => array('name' => 'Course directions', 'singular_name' => 'Course direction'), 'public' => true, 'show_in_rest' => true, 'hierarchical' => true, 'rewrite' => array('slug' => 'course-direction')));
}
add_action('init', 'auvenda_register_content');

add_filter('acf/settings/save_json', function($path) { return get_template_directory() . '/acf-json'; });
add_filter('acf/settings/load_json', function($paths) { $paths[] = get_template_directory() . '/acf-json'; return $paths; });
add_action('acf/init', function() {
    if (!function_exists('acf_add_options_page')) return;
    $parent = acf_add_options_page(array('page_title' => 'Auvenda settings', 'menu_title' => 'Auvenda settings', 'menu_slug' => 'auvenda-settings', 'redirect' => false));
});
