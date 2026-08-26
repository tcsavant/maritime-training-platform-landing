<?php
defined('ABSPATH') || exit;
$socials = array(
    array('label' => 'LinkedIn', 'url' => auvenda_field('linkedin_url', '', 'option'), 'icon' => '<path d="M6.5 8.25V18M6.5 5.75v.01M10.5 18v-5.5a3.5 3.5 0 0 1 7 0V18M10.5 9.5V18"/>'),
    array('label' => 'Instagram', 'url' => auvenda_field('instagram_url', '', 'option'), 'icon' => '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>'),
    array('label' => 'Facebook', 'url' => auvenda_field('facebook_url', '', 'option'), 'icon' => '<path d="M14.5 20v-7h2.75l.5-3h-3.25V8.25c0-.87.43-1.75 1.8-1.75H18V4.1c-.9-.13-1.8-.2-2.7-.2-2.75 0-4.8 1.67-4.8 4.7V10H8v3h2.5v7"/>'),
);
$socials = array_filter($socials, static function ($social) { return !empty($social['url']); });
$footer_email = auvenda_field('footer_email', '', 'option');
$footer_phone = auvenda_field('footer_phone', '', 'option');
?>
<footer class="site-footer" id="contact">
  <div class="container footer-inner">
    <a class="footer-brand" href="<?php echo esc_url(auvenda_home_url()); ?>"><img src="<?php echo esc_url(auvenda_image_url('footer_logo', auvenda_asset('images/logo.svg'))); ?>" alt="Auvenda"></a>
    <div class="footer-content">
      <p><?php echo esc_html(auvenda_field('footer_text', 'Auvenda — Maritime Training Platform', 'option')); ?></p>
      <?php wp_nav_menu(array('theme_location'=>'footer','container'=>false,'fallback_cb'=>'wp_page_menu','menu_class'=>'footer-menu')); ?>
      <?php if ($footer_email || $footer_phone) : ?>
        <div class="footer-contacts">
          <span class="footer-row-label"><?php echo esc_html(auvenda_field('contact_label_footer', 'Get in touch', 'option')); ?></span>
          <div class="footer-contact-links">
            <?php if ($footer_email) : ?><a href="mailto:<?php echo esc_attr(antispambot($footer_email)); ?>"><small><?php esc_html_e('Email', 'auvenda'); ?></small><?php echo esc_html(antispambot($footer_email)); ?></a><?php endif; ?>
            <?php if ($footer_phone) : ?><a href="tel:<?php echo esc_attr(preg_replace('/[^0-9+]/', '', $footer_phone)); ?>"><small><?php esc_html_e('Phone', 'auvenda'); ?></small><?php echo esc_html($footer_phone); ?></a><?php endif; ?>
          </div>
        </div>
      <?php endif; ?>
      <?php if ($socials) : ?>
        <div class="footer-socials">
          <span><?php echo esc_html(auvenda_field('social_label', 'Follow our journey', 'option')); ?></span>
          <nav class="social-links" aria-label="<?php esc_attr_e('Social media', 'auvenda'); ?>">
            <?php foreach ($socials as $social) : ?>
              <a href="<?php echo esc_url($social['url']); ?>" target="_blank" rel="noopener noreferrer" aria-label="<?php echo esc_attr($social['label']); ?>"><svg viewBox="0 0 24 24" aria-hidden="true"><?php echo $social['icon']; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG. ?></svg></a>
            <?php endforeach; ?>
          </nav>
        </div>
      <?php endif; ?>
    </div>
  </div>
</footer>
<?php wp_footer(); ?>
</body>
</html>
