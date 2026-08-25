<?php
defined('ABSPATH') || exit;

/** Outputs code saved by a trusted site administrator in Auvenda settings. */
function auvenda_output_option_code($field) {
    $code = auvenda_field($field, '', 'option');
    if (!is_string($code) || $code === '') return;

    echo "\n" . $code . "\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
}

add_action('wp_head', function() { auvenda_output_option_code('tracking_code_head'); }, 999);
add_action('wp_body_open', function() { auvenda_output_option_code('tracking_code_body_open'); }, 1);
add_action('wp_footer', function() { auvenda_output_option_code('tracking_code_body_close'); }, 999);
