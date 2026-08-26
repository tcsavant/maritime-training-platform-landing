<?php
/** Theme bootstrap: feature modules live in inc/. */
defined('ABSPATH') || exit;

foreach (array('helpers', 'course-source', 'assets', 'setup', 'scf', 'polylang', 'maintenance', 'code-injections') as $module) {
    require_once get_template_directory() . '/inc/' . $module . '.php';
}
