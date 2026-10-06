<?php get_header();
$hero_background = auvenda_image_url('hero_background', '', get_the_ID());
$audiences = array(
    array('For Learners', 'Explore programs that match your goals, compare course options and choose what works best for you.', 'Find Your Course', '#training'),
    array('For Training Providers and Experts', 'List your programs, connect with learners and reach a global audience.', 'Add a Course', '#providers'),
    array('For Companies', 'Upskill your team, track progress, and manage training records and payments in one place.', 'Explore Programs', '#companies'),
);
$steps = auvenda_field('journey_steps', array());
if (!$steps) {
    $steps = array(
        array('title' => 'Explore', 'text' => 'Browse by category or find a course that matches your goals.'),
        array('title' => 'Compare', 'text' => 'Review training providers and compare course details.'),
        array('title' => 'Enroll', 'text' => 'Apply for a course or enroll and pay online.'),
        array('title' => 'Learn', 'text' => 'Take your course in a flexible format that fits your needs.'),
        array('title' => 'Get Your Certificate', 'text' => 'Receive a certificate or other official proof of course completion.'),
    );
}
$provider_points = array(
    'Publish Your Courses',
    'Reach a Global Audience',
    'Deliver Training to Corporate Clients',
    'Manage Training Online',
    'Scale Your Education Business',
);
$company_benefits = array(
    'Compare courses and plan your team’s training',
    'Enroll employees in courses',
    'Track training progress and outcomes',
    'Change course assignments as needed',
    'Manage certificates and track expiration dates',
);
$hero_note_label = function_exists('get_field') ? get_field('hero_note_label') : '';
$hero_note_text = function_exists('get_field') ? get_field('hero_note_text') : '';
$companies_card_title = function_exists('get_field') ? get_field('companies_card_title') : '';
$form_html = '';
if (auvenda_field('form_source', 'cf7') === 'embed') {
    $form_html = auvenda_field('form_embed', '');
} elseif ($form = auvenda_field('form_cf7')) {
    $form_html = do_shortcode('[contact-form-7 id="' . absint(is_object($form) ? $form->ID : $form) . '"]');
}
$step_icons = array('find', 'enroll', 'learn', 'assess', 'certify');
?>
<main id="content">
<?php if (!auvenda_field('disable_hero_section', false)) : ?>
<section class="hero pattern-background<?php echo $hero_background ? ' has-custom-hero' : ''; ?>" id="top"<?php if ($hero_background) : ?> style="--hero-background:url('<?php echo esc_url($hero_background); ?>')"<?php endif; ?>>
  <div class="container hero-grid hero-grid-single">
    <div class="hero-copy">
      <p class="kicker"><?php echo esc_html(auvenda_field('hero_eyebrow', 'PLATFORM FOR LEARNING AND CAREER GROWTH')); ?></p>
      <h1><?php echo wp_kses_post(auvenda_field('hero_title', 'Auvenda is a global<br>digital learning platform')); ?></h1>
      <p class="hero-lead"><?php echo esc_html(auvenda_field('hero_text', 'Auvenda connects learners with training centres, training providers and industry experts, offering professional development opportunities.')); ?></p>
      <div class="actions">
        <?php echo auvenda_link('hero_cta', 'Explore Courses', get_post_type_archive_link('course'), 'button button-light'); ?>
        <?php echo auvenda_link('hero_second_cta', 'Submit a Course', '#providers', 'button button-light'); ?>
      </div>
      <?php if ($hero_note_label || $hero_note_text) : ?>
      <aside class="hero-note"><?php if ($hero_note_label) : ?><span><?php echo esc_html($hero_note_label); ?></span><?php endif; ?><?php if ($hero_note_text) : ?><p><?php echo esc_html($hero_note_text); ?></p><?php endif; ?></aside>
      <?php endif; ?>
    </div>
  </div>
</section>
<?php endif; ?>

