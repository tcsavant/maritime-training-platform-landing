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
function auvenda_link($field, $label, $url, $class = 'button button-light') {
    $link = auvenda_field($field, '');
    if (is_array($link) && !empty($link['url'])) { $url = $link['url']; $label = $link['title'] ?: $label; }
    return '<a class="' . esc_attr($class) . '" href="' . esc_url($url) . '">' . esc_html($label) . ' <b>→</b></a>';
}
