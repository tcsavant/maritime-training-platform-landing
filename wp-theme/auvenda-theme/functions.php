<?php
/** Theme bootstrap: feature modules live in inc/. */
defined('ABSPATH') || exit;

foreach (array('helpers', 'assets', 'setup', 'scf', 'polylang') as $module) {
    require_once get_template_directory() . '/inc/' . $module . '.php';
}
