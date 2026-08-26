<?php
defined('ABSPATH') || exit;

function auvenda_course_directions() {
    static $directions = null;
    if ($directions !== null) return $directions;
    $file = get_template_directory() . '/assets/auvenida/data/course-directions.json';
    $decoded = is_readable($file) ? json_decode(file_get_contents($file), true) : array();
    $directions = is_array($decoded) ? $decoded : array();
    return $directions;
}

function auvenda_source_language() {
    $language = function_exists('pll_current_language') ? pll_current_language('slug') : 'en';
    return in_array($language, array('en', 'ru', 'uk'), true) ? $language : 'en';
}

function auvenda_direction_label($direction, $language = null) {
    $language = $language ?: auvenda_source_language();
    return !empty($direction['labels'][$language]) ? $direction['labels'][$language] : $direction['label'];
}

function auvenda_course_direction_slugs($course_slug) {
    $matches = array();
    foreach (auvenda_course_directions() as $direction) {
        if (in_array($course_slug, $direction['sourceSlugs'], true)) $matches[] = $direction['slug'];
    }
    return $matches;
}

function auvenda_source_courses($language = null) {
    $language = $language ?: auvenda_source_language();
    $cache_key = 'auvenda_source_courses_' . $language;
    $cached = get_transient($cache_key);
    if (is_array($cached)) return $cached;

    $url = add_query_arg(array(
        'per_page' => 100,
        'lang' => $language,
        '_fields' => 'id,slug,link,title',
    ), 'https://tcsavant.com/wp-json/wp/v2/courses');
    $response = wp_remote_get($url, array('timeout' => 12));
    if (is_wp_error($response) || wp_remote_retrieve_response_code($response) !== 200) {
        $stale = get_option($cache_key . '_stale', array());
        return is_array($stale) ? $stale : array();
    }

    $source = json_decode(wp_remote_retrieve_body($response), true);
    if (!is_array($source)) return array();
    $courses = array();
    foreach ($source as $course) {
        if (empty($course['slug']) || empty($course['title']['rendered'])) continue;
        $courses[] = array(
            'id' => isset($course['id']) ? (int) $course['id'] : 0,
            'slug' => sanitize_title($course['slug']),
            'title' => html_entity_decode(wp_strip_all_tags($course['title']['rendered']), ENT_QUOTES, 'UTF-8'),
            'link' => !empty($course['link']) ? esc_url_raw($course['link']) : 'https://tcsavant.com/en/page-courses/',
            'directions' => auvenda_course_direction_slugs(sanitize_title($course['slug'])),
        );
    }
    set_transient($cache_key, $courses, HOUR_IN_SECONDS);
    update_option($cache_key . '_stale', $courses, false);
    return $courses;
}

function auvenda_courses_for_direction($courses, $direction_slug) {
    if ($direction_slug === 'all') return $courses;
    return array_values(array_filter($courses, static function ($course) use ($direction_slug) {
        return in_array($direction_slug, $course['directions'], true);
    }));
}