<?php if (!auvenda_field('disable_audiences_section', false)) : ?>
<section class="audiences section-light" id="about">
  <div class="container">
    <div class="section-intro">
      <p class="kicker"><?php echo esc_html(auvenda_field('audiences_eyebrow', 'ONE PLACE TO LEARN AND GROW')); ?></p>
      <h2><?php echo wp_kses_post(auvenda_field('audiences_title', 'Choose Your Path on Auvenda')); ?></h2>
      <p><?php echo esc_html(auvenda_field('audiences_text', 'Auvenda lets you choose your path - learn or teach.')); ?></p>
    </div>
    <div class="audience-grid">
      <?php foreach ($audiences as $i => $card) : ?>
      <a class="audience-card" href="<?php echo esc_url($card[3]); ?>"><span><?php echo esc_html(sprintf('%02d', $i + 1)); ?></span><h3><?php echo esc_html($card[0]); ?></h3><p><?php echo esc_html($card[1]); ?></p><b><?php echo esc_html($card[2]); ?> <i>→</i></b></a>
      <?php endforeach; ?>
    </div>
  </div>
</section>
<?php endif; ?>

<?php if (!auvenda_field('disable_journey_section', false)) : ?>
<section class="journey section-blue orbit-pattern" id="training">
  <div class="container">
    <div class="section-intro compact">
      <p class="kicker"><?php echo esc_html(auvenda_field('journey_eyebrow', 'YOUR LEARNING JOURNEY')); ?></p>
      <h2><?php echo wp_kses_post(auvenda_field('journey_title', 'From Course Search to Real Results')); ?></h2>
    </div>
    <ol class="journey-list">
      <?php foreach ($steps as $i => $step) :
          $icon = !empty($step['icon']) ? wp_get_attachment_image_url($step['icon'], 'full') : auvenda_asset('auvenida/icons/' . $step_icons[$i % 5] . '.svg');
      ?>
      <li><span><?php echo esc_html(sprintf('%02d', $i + 1)); ?></span><img src="<?php echo esc_url($icon); ?>" alt=""><b><?php echo esc_html($step['title']); ?></b><small><?php echo esc_html($step['text']); ?></small></li>
      <?php endforeach; ?>
    </ol>
  </div>
</section>
<?php endif; ?>

<?php if (!auvenda_field('disable_courses_section', false)) : ?>
<section class="directions section-light">
  <div class="container split-title">
    <div class="section-intro">
      <p class="kicker"><?php echo esc_html(auvenda_field('courses_eyebrow', 'Course Catalog')); ?></p>
      <h2><?php echo esc_html(auvenda_field('courses_title', 'Courses to match your professional goals')); ?></h2>
    </div>
    <?php echo auvenda_link('courses_cta', 'View All Courses', get_post_type_archive_link('course'), 'text-action dark-text'); ?>
  </div>
  <div class="container direction-grid">
    <?php foreach (auvenda_course_directions() as $i => $direction) : ?>
    <a href="<?php echo esc_url(add_query_arg('direction', $direction['slug'], get_post_type_archive_link('course'))); ?>">
      <span class="direction-number"><?php echo esc_html(sprintf('%02d', $i + 1)); ?></span>
      <span class="direction-copy"><strong><?php echo esc_html(auvenda_direction_label($direction)); ?></strong><?php if (!empty($direction['description'])) : ?><small><?php echo esc_html($direction['description']); ?></small><?php endif; ?></span>
      <span class="direction-arrow">→</span>
    </a>
    <?php endforeach; ?>
  </div>
</section>
<?php endif; ?>

<section class="education-providers section-light" id="education-providers">
  <div class="container">
    <div class="section-intro providers-intro">
      <p class="kicker"><?php esc_html_e('TRAINING PROVIDERS AND EXPERTS', 'auvenda-theme'); ?></p>
      <h2><?php esc_html_e('Professional Training Across a Range of Multiple Fields', 'auvenda-theme'); ?></h2>
      <p><?php esc_html_e('Auvenda brings educational institutions, training providers and experts together in one place to offer their professional programs.', 'auvenda-theme'); ?></p>
    </div>
    <div class="provider-types">
      <article><span>01</span><h3><?php esc_html_e('Educational Institutions', 'auvenda-theme'); ?></h3><p><?php esc_html_e('Universities, institutes, academies and other educational institutions offering professional education and training programs.', 'auvenda-theme'); ?></p></article>
      <article><span>02</span><h3><?php esc_html_e('Simulator Training Centers', 'auvenda-theme'); ?></h3><p><?php esc_html_e('Hands-on training with simulators and specialized equipment.', 'auvenda-theme'); ?></p></article>
      <article><span>03</span><h3><?php esc_html_e('Providers and Experts', 'auvenda-theme'); ?></h3><p><?php esc_html_e('Professional and specialized courses delivered by training providers, companies and industry experts.', 'auvenda-theme'); ?></p></article>
    </div>
    <a class="text-action dark-text section-cta" href="#contact"><?php esc_html_e('Join Auvenda as a Provider', 'auvenda-theme'); ?> <span>→</span></a>
  </div>
