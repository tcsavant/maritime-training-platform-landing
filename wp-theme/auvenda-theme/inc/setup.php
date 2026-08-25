<?php
defined('ABSPATH') || exit;

add_theme_support('title-tag');
add_theme_support('post-thumbnails');
register_nav_menus(array('primary' => __('Primary navigation', 'auvenda-theme'), 'footer' => __('Footer navigation', 'auvenda-theme')));

function auvenda_register_content() {
    register_post_type('course', array('labels' => array('name' => 'Courses', 'singular_name' => 'Course'), 'public' => true, 'show_in_rest' => true, 'has_archive' => 'courses', 'rewrite' => array('slug' => 'courses'), 'supports' => array('title', 'editor', 'excerpt', 'thumbnail')));
    register_taxonomy('course_direction', 'course', array('labels' => array('name' => 'Course directions', 'singular_name' => 'Course direction'), 'public' => true, 'show_in_rest' => true, 'hierarchical' => true, 'rewrite' => array('slug' => 'course-direction')));
}
add_action('init', 'auvenda_register_content');
