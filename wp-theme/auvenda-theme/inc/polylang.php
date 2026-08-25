<?php
defined('ABSPATH') || exit;

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