</section>

<section class="global-platform section-blue" id="markets">
  <div class="container global-grid">
    <div class="section-intro">
      <p class="kicker"><?php esc_html_e('AUVENDA UNBOUND', 'auvenda-theme'); ?></p>
      <h2><?php esc_html_e('GLOBAL PLATFORM ACROSS MULTIPLE FIELDS', 'auvenda-theme'); ?></h2>
      <p><?php esc_html_e('Auvenda makes learning and professional development accessible from anywhere.', 'auvenda-theme'); ?></p>
    </div>
    <dl class="global-facts">
      <div><dt><?php esc_html_e('Global Reach', 'auvenda-theme'); ?></dt><dd><?php esc_html_e('Digital Ecosystem - Offline/ Online', 'auvenda-theme'); ?></dd></div>
      <div><dt><?php esc_html_e('Borderless Learning', 'auvenda-theme'); ?></dt><dd><?php esc_html_e('Providers and experts worldwide', 'auvenda-theme'); ?></dd></div>
      <div><dt><?php esc_html_e('Offline / Online', 'auvenda-theme'); ?></dt><dd><?php esc_html_e('Available formats vary by course', 'auvenda-theme'); ?></dd></div>
    </dl>
  </div>
</section>

<?php if (!auvenda_field('disable_providers_section', false)) : ?>
<section class="provider-section section-dark-base" id="providers">
  <div class="container provider-grid">
    <div>
      <p class="kicker"><?php echo esc_html(auvenda_field('providers_eyebrow', 'FOR TRAINING PROVIDERS AND EXPERTS')); ?></p>
      <h2><?php echo wp_kses_post(auvenda_field('providers_title', 'Grow and Scale Your Education Business')); ?></h2>
      <p class="body-copy"><?php echo esc_html(auvenda_field('providers_text', 'Auvenda connects training providers and experts with wider audiences and new clients so they can scale their education business globally.')); ?></p>
      <?php echo auvenda_link('providers_cta', 'Offer Your Courses and Programs on Auvenda', '#contact', 'button button-gold'); ?>
    </div>
    <ul>
      <?php foreach ($provider_points as $item) : ?><li><?php echo esc_html($item); ?></li><?php endforeach; ?>
    </ul>
  </div>
</section>
<?php endif; ?>

<section class="course-production section-blue" id="course-production">
  <div class="container production-grid">
    <div class="section-intro">
      <p class="kicker"><?php esc_html_e('COURSE PRODUCTION', 'auvenda-theme'); ?></p>
      <h2><?php esc_html_e('Turn Your Expertise into a Ready-to-Launch Course', 'auvenda-theme'); ?></h2>
      <p><?php esc_html_e('Auvenda supports the course development process from curriculum design and learning materials to video production.', 'auvenda-theme'); ?></p>
    </div>
    <ol class="production-flow">
      <li><?php esc_html_e('Expertise', 'auvenda-theme'); ?></li>
      <li><?php esc_html_e('Course Curriculum', 'auvenda-theme'); ?></li>
      <li><?php esc_html_e('Production', 'auvenda-theme'); ?></li>
      <li><?php esc_html_e('Complete Course', 'auvenda-theme'); ?></li>
      <li><?php esc_html_e('Launch', 'auvenda-theme'); ?></li>
    </ol>
  </div>
</section>

