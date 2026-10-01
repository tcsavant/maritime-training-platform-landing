<?php
defined('ABSPATH') || exit;
$header_descriptor = auvenda_field('header_descriptor', 'Maritime Training Platform', 'option');
if ($header_descriptor === 'Maritime Training Platform') $header_descriptor = 'Maritime<br>Training Platform';
$header_logo = auvenda_image_url('header_logo', auvenda_asset('auvenida/logo.svg'));
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex">
  <link rel="icon" href="<?php echo esc_url(auvenda_asset('auvenida/favicon.svg')); ?>" type="image/svg+xml">
  <?php wp_head(); ?>
</head>
<body <?php body_class('not-found-page'); ?>>
<?php wp_body_open(); ?>
<header class="not-found-header">
  <div class="container">
    <a class="brand" href="<?php echo esc_url(auvenda_home_url()); ?>" aria-label="<?php esc_attr_e('Auvenda home', 'auvenda-theme'); ?>">
      <img class="brand-logo" src="<?php echo esc_url($header_logo); ?>" alt="Auvenda">
      <span class="brand-divider" aria-hidden="true"></span>
      <span class="brand-descriptor"><?php echo wp_kses($header_descriptor, array('br' => array())); ?></span>
    </a>
  </div>
</header>
<main class="not-found-main">
  <div class="container">
    <p class="not-found-kicker"><?php echo esc_html(auvenda_field('not_found_eyebrow', 'PAGE NOT FOUND', 'option')); ?></p>
    <h1 class="not-found-title">404<span><?php echo esc_html(auvenda_field('not_found_title', 'Lost at sea?', 'option')); ?></span></h1>
    <p class="not-found-lead"><?php echo esc_html(auvenda_field('not_found_text', 'The page you are looking for is not available. Return to Auvenda to continue exploring maritime training.', 'option')); ?></p>
    <a class="button button-gold" href="<?php echo esc_url(home_url('/')); ?>"><?php echo esc_html(auvenda_field('not_found_button_label', 'Back to home', 'option')); ?> <span>→</span></a>
  </div>
</main>
<?php wp_footer(); ?>
</body>
</html>
