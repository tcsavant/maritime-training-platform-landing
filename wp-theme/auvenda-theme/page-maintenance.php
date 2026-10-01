<?php
/* Template Name: Maintenance */
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
  <meta name="robots" content="noindex, nofollow">
  <link rel="icon" href="<?php echo esc_url(auvenda_asset('auvenida/favicon.svg')); ?>" type="image/svg+xml">
  <?php wp_head(); ?>
</head>
<body <?php body_class('maintenance-page'); ?>>
<?php wp_body_open(); ?>
<header class="maintenance-header">
  <div class="container">
    <a class="brand" href="<?php echo esc_url(auvenda_home_url()); ?>" aria-label="<?php esc_attr_e('Auvenda home', 'auvenda-theme'); ?>">
      <img class="brand-logo" src="<?php echo esc_url($header_logo); ?>" alt="Auvenda">
      <span class="brand-divider" aria-hidden="true"></span>
      <span class="brand-descriptor"><?php echo wp_kses($header_descriptor, array('br' => array())); ?></span>
    </a>
  </div>
</header>
<main class="maintenance-main">
  <div class="container">
    <p class="maintenance-kicker"><?php echo esc_html(auvenda_field('maintenance_eyebrow', 'MARITIME TRAINING PLATFORM', 'option')); ?></p>
    <h1 class="maintenance-title"><?php echo wp_kses_post(auvenda_field('maintenance_title', 'We are preparing<br><em>to launch.</em>', 'option')); ?></h1>
    <p class="maintenance-lead"><?php echo wp_kses_post(auvenda_field('maintenance_text', 'Auvenda will open for maritime professionals, training providers and shipping companies on<br>1 September.', 'option')); ?></p>
  </div>
</main>
<?php wp_footer(); ?>
</body>
</html>