<?php if (!auvenda_field('disable_companies_section', false)) : ?>
<section class="companies section-light" id="companies">
  <div class="container company-grid">
    <div>
      <?php if (is_string($companies_card_title) && $companies_card_title !== '') : ?><p class="kicker"><?php echo esc_html($companies_card_title); ?></p><?php endif; ?>
    <ul class="company-benefits">
      <?php foreach ($company_benefits as $benefit) : ?><li><?php echo esc_html($benefit); ?></li><?php endforeach; ?>
    </ul>
    </div>
    <div>
      <p class="kicker"><?php echo esc_html(auvenda_field('companies_eyebrow', 'FOR COMPANIES')); ?></p>
      <h2><?php echo wp_kses_post(auvenda_field('companies_title', 'Manage Your Team’s Training in One Place')); ?></h2>
      <p class="body-copy"><?php echo esc_html(auvenda_field('companies_text', 'Plan employee training, enroll employees in courses, track their progress and results, and manage certificates and payments, all from a single platform.')); ?></p>
      <?php echo auvenda_link('companies_cta', 'Discuss corporate training', '#contact', 'text-action dark-text'); ?>
    </div>
  </div>
</section>
<?php endif; ?>

<section class="platform-ecosystem section-dark-base" id="ecosystem">
  <div class="container ecosystem-grid">
    <div class="section-intro">
      <p class="kicker"><?php esc_html_e('PLATFORM BUILT FOR THOSE WHO TEACH', 'auvenda-theme'); ?></p>
      <h2><?php esc_html_e('Multiple Training Formats on One Platform', 'auvenda-theme'); ?></h2>
      <p><?php esc_html_e('Auvenda brings the professional training community together in one digital environment.', 'auvenda-theme'); ?></p>
    </div>
    <div class="ecosystem-map" aria-label="<?php esc_attr_e('Auvenda platform ecosystem', 'auvenda-theme'); ?>">
      <strong><?php esc_html_e('Auvenda Global Platform', 'auvenda-theme'); ?></strong>
      <span><?php esc_html_e('Educational Institutions', 'auvenda-theme'); ?></span>
      <span><?php esc_html_e('Training Centers', 'auvenda-theme'); ?></span>
      <span><?php esc_html_e('Industry Experts', 'auvenda-theme'); ?></span>
      <span><?php esc_html_e('Training Providers', 'auvenda-theme'); ?></span>
    </div>
  </div>
</section>

<section class="platform-principles section-light" id="principles">
  <div class="container">
    <div class="section-intro">
      <p class="kicker"><?php esc_html_e('PLATFORM PRINCIPLES', 'auvenda-theme'); ?></p>
      <h2><?php esc_html_e('Built for Professional Development', 'auvenda-theme'); ?></h2>
      <p><?php esc_html_e('The principles guiding how Auvenda works with education partners and manages data and documentation.', 'auvenda-theme'); ?></p>
    </div>
    <ol class="principles-list">
      <li><span>01</span><strong><?php esc_html_e('Focus on Professional Development', 'auvenda-theme'); ?></strong></li>
      <li><span>02</span><strong><?php esc_html_e('Verified Training Providers', 'auvenda-theme'); ?></strong></li>
      <li><span>03</span><strong><?php esc_html_e('Data Privacy', 'auvenda-theme'); ?></strong></li>
      <li><span>04</span><strong><?php esc_html_e('Digital Certification', 'auvenda-theme'); ?></strong></li>
      <li><span>05</span><strong><?php esc_html_e('Multilingual Environment', 'auvenda-theme'); ?></strong></li>
    </ol>
  </div>
</section>

<?php if (!auvenda_field('disable_form_section', false)) : ?>
<section class="contact section-blue" id="contact">
  <div class="container contact-grid">
    <div>
      <p class="kicker"><?php echo esc_html(auvenda_field('form_eyebrow', 'CONTACT & INQUIRIES')); ?></p>
      <h2><?php echo wp_kses_post(auvenda_field('form_title', 'Select Your Role')); ?></h2>
      <p><?php echo esc_html(auvenda_field('form_text', 'Choose the option that best reflects how you plan to use the platform:')); ?></p>
      <?php auvenda_contact_channels_html(); ?>
    </div>
    <?php if (trim($form_html) !== '') : ?><div class="kommo-form-panel"><div class="form-wrap"><?php echo do_shortcode($form_html); ?></div></div><?php endif; ?>
  </div>
</section>
<?php endif; ?>
</main>
<?php get_footer(); ?>
