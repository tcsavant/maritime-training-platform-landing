<?php
/* Template Name: Maintenance */
defined('ABSPATH') || exit;
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <link rel="icon" href="<?php echo esc_url(auvenda_asset('images/favicon.svg')); ?>" type="image/svg+xml">
  <?php wp_head(); ?>
</head>
<body <?php body_class('maintenance-page'); ?>>
<?php wp_body_open(); ?>
<main class="service-page">
  <div class="container">
    <p class="eyebrow"><?php echo esc_html(auvenda_field('maintenance_eyebrow', 'MARITIME TRAINING PLATFORM', 'option')); ?></p>
    <h1><?php echo wp_kses_post(auvenda_field('maintenance_title', 'We are preparing<br><em>to launch.</em>', 'option')); ?></h1>
    <p class="lead"><?php echo wp_kses_post(auvenda_field('maintenance_text', 'Auvenda will open for maritime professionals, training providers and shipping companies on<br>1 September.', 'option')); ?></p>
  </div>
</main>
<?php wp_footer(); ?>
</body>
</html>
