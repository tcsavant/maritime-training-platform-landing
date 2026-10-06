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
    return '<a class="' . esc_attr($class) . '" href="' . esc_url($url) . '">' . esc_html($label) . ' <span>→</span></a>';
}
function auvenda_contact_language() {
    $language = function_exists('pll_current_language') ? pll_current_language('slug') : '';
    if (!$language && function_exists('get_locale')) $language = substr((string) get_locale(), 0, 2);
    if ($language === 'ua') $language = 'uk';
    return in_array($language, array('en', 'ru', 'uk'), true) ? $language : 'en';
}
function auvenda_contact_label($label) {
    $labels = array(
        'Phone' => array('en' => 'Phone', 'ru' => 'Телефон', 'uk' => 'Телефон'),
        'Email' => array('en' => 'Email', 'ru' => 'Email', 'uk' => 'Email'),
        'Telegram' => array('en' => 'Telegram', 'ru' => 'Telegram', 'uk' => 'Telegram'),
        'WhatsApp' => array('en' => 'WhatsApp', 'ru' => 'WhatsApp', 'uk' => 'WhatsApp'),
        'Messaging' => array('en' => 'Messaging', 'ru' => 'Мессенджеры', 'uk' => 'Месенджери'),
    );
    $language = auvenda_contact_language();
    return isset($labels[$label][$language]) ? $labels[$label][$language] : $label;
}
function auvenda_contact_value($name, $fallback) {
    $value = auvenda_field($name, $fallback, 'option');
    return is_string($value) && trim($value) !== '' ? $value : $fallback;
}
function auvenda_contact_phone() { return auvenda_contact_value('footer_phone', '+44 7346 465364'); }
function auvenda_contact_email() { return auvenda_contact_value('footer_email', 'hello@auvenda.com'); }
function auvenda_contact_telegram() { return auvenda_contact_value('telegram_url', 'https://t.me/+447346465364'); }
function auvenda_contact_whatsapp() { return auvenda_contact_value('whatsapp_url', 'https://wa.me/447346465364'); }
function auvenda_contact_channels_html($tone = 'light') {
    $phone = auvenda_contact_phone();
    $email = auvenda_contact_email();
    $telegram = auvenda_contact_telegram();
    $whatsapp = auvenda_contact_whatsapp();
    $classes = 'contact-channels' . ($tone === 'dark' ? ' contact-channels-dark' : '');
    $phone_href = 'tel:' . preg_replace('/[^0-9+]/', '', $phone);
    echo '<div class="' . esc_attr($classes) . '">';
    echo '<a href="' . esc_url($phone_href) . '"><span>' . esc_html(auvenda_contact_label('Phone')) . '</span>' . esc_html($phone) . '</a>';
    echo '<a href="mailto:' . esc_attr(antispambot($email)) . '"><span>' . esc_html(auvenda_contact_label('Email')) . '</span>' . esc_html(antispambot($email)) . '</a>';
    echo '<nav class="contact-channel-icons" aria-label="' . esc_attr(auvenda_contact_label('Messaging')) . '">';
    echo '<a href="' . esc_url($telegram) . '" target="_blank" rel="noopener noreferrer" aria-label="' . esc_attr(auvenda_contact_label('Telegram')) . '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 3 11 13"/><path d="m22 3-7 18-4-8-8-4 19-6z"/></svg></a>';
    echo '<a href="' . esc_url($whatsapp) . '" target="_blank" rel="noopener noreferrer" aria-label="' . esc_attr(auvenda_contact_label('WhatsApp')) . '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 11.2a8.2 8.2 0 0 1-12.2 7.1L4 19.8l1.5-4.1A8.2 8.2 0 1 1 20.5 11.2z"/><path d="M9.1 9.6c.2 1.2 1.9 2.9 3.1 3.1l.8-.8c.2-.2.4-.2.6 0l.9.3c.2.1.4.3.3.5v.6c0 .3-.2.5-.5.5A5.2 5.2 0 0 1 8.6 9.3c0-.3.2-.5.5-.5h.6c.2 0 .4.1.5.3l.3.9c0 .2 0 .4-.1.6z"/></svg></a>';
    echo '</nav></div>';
}
