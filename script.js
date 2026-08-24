const SOURCE_API = 'https://tcsavant.com/wp-json/wp/v2/courses';
const DEFAULT_TITLE = document.title;
const PAGE_SIZE = 12;

const directionDefinitions = [
  {
    slug: 'officers_navigation',
    label: 'Training for Officers (Deck)',
    labels: { ru: 'Подготовка для лиц командного состава судна (Судоводители)', uk: 'Підготовка для командного складу судна (Судноводії)' },
    description: 'Professional training for deck officers and navigation watch personnel.',
    sourceSlugs: 'ship-security-officer designated-security-duties-of-shipboard-personnel security-awarness-training advanced-fire-fighting medical-first-aid-on-board-ship training-for-proficiency-in-survival-craft-and-rescue-boats-other-than-fast-rescue-boats medical-care-on-board-ship radar-navigation-arpa-bridge-teamwork-and-search-and-rescue-management-level safety-familiarization-basic-training-and-instruction ship-safety-officer-sso global-maritime-distress-and-safety-system-restricted-operators-certificate-gmdss-roc training-and-refresh-training-of-gmdss-operators-general-operators-certificate radar-navigation-radar-plotting-and-use-of-arpa-operational-level ship-handling-and-maneuvering-shm bridge-resource-management-management-level-operational-level okazanie-pervoy-meditsinskoy-pomoschi-na-bortu-sudna meditsinskiy-uhod-na-bortu-sudna radarnaya-navigatsiya-sarp-komandnaya-rabota-na-mostike-poisk-i-spasenie-uroven-upravleniya ofitser-po-bezopasnosti-sudna globalnaya-morskaya-sistema-svyazi-pri-bedstvii-gmssb-ogranichennyy-diplom-operatora operator-gmssb-dlya-polucheniya-ili-podtverzhdeniya-obschego-diploma sudovozhdenie-s-ispolzovaniem-radiolokatora-radiolokatsionnoy-prokladki-i-ispolzovaniem-arpa-uroven-ekspluatatsii upravlenie-sostavom-navigatsionnoy-vahty-na-mostike-uroven-upravleniya-i-ekspluatatsii medychnyy-doglyad-na-bortu-sudna sudnovodinnya-z-vykorystannyam-radiolokatora-zarp-robota-v-komandi-na-mistku-ta-poshuk-i-poryatunok-riven-upravlinnya nadannya-pershoy-medichnoy-dopomogy ofitser-z-bezpeky-sudna hlobalna-morska-systema-zvyazku-pid-chas-lykha-ta-dlya-zabezpechennya-bezpeky-moreplavstva-hmzlb-obmezhenyy-dyplom-operatora operator-gmzlb-na-otrymannya-abo-pidtverdzhennya-zagalnogo-dyplomu sudnovodinnya-z-vykorystannyam-radiolokatora-radiolokatsiynoyi-prokladky-ta-vykorystannyam-zarp-riven-ekspluatatsiyi upravlinnya-skladom-navigatsiynoy-vahty-na-mistku-riven-upravlinnya-i-ekspluatatsiyi'.split(' ')
  },
  {
    slug: 'officers_engineers',
    label: 'Training for Officers (Engine)',
    labels: { ru: 'Подготовка для лиц командного состава судна (Механики)', uk: 'Підготовка для командного складу судна (Механіки)' },
    description: 'Professional training for engineering officers and engine-room watch personnel.',
    sourceSlugs: 'operation-and-maintenance-of-electrical-systems-with-voltage-over-1000-volts ship-security-officer designated-security-duties-of-shipboard-personnel security-awarness-training advanced-fire-fighting medical-first-aid-on-board-ship training-for-proficiency-in-survival-craft-and-rescue-boats-other-than-fast-rescue-boats medical-care-on-board-ship safety-familiarization-basic-training-and-instruction engine-room okazanie-pervoy-meditsinskoy-pomoschi-na-bortu-sudna meditsinskiy-uhod-na-bortu-sudna medychnyy-doglyad-na-bortu-sudna nadannya-pershoy-medichnoy-dopomogy ekspluatacziya-ta-obslugovuvannya-elektrychnyh-system-s-naprugoyu-ponad-1000-volt'.split(' ')
  },
  {
    slug: 'ratings',
    label: 'Training for Ratings',
    labels: { ru: 'Подготовка для рядового состава судна', uk: 'Підготовка для рядового складу судна' },
    description: 'Core safety and professional training for vessel ratings.',
    sourceSlugs: 'designated-security-duties-of-shipboard-personnel security-awarness-training advanced-fire-fighting medical-first-aid-on-board-ship training-for-proficiency-in-survival-craft-and-rescue-boats-other-than-fast-rescue-boats safety-familiarization-basic-training-and-instruction okazanie-pervoy-meditsinskoy-pomoschi-na-bortu-sudna zalyshannya-potopayuchogo-gelikoptera nadannya-pershoy-medichnoy-dopomogy'.split(' ')
  },
  {
    slug: 'ship_types',
    label: 'Special training for certain types of ships',
    labels: { ru: 'Специальная подготовка для определенных типов судов', uk: 'Спеціальна підготовка за певними типами суден' },
    description: 'Specialised preparation for tanker, gas carrier, polar and dangerous-goods operations.',
    sourceSlugs: 'advanced-training-for-ships-operating-in-polar-waters liquefied-gas-tanker-cargo-operation chemical-tanker-cargo-operations-advanced-level-atct-atctco-chemco basic-training-polar-waters advanced-training-igf-code basic-training-igf-code liquefied-gas-tanker-cargo-operations-advanced-level-gasco-atlgtco oil-tanker-cargo-operations-advanced-level-atctco-tasco basic-training-tankr-operations cargo-operations-on-ships-carrying-dangerous-goods-in-solid-form-in-bulk-and-packaged-form-imdg-hazmat-handling rasshirennaya-podgotovka-dlya-sudov-v-polyarnykh-vodakh gruzovye-operatsii-na-tankerah-himovozah-prodvinutyy-uroven gruzovye-operatsii-na-tankerah-gazovozah-prodvinutyy-uroven gruzovye-operatsii-na-neftyanyh-tankerah-prodvinutyy-uroven basic-training-tanker-operations gruzovye-operatsii-na-sudah-perevozyaschih-opasnye-gruzy-v-tverdoy-forme-navalom-i-v-upakovke sudna-shcho-pratsyuyut-u-polyarnykh-vodakh-rozshyrena-pidhotovka-polyarni-vody vantazhni-operatsiyi-na-tankerakh-khimovozakh-rozshyrenyy-riven vantazhni-operatsiyi-na-tankerakh-hazovozakh-rozshyrenyy-riven vantazhni-operatsiyi-na-naftovykh-tankerakh-rozshyrenyy-riven pidhotovka-osib-komandnoho-ta-ryadovoho-skladu-yaki-vidpovidayut-za-vantazhni-operatsiyi-na-sudnakh-shcho-perevozyat-nebezpechni-rechovyny-navalom-ta-v-upakovtsi'.split(' ')
  },
  {
    slug: 'passenger',
    label: 'Training for the crew of passenger ships',
    labels: { ru: 'Подготовка персонала пассажирских судов', uk: 'Підготовка персоналу пасажирських суден' },
    description: 'Safety, service and crisis-management training for passenger ship personnel.',
    sourceSlugs: 'ships-cook-category-iv ships-waiter-category-iv english-language ship-steward crisis-management-and-human-behavior-cmhb passenger-safety-cargo-safety crowd-management-training-cmt safety-training-for-personnel-providing-direct-service-to-passengers-in-passenger-spaces podgotovka-po-upravleniyu-krizisnymi-situatsiyami-i-povedeniyu-lyudey podgotovka-po-upravleniyu-neorganizovannymi-massami-lyudey-obuchenie-upravleniyu-tolpoy podgotovka-po-voprosam-bezopasnosti-dlya-personala-obespechivayuschego-neposredstvennoe-obsluzhivanie-passazhirov-v-passazhirskih-pomescheniyah english-courses styuard oficziant-sudnovyj-chetvertogo-rozryadu kuhar-sudnovyj-chetvertogo-rozryadu pidhotovka-z-upravlinnya-ta-povedinky-lyudey-u-kryzovykh-sytuatsiyakh pidhotovka-z-upravlinnya-neorhanizovanymy-masamy-lyudey pidgotovka-z-pytan-bezpeky-dlya-personalu-yakyy-zabezpechue-bezposeredne-obslugovuvannya-pasazhyriv-u-pasazhyrskyh-prymischennyah'.split(' ')
  },
  {
    slug: 'professional_technical',
    label: 'Professional Technical Education',
    labels: { ru: 'Профессионально-техническое образование', uk: 'Професійно-технічна освіта' },
    description: 'Long-form vocational preparation for maritime technical and service roles.',
    sourceSlugs: 'ship-electrician-second-class ship-electric-gas-welder-fourth-grade ship-electrician-first-class motorman-machinist-second-class seaman-first-class seaman-second-class motorman-machinist-first-class ships-cook-category-iv motoryst-mashynyst-vtorogo-klassa matros-pervogo-klassa matros-vtorogo-klassa motoryst-mashynyst-pervogo-klassa motoryst-mashynist-pershogo-klasu motoryst-mashynist-drugogo-klasu matros-pershogo-klasu matros-drugogo-klasu kuhar-sudnovyj-chetvertogo-rozryadu elektrogazozvarnyk-sudnovyj-chetvertogo-rozryadu elektryk-sudnovyj-pershogo-klasu elektryk-sudnovyj-drugogo-klasu'.split(' ')
  },
  {
    slug: 'competence_upgrade',
    label: 'Increasing the level of competence',
    labels: { ru: 'Повышение уровня компетентности', uk: 'Підвищення рівня компетентності' },
    description: 'Short specialist courses for competence maintenance and professional development.',
    sourceSlugs: 'inert-gas-system sash ship-to-ship combating-maritime-cybersecurity-threats-cyber-risks-en ship-crane-operator-training helmsman-training automatic-identification-systems-ais scba-use-of-isolated-breathing-apparatus-with-compressed-air maintenance-of-electrical-and-electronic-equipment tank-cleaning-with-crude-oil ballast-system-and-use-of-ballast-system liquid-cargo-handling-simulator cargo-pump-systems-and-use-of-pump-systems safe-food-system-on-board-ship international-labour-convention-in-maritime-shipping-mlc tank-inspection safety-management-system-ism pollution-prevention-and-protection-of-marine-environment-marpol abandonment-of-sinking-helicopter automatic-external-defibrillator-defibrillators-saver-one-svo-v0001 hazards-associated-with-h2s-gas planned-system-maintenance-amos-for-windows entry-into-enclosed-spaces-premises-on-board-ships leadership-and-teamwork-human-factor en-liquefied-petroleum-gas-lpg-tanker-cargo-and-ballast-handling-operations combating-maritime-cybersecurity-threats-cyber-risks inert-gas-system-ru borba-s-ugrozamy-morskoy-kyberbezop ballastnaya-systema-y-yspolzovanye-b proverka-tankov systema-bezopasnogo-pytanyya-na-sudne mezhdunarodnaya-konventsyya-o-trude-v-mor systema-upravlenyya-bezopasnostyu-mk predotvrashhenye-zagryaznenyya-y-zashhyta ostavlenye-tonushhego-vertoleta avtomatycheskyy-vneshnyy-defybryllyato opasnost-svyazannaya-s-gazom-h2s planovoe-tehnycheskoe-obsluzhyvanye-s lyderstvo-y-rabota-v-komande-cheloveche ru-liquefied-petroleum-gas-lpg-tanker-cargo-and-ballast-handling-operations borba-s-ugrozami-morskoj-kiberbezopasnosti-kiberriski inert-gas-system-uk liquefied-petroleum-gas-lpg-tanker-cargo-and-ballast-handling-operations lyderstvo-y-rabota-v-komande-chelovecheskyj-faktor vhid-do-zamknutyh-prostoriv-prymishhen-na-bortu-suden derzhavnyj-portovyj-kontrol avtomatychnyj-zovnishnij-defibrylyator-defibrylyatory-saver-one-svo-v0001 nebezpeka-povyazana-z-gazom-h2s planove-tehnichne-obslugovuvannya-systemy-amos-for-windows systema-upravlinnya-bezpekoyu-mkub zapobigannya-zabrudnennya-ta-zahyst-morskogo-otochuyuchogo-seredovyshha-marpol zalyshannya-potopayuchogo-gelikoptera systema-bezpechnogo-harchuvannya-na-sudni mizhnarodna-konvencziya-z-praczi-u-morskomu-sudnoplavstvi-mop perevirka-tankiv vantazhni-nasosni-systemy balastna-systema myttya-syroyu-naftoyu asv-vykorystannya-izolovanyh-dyhalnyh-aparativ-iz-stysnutym-povitryam obslugovuvannya-elektrychnogo-ta-elektronnogo-obladnannya pidgotovka-z-upravlinnya-kranamy pidgotovka-rulovyh avtomatychni-identyfikaczijni-systemy-aic borotba-z-pogrozamy-morskoyi-kiberbezpeky-kiberryzyky'.split(' ')
  }
];

const languageNames = { en: 'English', ru: 'Russian', uk: 'Ukrainian' };
const LANGUAGE_STORAGE_KEY = 'maritime-platform-language';

const translations = {
  ru: {
    'European Maritime Training Platform': 'Европейская платформа морского обучения',
    'Skip to content': 'Перейти к содержимому',
    'Maritime Training Platform': 'Платформа морского обучения',
    'Courses': 'Курсы',
    'Training Providers': 'Учебные центры',
    'For Companies': 'Для компаний',
    'About': 'О платформе',
    'Contact': 'Связаться',
    'Menu': 'Меню',
    'EUROPE · MARITIME TRAINING PLATFORM': 'ЕВРОПА · ПЛАТФОРМА МОРСКОГО ОБУЧЕНИЯ',
    'Maritime Training.': 'Морское обучение.',
    'Connected.': 'Объединённое.',
    'A future platform connecting seafarers, maritime training providers and shipping companies across international markets.': 'Будущая платформа, объединяющая моряков, учебные центры и судоходные компании на международных рынках.',
    'Explore Training': 'Найти обучение',
    'Become a Training Partner': 'Стать учебным партнёром',
    'IMAGE PLACEHOLDER': 'МЕСТО ДЛЯ ИЗОБРАЖЕНИЯ',
    'European maritime training network': 'Европейская сеть морского обучения',
    'WHO THE PLATFORM WILL SERVE': 'ДЛЯ КОГО СОЗДАЁТСЯ ПЛАТФОРМА',
    'One Maritime Training Platform': 'Единая платформа морского обучения',
    'Choose a path to explore the planned training journey.': 'Выберите направление и познакомьтесь с будущим процессом обучения.',
    'For Seafarers': 'Для моряков',
    'Find professional maritime training, compare providers and plan your certification path.': 'Находите профессиональное морское обучение, сравнивайте учебные центры и планируйте сертификацию.',
    'Find Training →': 'Найти обучение →',
    'For Training Providers': 'Для учебных центров',
    'Prepare to publish courses, manage learners and reach maritime professionals in new international markets.': 'Публикуйте курсы, управляйте обучением и выходите на новые международные рынки.',
    'Join Platform →': 'Присоединиться →',
    'For Shipping Companies': 'Для судоходных компаний',
    'Plan crew training, monitor completion and maintain visibility over certification.': 'Планируйте обучение экипажей, отслеживайте прохождение и контролируйте сертификацию.',
    'Learn More →': 'Подробнее →',
    'A CLEAR TRAINING JOURNEY': 'ПОНЯТНЫЙ ПУТЬ ОБУЧЕНИЯ',
    'How it works': 'Как это работает',
    'Find': 'Найти',
    'Enroll': 'Записаться',
    'Learn': 'Учиться',
    'Assess': 'Пройти оценку',
    'Certify': 'Получить сертификат',
    'PLANNED COURSE CATALOGUE': 'БУДУЩИЙ КАТАЛОГ КУРСОВ',
    'Explore Training Directions': 'Направления обучения',
    'View All Training →': 'Все курсы →',
    'Connecting to the tcsavant.com course catalogue…': 'Подключаемся к каталогу курсов tcsavant.com…',
    'EDUCATIONAL SERVICE PROVIDERS': 'ПОСТАВЩИКИ ОБРАЗОВАТЕЛЬНЫХ УСЛУГ',
    'Discover Training Providers': 'Учебные центры',
    'Explore the types of maritime academies and specialist training centres planned for the future platform.': 'Познакомьтесь с типами морских академий и специализированных учебных центров будущей платформы.',
    'Join as a Provider →': 'Стать учебным центром →',
    'PROVIDER PROFILE': 'ПРОФИЛЬ УЧЕБНОГО ЦЕНТРА',
    'PLACEHOLDER': 'ПЛЕЙСХОЛДЕР',
    'ACADEMY · MULTI-DISCIPLINE': 'АКАДЕМИЯ · РАЗНЫЕ НАПРАВЛЕНИЯ',
    'Maritime Academy': 'Морская академия',
    'Safety, navigation and professional development programmes for seafarers.': 'Программы по безопасности, навигации и профессиональному развитию моряков.',
    'Europe / International': 'Европа / Международный рынок',
    'Profile concept': 'Концепт профиля',
    'View Provider Concept →': 'Посмотреть концепт →',
    'TECHNICAL · ENGINEERING': 'ТЕХНИЧЕСКИЙ · ИНЖЕНЕРНЫЙ',
    'Technical Training Centre': 'Технический учебный центр',
    'Engineering, machinery and operational training for maritime professionals.': 'Инженерная, техническая и эксплуатационная подготовка морских специалистов.',
    'SAFETY · STCW-ORIENTED': 'БЕЗОПАСНОСТЬ · ОРИЕНТАЦИЯ НА ПДНВ',
    'Safety Training Institute': 'Институт подготовки по безопасности',
    'Planned access to practical safety, security and emergency response training.': 'Планируемый доступ к практическому обучению по безопасности и действиям в чрезвычайных ситуациях.',
    'Europe to international maritime markets': 'Из Европы на международные морские рынки',
    'EUROPE · CROSS-BORDER · INTERNATIONAL': 'ЕВРОПА · БЕЗ ГРАНИЦ · МЕЖДУНАРОДНЫЙ РЫНОК',
    'European Expertise. Global Connections.': 'Европейская экспертиза. Глобальные связи.',
    'The concept starts in Europe and is being shaped to connect maritime professionals, training providers and shipping companies across global maritime markets.': 'Концепция создаётся в Европе, чтобы объединить морских специалистов, учебные центры и судоходные компании по всему миру.',
    'Europe': 'Европа',
    'Platform origin': 'Происхождение платформы',
    'Cross-border': 'Без границ',
    'Market connection': 'Связь рынков',
    'International': 'Международный',
    'Future network': 'Будущая сеть',
    'FOR TRAINING PROVIDERS': 'ДЛЯ УЧЕБНЫХ ЦЕНТРОВ',
    'Bring Your Maritime Training Online': 'Перенесите морское обучение онлайн',
    'Connect your centre to a wider market while keeping control of your courses and learners.': 'Выходите на более широкий рынок, сохраняя контроль над курсами и слушателями.',
    'Become a Training Partner →': 'Стать учебным партнёром →',
    'Currently speaking with selected maritime training providers in Europe and international markets.': 'Сейчас мы общаемся с выбранными поставщиками морского обучения в Европе и на международных рынках.',
    'Publish courses': 'Публиковать курсы',
    'Manage students': 'Управлять слушателями',
    'Deliver learning materials': 'Предоставлять учебные материалы',
    'Track progress': 'Отслеживать прогресс',
    'Conduct assessments': 'Проводить оценивание',
    'Issue certificates': 'Выдавать сертификаты',
    'FOR SHIPPING COMPANIES': 'ДЛЯ СУДОХОДНЫХ КОМПАНИЙ',
    'Manage Crew Training in One Place': 'Управляйте обучением экипажа в одном месте',
    'Source suitable courses, coordinate group enrolments and maintain a clearer view of crew training status.': 'Подбирайте курсы, координируйте групповую запись и контролируйте статус обучения экипажа.',
    'Discuss Corporate Training →': 'Обсудить корпоративное обучение →',
    'Corporate training tools are being developed with future industry partners.': 'Инструменты корпоративного обучения разрабатываются совместно с будущими отраслевыми партнёрами.',
    'Find Training': 'Найти обучение',
    'Enroll Crew': 'Записать экипаж',
    'Track Training': 'Отслеживать обучение',
    'Manage Certificates': 'Управлять сертификатами',
    'PLATFORM ECOSYSTEM': 'ЭКОСИСТЕМА ПЛАТФОРМЫ',
    'More Than a Course Marketplace': 'Больше, чем каталог курсов',
    'One planned digital environment connecting training, learning, assessment and certification.': 'Единая цифровая среда, объединяющая курсы, обучение, оценивание и сертификацию.',
    'Seafarers': 'Моряки',
    'Crew Managers': 'Крю-менеджеры',
    'Shipping Companies': 'Судоходные компании',
    'Enrollment': 'Запись',
    'Learning': 'Обучение',
    'Assessment': 'Оценивание',
    'Certification': 'Сертификация',
    'PLATFORM PRINCIPLES': 'ПРИНЦИПЫ ПЛАТФОРМЫ',
    'Designed for Professional Maritime Training': 'Создано для профессионального морского обучения',
    'STCW-oriented Structure': 'Структура, ориентированная на ПДНВ',
    'Provider Verification': 'Проверка учебных центров',
    'Secure Training Records': 'Защищённые данные об обучении',
    'Digital Certification': 'Цифровая сертификация',
    'Multi-language Experience': 'Многоязычный интерфейс',
    'START A CONVERSATION': 'НАЧАТЬ ДИАЛОГ',
    'Find the right next step.': 'Выберите следующий шаг.',
    'Tell us whether you need training, provide courses or manage crew development.': 'Расскажите, ищете ли вы обучение, предлагаете курсы или управляете развитием экипажа.',
    'I Need Training': 'Мне нужно обучение',
    'I Provide Training': 'Я провожу обучение',
    'I Manage Crews': 'Я управляю экипажами',
    'Contact Us →': 'Связаться с нами →',
    'I am a...': 'Я представляю...',
    'Seafarer': 'Моряк',
    'Training Provider': 'Учебный центр',
    'Shipping Company': 'Судоходная компания',
    'Home': 'Главная',
    'Training Directions': 'Направления обучения',
    'All Training': 'Все курсы',
    'COURSE CATALOGUE · INTERNAL PAGE PROTOTYPE': 'КАТАЛОГ КУРСОВ · ПРОТОТИП ВНУТРЕННЕЙ СТРАНИЦЫ',
    'Live course titles are loaded from tcsavant.com. Marketplace details remain placeholders.': 'Названия курсов загружаются с tcsavant.com. Остальные данные маркетплейса пока являются плейсхолдерами.',
    'COURSES FOUND': 'НАЙДЕНО КУРСОВ',
    'Connecting to source…': 'Подключаемся к источнику…',
    'FILTER BY DIRECTION': 'ФИЛЬТР ПО НАПРАВЛЕНИЮ',
    'Back to landing': 'Вернуться на лендинг',
    'SELECTED DIRECTION': 'ВЫБРАННОЕ НАПРАВЛЕНИЕ',
    'PROTOTYPE DATA VIEW': 'ПРОТОТИП КАТАЛОГА',
    'Show More Courses →': 'Показать ещё →',
    'European origin · Cross-border access · International maritime market': 'Европейское происхождение · Доступ без границ · Международный морской рынок',
    'Providers': 'Учебные центры',
    'CLICKABLE LOW-FIDELITY PROTOTYPE': 'КЛИКАБЕЛЬНЫЙ НИЗКОДЕТАЛИЗИРОВАННЫЙ ПРОТОТИП',
    'Design Guide': 'Дизайн-гайд',
    'PROVIDER PROFILE · CONCEPT PREVIEW': 'ПРОФИЛЬ УЧЕБНОГО ЦЕНТРА · КОНЦЕПТ',
    'Close': 'Закрыть',
    'Full Name': 'Имя и фамилия',
    'Email': 'Email',
    'Phone / WhatsApp': 'Телефон / WhatsApp',
    'Country / Region': 'Страна / Регион',
    'Current Rank / Role': 'Текущая должность / Роль',
    'Course Interest': 'Интересующий курс',
    'Preferred Training Location': 'Предпочтительное место обучения',
    'Message': 'Сообщение',
    'Contact Name': 'Контактное лицо',
    'Training Centre Name': 'Название учебного центра',
    'Website': 'Сайт',
    'Approximate Number of Courses': 'Примерное количество курсов',
    'Company': 'Компания',
    'Approximate Crew Size': 'Примерная численность экипажа',
    'Training Requirements': 'Требования к обучению',
    'Select a course direction': 'Выберите направление курса',
    'Seafarer enquiry': 'Запрос моряка',
    'Find suitable training': 'Подобрать подходящее обучение',
    'Training provider enquiry': 'Запрос учебного центра',
    'Discuss joining the platform': 'Обсудить подключение к платформе',
    'Shipping company enquiry': 'Запрос судоходной компании',
    'Discuss crew training': 'Обсудить обучение экипажа',
    'Request Training Guidance →': 'Получить консультацию по обучению →',
    'Become a Training Partner →': 'Стать учебным партнёром →',
    'Discuss Provider Partnership →': 'Обсудить партнёрство →',
    'This placeholder demonstrates how a future provider profile may present specialisms, delivery formats and planned courses. No provider partnership or course availability is implied.': 'Этот плейсхолдер показывает будущий профиль учебного центра: специализации, форматы и планируемые курсы. Он не подтверждает партнёрство или доступность курсов.',
    'I agree to be contacted about this enquiry.': 'Я согласен на связь по этому запросу.',
    '(Prototype only — no data is stored.)': '(Только прототип — данные не сохраняются.)',
    'Live catalogue source': 'Живой источник каталога',
    'Catalogue source unavailable · prototype placeholders shown': 'Источник каталога недоступен · показаны плейсхолдеры',
    'Loading course titles from tcsavant.com…': 'Загружаем курсы с tcsavant.com…',
    'LIVE SOURCE': 'ЖИВОЙ ИСТОЧНИК',
    'PLACEHOLDER DATA': 'ДАННЫЕ-ПЛЕЙСХОЛДЕРЫ',
    'Available course titles': 'Доступные курсы',
    'Courses are being mapped': 'Курсы добавляются',
    'TCSAVANT.COM SOURCE': 'ИСТОЧНИК TCSAVANT.COM',
    'PROTOTYPE COURSE': 'КУРС-ПЛЕЙСХОЛДЕР',
    'Course details, delivery options and provider availability will be mapped into the future marketplace.': 'Описание, форматы обучения и доступность у учебных центров будут добавлены в будущий маркетплейс.',
    'Course direction': 'Направление курса',
    'Source language': 'Язык источника',
    'Direction pending': 'Направление уточняется',
    'Source details ↗': 'Подробнее в источнике ↗',
    'Request guidance': 'Получить консультацию',
    'No matched courses yet.': 'Подходящих курсов пока нет.',
    'This direction remains visible because it is part of the source catalogue structure. Titles will appear when the source data is updated.': 'Направление остаётся видимым как часть структуры исходного каталога. Курсы появятся после обновления данных источника.',
    'Prototype enquiry complete': 'Запрос в прототипе завершён',
    'Start another enquiry': 'Создать новый запрос',
    'English course catalogue loaded.': 'Загружен каталог курсов на английском.',
    'Russian course catalogue loaded.': 'Загружен каталог курсов на русском.',
    'Ukrainian course catalogue loaded.': 'Загружен каталог курсов на украинском.',
    'Professional training for deck officers and navigation watch personnel.': 'Профессиональная подготовка судоводителей и персонала навигационной вахты.',
    'Professional training for engineering officers and engine-room watch personnel.': 'Профессиональная подготовка механиков и персонала машинной вахты.',
    'Core safety and professional training for vessel ratings.': 'Базовая подготовка по безопасности и профессиональное обучение рядового состава.',
    'Specialised preparation for tanker, gas carrier, polar and dangerous-goods operations.': 'Специализированная подготовка для танкеров, газовозов, полярных вод и опасных грузов.',
    'Safety, service and crisis-management training for passenger ship personnel.': 'Подготовка персонала пассажирских судов по безопасности, сервису и кризисному управлению.',
    'Long-form vocational preparation for maritime technical and service roles.': 'Профессионально-техническая подготовка для морских технических и сервисных специальностей.',
    'Short specialist courses for competence maintenance and professional development.': 'Краткосрочные специализированные курсы для повышения компетентности и профессионального развития.',
    'Explore the complete prototype course catalogue sourced from tcsavant.com.': 'Ознакомьтесь с полным прототипом каталога курсов на основе данных tcsavant.com.'
  },
  uk: {
    'European Maritime Training Platform': 'Європейська платформа морського навчання',
    'Skip to content': 'Перейти до вмісту',
    'Maritime Training Platform': 'Платформа морського навчання',
    'Courses': 'Курси',
    'Training Providers': 'Навчальні центри',
    'For Companies': 'Для компаній',
    'About': 'Про платформу',
    'Contact': 'Зв’язатися',
    'Menu': 'Меню',
    'EUROPE · MARITIME TRAINING PLATFORM': 'ЄВРОПА · ПЛАТФОРМА МОРСЬКОГО НАВЧАННЯ',
    'Maritime Training.': 'Морське навчання.',
    'Connected.': 'Об’єднане.',
    'A future platform connecting seafarers, maritime training providers and shipping companies across international markets.': 'Майбутня платформа, що об’єднує моряків, навчальні центри та судноплавні компанії на міжнародних ринках.',
    'Explore Training': 'Знайти навчання',
    'Become a Training Partner': 'Стати навчальним партнером',
    'IMAGE PLACEHOLDER': 'МІСЦЕ ДЛЯ ЗОБРАЖЕННЯ',
    'European maritime training network': 'Європейська мережа морського навчання',
    'WHO THE PLATFORM WILL SERVE': 'ДЛЯ КОГО СТВОРЮЄТЬСЯ ПЛАТФОРМА',
    'One Maritime Training Platform': 'Єдина платформа морського навчання',
    'Choose a path to explore the planned training journey.': 'Оберіть напрям і познайомтеся з майбутнім процесом навчання.',
    'For Seafarers': 'Для моряків',
    'Find professional maritime training, compare providers and plan your certification path.': 'Знаходьте професійне морське навчання, порівнюйте навчальні центри та плануйте сертифікацію.',
    'Find Training →': 'Знайти навчання →',
    'For Training Providers': 'Для навчальних центрів',
    'Prepare to publish courses, manage learners and reach maritime professionals in new international markets.': 'Публікуйте курси, керуйте навчанням і виходьте на нові міжнародні ринки.',
    'Join Platform →': 'Приєднатися →',
    'For Shipping Companies': 'Для судноплавних компаній',
    'Plan crew training, monitor completion and maintain visibility over certification.': 'Плануйте навчання екіпажів, відстежуйте проходження та контролюйте сертифікацію.',
    'Learn More →': 'Докладніше →',
    'A CLEAR TRAINING JOURNEY': 'ЗРОЗУМІЛИЙ ШЛЯХ НАВЧАННЯ',
    'How it works': 'Як це працює',
    'Find': 'Знайти',
    'Enroll': 'Записатися',
    'Learn': 'Навчатися',
    'Assess': 'Пройти оцінювання',
    'Certify': 'Отримати сертифікат',
    'PLANNED COURSE CATALOGUE': 'МАЙБУТНІЙ КАТАЛОГ КУРСІВ',
    'Explore Training Directions': 'Напрями навчання',
    'View All Training →': 'Усі курси →',
    'Connecting to the tcsavant.com course catalogue…': 'Підключаємося до каталогу курсів tcsavant.com…',
    'EDUCATIONAL SERVICE PROVIDERS': 'ПОСТАЧАЛЬНИКИ ОСВІТНІХ ПОСЛУГ',
    'Discover Training Providers': 'Навчальні центри',
    'Explore the types of maritime academies and specialist training centres planned for the future platform.': 'Познайомтеся з типами морських академій і спеціалізованих навчальних центрів майбутньої платформи.',
    'Join as a Provider →': 'Стати навчальним центром →',
    'PROVIDER PROFILE': 'ПРОФІЛЬ НАВЧАЛЬНОГО ЦЕНТРУ',
    'PLACEHOLDER': 'ПЛЕЙСХОЛДЕР',
    'ACADEMY · MULTI-DISCIPLINE': 'АКАДЕМІЯ · РІЗНІ НАПРЯМИ',
    'Maritime Academy': 'Морська академія',
    'Safety, navigation and professional development programmes for seafarers.': 'Програми з безпеки, навігації та професійного розвитку моряків.',
    'Europe / International': 'Європа / Міжнародний ринок',
    'Profile concept': 'Концепт профілю',
    'View Provider Concept →': 'Переглянути концепт →',
    'TECHNICAL · ENGINEERING': 'ТЕХНІЧНИЙ · ІНЖЕНЕРНИЙ',
    'Technical Training Centre': 'Технічний навчальний центр',
    'Engineering, machinery and operational training for maritime professionals.': 'Інженерна, технічна та експлуатаційна підготовка морських фахівців.',
    'SAFETY · STCW-ORIENTED': 'БЕЗПЕКА · ОРІЄНТАЦІЯ НА ПДНВ',
    'Safety Training Institute': 'Інститут підготовки з безпеки',
    'Planned access to practical safety, security and emergency response training.': 'Запланований доступ до практичного навчання з безпеки та дій у надзвичайних ситуаціях.',
    'Europe to international maritime markets': 'З Європи на міжнародні морські ринки',
    'EUROPE · CROSS-BORDER · INTERNATIONAL': 'ЄВРОПА · БЕЗ КОРДОНІВ · МІЖНАРОДНИЙ РИНОК',
    'European Expertise. Global Connections.': 'Європейська експертиза. Глобальні зв’язки.',
    'The concept starts in Europe and is being shaped to connect maritime professionals, training providers and shipping companies across global maritime markets.': 'Концепція створюється в Європі, щоб об’єднати морських фахівців, навчальні центри та судноплавні компанії в усьому світі.',
    'Europe': 'Європа',
    'Platform origin': 'Походження платформи',
    'Cross-border': 'Без кордонів',
    'Market connection': 'Зв’язок ринків',
    'International': 'Міжнародний',
    'Future network': 'Майбутня мережа',
    'FOR TRAINING PROVIDERS': 'ДЛЯ НАВЧАЛЬНИХ ЦЕНТРІВ',
    'Bring Your Maritime Training Online': 'Перенесіть морське навчання онлайн',
    'Connect your centre to a wider market while keeping control of your courses and learners.': 'Виходьте на ширший ринок, зберігаючи контроль над курсами та слухачами.',
    'Become a Training Partner →': 'Стати навчальним партнером →',
    'Currently speaking with selected maritime training providers in Europe and international markets.': 'Зараз ми спілкуємося з обраними постачальниками морського навчання в Європі та на міжнародних ринках.',
    'Publish courses': 'Публікувати курси',
    'Manage students': 'Керувати слухачами',
    'Deliver learning materials': 'Надавати навчальні матеріали',
    'Track progress': 'Відстежувати прогрес',
    'Conduct assessments': 'Проводити оцінювання',
    'Issue certificates': 'Видавати сертифікати',
    'FOR SHIPPING COMPANIES': 'ДЛЯ СУДНОПЛАВНИХ КОМПАНІЙ',
    'Manage Crew Training in One Place': 'Керуйте навчанням екіпажу в одному місці',
    'Source suitable courses, coordinate group enrolments and maintain a clearer view of crew training status.': 'Добирайте курси, координуйте груповий запис і контролюйте стан навчання екіпажу.',
    'Discuss Corporate Training →': 'Обговорити корпоративне навчання →',
    'Corporate training tools are being developed with future industry partners.': 'Інструменти корпоративного навчання розробляються разом із майбутніми галузевими партнерами.',
    'Find Training': 'Знайти навчання',
    'Enroll Crew': 'Записати екіпаж',
    'Track Training': 'Відстежувати навчання',
    'Manage Certificates': 'Керувати сертифікатами',
    'PLATFORM ECOSYSTEM': 'ЕКОСИСТЕМА ПЛАТФОРМИ',
    'More Than a Course Marketplace': 'Більше, ніж каталог курсів',
    'One planned digital environment connecting training, learning, assessment and certification.': 'Єдине цифрове середовище, що об’єднує курси, навчання, оцінювання та сертифікацію.',
    'Seafarers': 'Моряки',
    'Crew Managers': 'Крю-менеджери',
    'Shipping Companies': 'Судноплавні компанії',
    'Enrollment': 'Запис',
    'Learning': 'Навчання',
    'Assessment': 'Оцінювання',
    'Certification': 'Сертифікація',
    'PLATFORM PRINCIPLES': 'ПРИНЦИПИ ПЛАТФОРМИ',
    'Designed for Professional Maritime Training': 'Створено для професійного морського навчання',
    'STCW-oriented Structure': 'Структура, орієнтована на ПДНВ',
    'Provider Verification': 'Перевірка навчальних центрів',
    'Secure Training Records': 'Захищені дані про навчання',
    'Digital Certification': 'Цифрова сертифікація',
    'Multi-language Experience': 'Багатомовний інтерфейс',
    'START A CONVERSATION': 'ПОЧАТИ ДІАЛОГ',
    'Find the right next step.': 'Оберіть наступний крок.',
    'Tell us whether you need training, provide courses or manage crew development.': 'Розкажіть, чи шукаєте ви навчання, пропонуєте курси або керуєте розвитком екіпажу.',
    'I Need Training': 'Мені потрібне навчання',
    'I Provide Training': 'Я проводжу навчання',
    'I Manage Crews': 'Я керую екіпажами',
    'Contact Us →': 'Зв’язатися з нами →',
    'I am a...': 'Я представляю...',
    'Seafarer': 'Моряк',
    'Training Provider': 'Навчальний центр',
    'Shipping Company': 'Судноплавна компанія',
    'Home': 'Головна',
    'Training Directions': 'Напрями навчання',
    'All Training': 'Усі курси',
    'COURSE CATALOGUE · INTERNAL PAGE PROTOTYPE': 'КАТАЛОГ КУРСІВ · ПРОТОТИП ВНУТРІШНЬОЇ СТОРІНКИ',
    'Live course titles are loaded from tcsavant.com. Marketplace details remain placeholders.': 'Назви курсів завантажуються з tcsavant.com. Інші дані маркетплейсу поки є плейсхолдерами.',
    'COURSES FOUND': 'ЗНАЙДЕНО КУРСІВ',
    'Connecting to source…': 'Підключаємося до джерела…',
    'FILTER BY DIRECTION': 'ФІЛЬТР ЗА НАПРЯМОМ',
    'Back to landing': 'Повернутися на лендинг',
    'SELECTED DIRECTION': 'ОБРАНИЙ НАПРЯМ',
    'PROTOTYPE DATA VIEW': 'ПРОТОТИП КАТАЛОГУ',
    'Show More Courses →': 'Показати ще →',
    'European origin · Cross-border access · International maritime market': 'Європейське походження · Доступ без кордонів · Міжнародний морський ринок',
    'Providers': 'Навчальні центри',
    'CLICKABLE LOW-FIDELITY PROTOTYPE': 'КЛІКАБЕЛЬНИЙ НИЗЬКОДЕТАЛІЗОВАНИЙ ПРОТОТИП',
    'Design Guide': 'Дизайн-гайд',
    'PROVIDER PROFILE · CONCEPT PREVIEW': 'ПРОФІЛЬ НАВЧАЛЬНОГО ЦЕНТРУ · КОНЦЕПТ',
    'Close': 'Закрити',
    'Full Name': 'Ім’я та прізвище',
    'Email': 'Email',
    'Phone / WhatsApp': 'Телефон / WhatsApp',
    'Country / Region': 'Країна / Регіон',
    'Current Rank / Role': 'Поточна посада / Роль',
    'Course Interest': 'Курс, що цікавить',
    'Preferred Training Location': 'Бажане місце навчання',
    'Message': 'Повідомлення',
    'Contact Name': 'Контактна особа',
    'Training Centre Name': 'Назва навчального центру',
    'Website': 'Сайт',
    'Approximate Number of Courses': 'Приблизна кількість курсів',
    'Company': 'Компанія',
    'Approximate Crew Size': 'Приблизна чисельність екіпажу',
    'Training Requirements': 'Вимоги до навчання',
    'Select a course direction': 'Оберіть напрям курсу',
    'Seafarer enquiry': 'Запит моряка',
    'Find suitable training': 'Дібрати відповідне навчання',
    'Training provider enquiry': 'Запит навчального центру',
    'Discuss joining the platform': 'Обговорити приєднання до платформи',
    'Shipping company enquiry': 'Запит судноплавної компанії',
    'Discuss crew training': 'Обговорити навчання екіпажу',
    'Request Training Guidance →': 'Отримати консультацію щодо навчання →',
    'Become a Training Partner →': 'Стати навчальним партнером →',
    'Discuss Provider Partnership →': 'Обговорити партнерство →',
    'This placeholder demonstrates how a future provider profile may present specialisms, delivery formats and planned courses. No provider partnership or course availability is implied.': 'Цей плейсхолдер показує майбутній профіль навчального центру: спеціалізації, формати та заплановані курси. Він не підтверджує партнерство чи доступність курсів.',
    'I agree to be contacted about this enquiry.': 'Я погоджуюся на зв’язок щодо цього запиту.',
    '(Prototype only — no data is stored.)': '(Лише прототип — дані не зберігаються.)',
    'Live catalogue source': 'Живе джерело каталогу',
    'Catalogue source unavailable · prototype placeholders shown': 'Джерело каталогу недоступне · показано плейсхолдери',
    'Loading course titles from tcsavant.com…': 'Завантажуємо курси з tcsavant.com…',
    'LIVE SOURCE': 'ЖИВЕ ДЖЕРЕЛО',
    'PLACEHOLDER DATA': 'ДАНІ-ПЛЕЙСХОЛДЕРИ',
    'Available course titles': 'Доступні курси',
    'Courses are being mapped': 'Курси додаються',
    'TCSAVANT.COM SOURCE': 'ДЖЕРЕЛО TCSAVANT.COM',
    'PROTOTYPE COURSE': 'КУРС-ПЛЕЙСХОЛДЕР',
    'Course details, delivery options and provider availability will be mapped into the future marketplace.': 'Опис, формати навчання та доступність у навчальних центрів буде додано до майбутнього маркетплейсу.',
    'Course direction': 'Напрям курсу',
    'Source language': 'Мова джерела',
    'Direction pending': 'Напрям уточнюється',
    'Source details ↗': 'Докладніше в джерелі ↗',
    'Request guidance': 'Отримати консультацію',
    'No matched courses yet.': 'Відповідних курсів поки немає.',
    'This direction remains visible because it is part of the source catalogue structure. Titles will appear when the source data is updated.': 'Напрям залишається видимим як частина структури вихідного каталогу. Курси з’являться після оновлення даних джерела.',
    'Prototype enquiry complete': 'Запит у прототипі завершено',
    'Start another enquiry': 'Створити новий запит',
    'English course catalogue loaded.': 'Завантажено каталог курсів англійською.',
    'Russian course catalogue loaded.': 'Завантажено каталог курсів російською.',
    'Ukrainian course catalogue loaded.': 'Завантажено каталог курсів українською.',
    'Professional training for deck officers and navigation watch personnel.': 'Професійна підготовка судноводіїв і персоналу навігаційної вахти.',
    'Professional training for engineering officers and engine-room watch personnel.': 'Професійна підготовка механіків і персоналу машинної вахти.',
    'Core safety and professional training for vessel ratings.': 'Базова підготовка з безпеки та професійне навчання рядового складу.',
    'Specialised preparation for tanker, gas carrier, polar and dangerous-goods operations.': 'Спеціалізована підготовка для танкерів, газовозів, полярних вод і небезпечних вантажів.',
    'Safety, service and crisis-management training for passenger ship personnel.': 'Підготовка персоналу пасажирських суден з безпеки, сервісу та кризового управління.',
    'Long-form vocational preparation for maritime technical and service roles.': 'Професійно-технічна підготовка для морських технічних і сервісних спеціальностей.',
    'Short specialist courses for competence maintenance and professional development.': 'Короткострокові спеціалізовані курси для підвищення компетентності та професійного розвитку.',
    'Explore the complete prototype course catalogue sourced from tcsavant.com.': 'Ознайомтеся з повним прототипом каталогу курсів на основі даних tcsavant.com.'
  }
};

function readStoredLanguage() {
  let saved = '';
  try {
    saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) || '';
  } catch (error) {
    saved = '';
  }
  if (!Object.hasOwn(languageNames, saved)) {
    const cookie = document.cookie.split('; ').find(item => item.startsWith(`${LANGUAGE_STORAGE_KEY}=`));
    saved = cookie ? decodeURIComponent(cookie.split('=').slice(1).join('=')) : '';
  }
  return Object.hasOwn(languageNames, saved) ? saved : 'en';
}

function storeLanguage(language) {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch (error) {
    // Cookies keep the preference working when storage is restricted.
  }
  document.cookie = `${LANGUAGE_STORAGE_KEY}=${encodeURIComponent(language)}; path=/; max-age=31536000; SameSite=Lax`;
}

const fallbackCourses = [
  ['officers_navigation', 'Bridge Resource Management'],
  ['officers_engineers', 'Engine Room Watchkeeping'],
  ['ratings', 'Basic Safety Training'],
  ['ship_types', 'Specialised Tanker Operations'],
  ['passenger', 'Passenger Ship Crew Training'],
  ['professional_technical', 'Maritime Technical Education'],
  ['competence_upgrade', 'Professional Competence Development']
].map((course, index) => ({
  id: `placeholder-${index}`,
  slug: `placeholder-${index}`,
  directions: [course[0]],
  title: course[1],
  link: 'https://tcsavant.com/en/page-courses/',
  placeholder: true
}));

const page = {
  menuButton: document.querySelector('.menu-button'),
  navigation: document.querySelector('.desktop-nav'),
  leadForm: document.querySelector('#lead-form'),
  dynamicFields: document.querySelector('#dynamic-fields'),
  formKicker: document.querySelector('#form-kicker'),
  formTitle: document.querySelector('#form-title'),
  formSubmit: document.querySelector('#form-submit'),
  categoryGrid: document.querySelector('#category-grid'),
  sourceStatus: document.querySelector('#source-status'),
  cataloguePage: document.querySelector('#catalogue-page'),
  catalogueTitle: document.querySelector('#catalogue-title'),
  catalogueDescription: document.querySelector('#catalogue-description'),
  catalogueCount: document.querySelector('#catalogue-count'),
  catalogueSourceLabel: document.querySelector('#catalogue-source-label'),
  catalogueBreadcrumbCurrent: document.querySelector('#catalogue-breadcrumb-current'),
  catalogueCategoryNav: document.querySelector('#catalogue-category-nav'),
  catalogueResultsKicker: document.querySelector('#catalogue-results-kicker'),
  catalogueResultsTitle: document.querySelector('#catalogue-results-title'),
  courseResultsGrid: document.querySelector('#course-results-grid'),
  catalogueMore: document.querySelector('#catalogue-more'),
  courseDialog: document.querySelector('#course-dialog'),
  dialogKicker: document.querySelector('#dialog-kicker'),
  dialogTitle: document.querySelector('#dialog-title'),
  dialogBody: document.querySelector('#dialog-body'),
  dialogEnquiry: document.querySelector('#dialog-enquiry'),
  dialogAudience: 'seafarer',
  dialogProvider: '',
  toast: document.querySelector('.toast')
};

const state = {
  currentLanguage: readStoredLanguage(),
  currentCategory: 'all',
  visibleCount: PAGE_SIZE,
  courses: [],
  sourceMode: 'loading',
  cache: new Map()
};

const originalTextNodes = new WeakMap();
const originalAttributes = new WeakMap();

function t(value, language = state.currentLanguage) {
  return translations[language] && translations[language][value]
    ? translations[language][value]
    : value;
}

function languageName(language = state.currentLanguage) {
  const names = {
    en: { en: 'English', ru: 'Английский', uk: 'Англійська' },
    ru: { en: 'Russian', ru: 'Русский', uk: 'Російська' },
    uk: { en: 'Ukrainian', ru: 'Украинский', uk: 'Українська' }
  };
  return names[language][state.currentLanguage];
}

function formatCourseCount(count) {
  if (state.currentLanguage === 'ru') {
    const lastTwo = count % 100;
    const last = count % 10;
    const word = lastTwo >= 11 && lastTwo <= 14 ? 'курсов' : last === 1 ? 'курс' : last >= 2 && last <= 4 ? 'курса' : 'курсов';
    return `${count} ${word}`;
  }
  if (state.currentLanguage === 'uk') {
    const lastTwo = count % 100;
    const last = count % 10;
    const word = lastTwo >= 11 && lastTwo <= 14 ? 'курсів' : last === 1 ? 'курс' : last >= 2 && last <= 4 ? 'курси' : 'курсів';
    return `${count} ${word}`;
  }
  return `${count} course${count === 1 ? '' : 's'}`;
}

function translateAttribute(element, attribute) {
  let attributes = originalAttributes.get(element);
  if (!attributes) {
    attributes = new Map();
    originalAttributes.set(element, attributes);
  }
  if (!attributes.has(attribute)) attributes.set(attribute, element.getAttribute(attribute));
  const source = attributes.get(attribute);
  if (source) element.setAttribute(attribute, t(source));
}

function translateStaticPage() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      const parent = node.parentElement;
      return parent && !parent.closest('script, style') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node => {
    if (!originalTextNodes.has(node)) originalTextNodes.set(node, node.nodeValue.trim());
    const source = originalTextNodes.get(node);
    const leading = node.nodeValue.match(/^\s*/)[0];
    const trailing = node.nodeValue.match(/\s*$/)[0];
    node.nodeValue = `${leading}${t(source)}${trailing}`;
  });
  document.querySelectorAll('[aria-label]').forEach(element => translateAttribute(element, 'aria-label'));
  document.title = t(DEFAULT_TITLE);
  const description = document.querySelector('meta[name="description"]');
  if (description) {
    const descriptions = {
      en: 'Clickable concept prototype for a European maritime training platform connecting international learners, providers and shipping companies.',
      ru: 'Кликабельный прототип европейской платформы морского обучения для моряков, учебных центров и судоходных компаний.',
      uk: 'Клікабельний прототип європейської платформи морського навчання для моряків, навчальних центрів і судноплавних компаній.'
    };
    description.content = descriptions[state.currentLanguage];
  }
}

Object.assign(translations.ru, {
  'Go to home page': 'Перейти на главную страницу',
  'Main navigation': 'Основная навигация',
  'Language selector': 'Выбор языка',
  'Image placeholder': 'Место для изображения',
  'Process steps': 'Этапы процесса',
  'Platform ecosystem relationships': 'Связи экосистемы платформы',
  'Platform journey': 'Путь на платформе',
  'Contact options': 'Варианты обращения',
  'Breadcrumb': 'Хлебные крошки',
  'Course directions': 'Направления курсов',
  'Close course preview': 'Закрыть окно',
  'This catalogue is part of the future platform concept. Course availability, providers and certification conditions will be confirmed before launch.': 'Этот каталог является частью концепции будущей платформы. Доступность курсов, учебные центры и условия сертификации будут подтверждены перед запуском.',
  'e.g. Alex Martin': 'например, Алекс Мартин',
  'e.g. Poland': 'например, Польша',
  'e.g. Third Officer': 'например, третий помощник капитана',
  'Country, city or online': 'Страна, город или онлайн',
  'Tell us which certificate or role you are working toward.': 'Расскажите, какой сертификат или должность вас интересует.',
  'Your full name': 'Ваше имя и фамилия',
  'Centre name': 'Название центра',
  'Country or region': 'Страна или регион',
  'e.g. 12': 'например, 12',
  'Tell us about your centre and training portfolio.': 'Расскажите о вашем центре и учебных программах.',
  'Company name': 'Название компании',
  'e.g. 150': 'например, 150',
  'Course areas or certification needs': 'Направления курсов или требования к сертификации',
  'Tell us about your crew training priorities.': 'Расскажите о приоритетах обучения вашего экипажа.',
  'Your enquiry has been demonstrated successfully. No information has been sent or stored.': 'Работа запроса успешно продемонстрирована. Данные не были отправлены или сохранены.',
  'EDUCATIONAL PROVIDER · PROFILE CONCEPT': 'ПОСТАВЩИК ОБРАЗОВАТЕЛЬНЫХ УСЛУГ · КОНЦЕПТ ПРОФИЛЯ',
  'Bridge Resource Management': 'Управление ресурсами мостика',
  'Engine Room Watchkeeping': 'Несение вахты в машинном отделении',
  'Basic Safety Training': 'Базовая подготовка по безопасности',
  'Specialised Tanker Operations': 'Специализированные танкерные операции',
  'Passenger Ship Crew Training': 'Подготовка экипажа пассажирского судна',
  'Maritime Technical Education': 'Морское техническое образование',
  'Professional Competence Development': 'Повышение профессиональной компетентности'
});

Object.assign(translations.uk, {
  'Go to home page': 'Перейти на головну сторінку',
  'Main navigation': 'Основна навігація',
  'Language selector': 'Вибір мови',
  'Image placeholder': 'Місце для зображення',
  'Process steps': 'Етапи процесу',
  'Platform ecosystem relationships': 'Зв’язки екосистеми платформи',
  'Platform journey': 'Шлях на платформі',
  'Contact options': 'Варіанти звернення',
  'Breadcrumb': 'Навігаційний ланцюжок',
  'Course directions': 'Напрями курсів',
  'Close course preview': 'Закрити вікно',
  'This catalogue is part of the future platform concept. Course availability, providers and certification conditions will be confirmed before launch.': 'Цей каталог є частиною концепції майбутньої платформи. Доступність курсів, навчальні центри й умови сертифікації буде підтверджено перед запуском.',
  'e.g. Alex Martin': 'наприклад, Алекс Мартін',
  'e.g. Poland': 'наприклад, Польща',
  'e.g. Third Officer': 'наприклад, третій помічник капітана',
  'Country, city or online': 'Країна, місто або онлайн',
  'Tell us which certificate or role you are working toward.': 'Розкажіть, який сертифікат або посада вас цікавить.',
  'Your full name': 'Ваше ім’я та прізвище',
  'Centre name': 'Назва центру',
  'Country or region': 'Країна або регіон',
  'e.g. 12': 'наприклад, 12',
  'Tell us about your centre and training portfolio.': 'Розкажіть про ваш центр і навчальні програми.',
  'Company name': 'Назва компанії',
  'e.g. 150': 'наприклад, 150',
  'Course areas or certification needs': 'Напрями курсів або вимоги до сертифікації',
  'Tell us about your crew training priorities.': 'Розкажіть про пріоритети навчання вашого екіпажу.',
  'Your enquiry has been demonstrated successfully. No information has been sent or stored.': 'Роботу запиту успішно продемонстровано. Дані не було надіслано або збережено.',
  'EDUCATIONAL PROVIDER · PROFILE CONCEPT': 'ПОСТАЧАЛЬНИК ОСВІТНІХ ПОСЛУГ · КОНЦЕПТ ПРОФІЛЮ',
  'Bridge Resource Management': 'Управління ресурсами містка',
  'Engine Room Watchkeeping': 'Несення вахти в машинному відділенні',
  'Basic Safety Training': 'Базова підготовка з безпеки',
  'Specialised Tanker Operations': 'Спеціалізовані танкерні операції',
  'Passenger Ship Crew Training': 'Підготовка екіпажу пасажирського судна',
  'Maritime Technical Education': 'Морська технічна освіта',
  'Professional Competence Development': 'Підвищення професійної компетентності'
});

const formDefinitions = {
  seafarer: {
    kicker: 'Seafarer enquiry',
    title: 'Find suitable training',
    submit: 'Request Training Guidance →',
    fields: [
      ['Full Name', 'text', 'e.g. Alex Martin'],
      ['Email', 'email', 'name@email.com'],
      ['Phone / WhatsApp', 'tel', '+00 ...'],
      ['Country / Region', 'text', 'e.g. Poland'],
      ['Current Rank / Role', 'text', 'e.g. Third Officer'],
      ['Course Interest', 'select', ['Select a course area']],
      ['Preferred Training Location', 'text', 'Country, city or online'],
      ['Message', 'textarea', 'Tell us which certificate or role you are working toward.']
    ]
  },
  provider: {
    kicker: 'Training provider enquiry',
    title: 'Discuss joining the platform',
    submit: 'Become a Training Partner →',
    fields: [
      ['Contact Name', 'text', 'Your full name'],
      ['Training Centre Name', 'text', 'Centre name'],
      ['Email', 'email', 'name@centre.com'],
      ['Phone / WhatsApp', 'tel', '+00 ...'],
      ['Country / Region', 'text', 'Country or region'],
      ['Website', 'url', 'https://'],
      ['Approximate Number of Courses', 'number', 'e.g. 12'],
      ['Message', 'textarea', 'Tell us about your centre and training portfolio.']
    ]
  },
  company: {
    kicker: 'Shipping company enquiry',
    title: 'Discuss crew training',
    submit: 'Discuss Corporate Training →',
    fields: [
      ['Contact Name', 'text', 'Your full name'],
      ['Company', 'text', 'Company name'],
      ['Email', 'email', 'name@company.com'],
      ['Phone / WhatsApp', 'tel', '+00 ...'],
      ['Country / Region', 'text', 'Country or region'],
      ['Approximate Crew Size', 'number', 'e.g. 150'],
      ['Training Requirements', 'text', 'Course areas or certification needs'],
      ['Message', 'textarea', 'Tell us about your crew training priorities.']
    ]
  }
};

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[character]);
}

function decodeHtml(value) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = value || '';
  return textarea.value.trim();
}

function directionBySlug(slug) {
  return directionDefinitions.find(direction => direction.slug === slug);
}

function directionLabel(direction, language = state.currentLanguage) {
  return direction && direction.labels && direction.labels[language]
    ? direction.labels[language]
    : direction.label;
}

function normalizeDirections(value) {
  if (!value) return null;
  const candidates = Array.isArray(value) ? value : [value];
  const normalized = candidates.map(candidate => {
    const raw = typeof candidate === 'object'
      ? candidate.slug || candidate.value || candidate.name || candidate.label
      : candidate;
    if (!raw) return null;
    const slug = String(raw).toLowerCase().replace(/[\s-]+/g, '_');
    return directionBySlug(slug) ? slug : null;
  }).filter(Boolean);
  return normalized.length ? [...new Set(normalized)] : null;
}

function exposedDirections(course) {
  const candidates = [
    course.course_directions,
    course.course_direction,
    course.direction,
    course.acf && (course.acf.course_directions || course.acf.course_direction || course.acf.directions),
    course.meta && (course.meta.course_directions || course.meta.course_direction || course.meta.directions)
  ];
  return candidates.map(normalizeDirections).find(Boolean) || null;
}

function sourceDirections(course) {
  const fromApi = exposedDirections(course);
  if (fromApi) return fromApi;
  return directionDefinitions
    .filter(direction => direction.sourceSlugs.includes(course.slug))
    .map(direction => direction.slug);
}

function sourceFieldsUrl(language) {
  const params = new URLSearchParams({
    per_page: '100',
    lang: language,
    _fields: 'id,slug,link,title,acf,meta,direction,directions,course_direction,course_directions'
  });
  return `${SOURCE_API}?${params}`;
}

async function fetchCourses(language) {
  if (state.cache.has(language)) return state.cache.get(language);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(sourceFieldsUrl(language), { signal: controller.signal });
    if (!response.ok) throw new Error(`Course source returned ${response.status}`);
    const sourceCourses = await response.json();
    if (!Array.isArray(sourceCourses) || !sourceCourses.length) throw new Error('Course source is empty');
    const normalized = sourceCourses.map(course => {
      const title = decodeHtml(course.title && course.title.rendered);
      return {
        id: course.id,
        slug: course.slug,
        title: title || 'Course title pending',
        link: course.link || 'https://tcsavant.com/en/page-courses/',
        directions: sourceDirections(course),
        placeholder: false
      };
    });
    const result = { courses: normalized, sourceMode: 'live' };
    state.cache.set(language, result);
    return result;
  } catch (error) {
    console.warn('The live course source is unavailable; prototype placeholders are being used.', error);
    return { courses: fallbackCourses, sourceMode: 'fallback' };
  } finally {
    clearTimeout(timeout);
  }
}

function directionCount(slug) {
  return state.courses.filter(course => course.directions.includes(slug)).length;
}

function renderSourceStatus() {
  const live = state.sourceMode === 'live';
  page.sourceStatus.classList.toggle('is-live', live);
  page.sourceStatus.classList.toggle('is-fallback', !live);
  page.sourceStatus.innerHTML = `<span class="status-dot"></span><span>${live
    ? `${t('Live catalogue source')} · ${formatCourseCount(state.courses.length)} · tcsavant.com · ${escapeHtml(languageName())}`
    : t('Catalogue source unavailable · prototype placeholders shown')}</span>`;
}

function renderLandingCategories() {
  page.categoryGrid.innerHTML = directionDefinitions.map((direction, index) => {
    const count = directionCount(direction.slug);
    return `
      <button class="category-card" type="button" data-category="${direction.slug}">
        <span class="category-number">${String(index + 1).padStart(2, '0')}</span>
        <strong>${escapeHtml(directionLabel(direction))}</strong>
        <small>${formatCourseCount(count)}</small>
        <span class="card-arrow" aria-hidden="true">↗</span>
      </button>`;
  }).join('');
  page.categoryGrid.setAttribute('aria-busy', 'false');
  renderSourceStatus();
}

function fieldMarkup([label, type, content], index) {
  const id = `lead-field-${index}`;
  const safeLabel = escapeHtml(label);
  const fullClass = type === 'textarea' ? ' field-full' : '';
  if (type === 'select') {
    const options = content.map((option, optionIndex) =>
      `<option value="${optionIndex ? escapeHtml(option) : ''}" ${optionIndex ? '' : 'disabled selected'}>${escapeHtml(option)}</option>`
    ).join('');
    return `<label class="field${fullClass}" for="${id}"><span>${safeLabel}</span><select id="${id}" name="${safeLabel}" required>${options}</select></label>`;
  }
  if (type === 'textarea') {
    return `<label class="field${fullClass}" for="${id}"><span>${safeLabel}</span><textarea id="${id}" name="${safeLabel}" rows="4" placeholder="${escapeHtml(content)}" required></textarea></label>`;
  }
  return `<label class="field${fullClass}" for="${id}"><span>${safeLabel}</span><input id="${id}" name="${safeLabel}" type="${type}" placeholder="${escapeHtml(content)}" required></label>`;
}

function renderForm(audience = 'seafarer', preserveValues = false) {
  const savedValues = preserveValues
    ? [...page.dynamicFields.querySelectorAll('input, select, textarea')].map(control => ({ value: control.value, selectedIndex: control.selectedIndex }))
    : [];
  const definition = formDefinitions[audience];
  const fields = definition.fields.map(field => {
    if (audience === 'seafarer' && field[0] === 'Course Interest') {
      return [t(field[0]), field[1], [t('Select a course direction'), ...directionDefinitions.map(direction => directionLabel(direction))]];
    }
    return [t(field[0]), field[1], Array.isArray(field[2]) ? field[2].map(option => t(option)) : t(field[2])];
  });
  page.formKicker.textContent = t(definition.kicker);
  page.formTitle.textContent = t(definition.title);
  page.formSubmit.textContent = t(definition.submit);
  const indexedFields = fields.map((field, index) => ({ field, index }));
  const regularFields = indexedFields.filter(item => item.field[1] !== 'textarea');
  const fullFields = indexedFields.filter(item => item.field[1] === 'textarea');
  page.dynamicFields.innerHTML = `<div class="form-grid">${regularFields.map(item => fieldMarkup(item.field, item.index)).join('')}</div>${fullFields.map(item => fieldMarkup(item.field, item.index)).join('')}`;
  if (preserveValues) {
    [...page.dynamicFields.querySelectorAll('input, select, textarea')].forEach((control, index) => {
      const saved = savedValues[index];
      if (!saved) return;
      if (control instanceof HTMLSelectElement) control.selectedIndex = saved.selectedIndex;
      else control.value = saved.value;
    });
  }
  document.querySelectorAll('[data-form-audience]').forEach(button => {
    const active = button.dataset.formAudience === audience;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  page.leadForm.dataset.formState = audience;
}

function filteredCourses() {
  return state.currentCategory === 'all'
    ? state.courses
    : state.courses.filter(course => course.directions.includes(state.currentCategory));
}

function catalogueDefinition() {
  return state.currentCategory === 'all'
    ? { label: t('All Training'), description: t('Explore the complete prototype course catalogue sourced from tcsavant.com.') }
    : {
        ...directionBySlug(state.currentCategory),
        label: directionLabel(directionBySlug(state.currentCategory)),
        description: t(directionBySlug(state.currentCategory).description)
      };
}

function renderCatalogue() {
  const definition = catalogueDefinition();
  const results = filteredCourses();
  const visible = results.slice(0, state.visibleCount);
  const liveLabel = state.sourceMode === 'live' ? t('LIVE SOURCE') : t('PLACEHOLDER DATA');
  page.catalogueTitle.textContent = definition.label;
  page.catalogueDescription.textContent = definition.description;
  page.catalogueCount.textContent = formatCourseCount(results.length);
  if (page.catalogueSourceLabel) page.catalogueSourceLabel.textContent = `${liveLabel} · ${languageName()} · TCSAVANT.COM`;
  page.catalogueBreadcrumbCurrent.textContent = definition.label;
  page.catalogueResultsKicker.textContent = `${definition.label.toUpperCase()} · ${languageName().toUpperCase()}`;
  page.catalogueResultsTitle.textContent = results.length ? t('Available course titles') : t('Courses are being mapped');
  page.catalogueCategoryNav.innerHTML = `
    <button type="button" data-catalogue-category="all" class="catalogue-category-button ${state.currentCategory === 'all' ? 'active' : ''}"><span>${t('All Training')}</span><small>${state.courses.length}</small></button>
    ${directionDefinitions.map(direction => `
      <button type="button" data-catalogue-category="${direction.slug}" class="catalogue-category-button ${state.currentCategory === direction.slug ? 'active' : ''}">
        <span>${escapeHtml(directionLabel(direction))}</span><small>${directionCount(direction.slug)}</small>
      </button>`).join('')}`;
  page.courseResultsGrid.innerHTML = visible.length ? visible.map((course, index) => {
    const selectedDirection = state.currentCategory === 'all' ? course.directions[0] : state.currentCategory;
    const direction = directionBySlug(selectedDirection);
    return `<article class="catalogue-course-card">
      <div class="course-card-topline"><span>${course.placeholder ? t('PROTOTYPE COURSE') : t('TCSAVANT.COM SOURCE')}</span><span>${String(index + 1).padStart(2, '0')}</span></div>
      <h3>${escapeHtml(course.placeholder ? t(course.title) : course.title)}</h3>
      <p>${t('Course details, delivery options and provider availability will be mapped into the future marketplace.')}</p>
      <div class="catalogue-course-meta"><span>${t('Course direction')}<strong>${escapeHtml(direction ? directionLabel(direction) : t('Direction pending'))}</strong></span><span>${t('Source language')}<strong>${escapeHtml(languageName())}</strong></span></div>
      <div class="catalogue-course-actions">
        <a href="${escapeHtml(course.link)}" target="_blank" rel="noopener">${t('Source details ↗')}</a>
        <button type="button" data-course-enquire="${escapeHtml(course.title)}" data-course-direction="${selectedDirection || ''}">${t('Request guidance')}</button>
      </div>
    </article>`;
  }).join('') : `<div class="catalogue-empty"><strong>${t('No matched courses yet.')}</strong><p>${t('This direction remains visible because it is part of the source catalogue structure. Titles will appear when the source data is updated.')}</p></div>`;
  page.catalogueMore.hidden = state.visibleCount >= results.length;
  page.catalogueMore.textContent = `${t('Show More Courses →').replace('→', '').trim()} (${Math.max(0, results.length - state.visibleCount)})`;
  document.title = `${definition.label} — ${t('Maritime Training Platform')}`;
}

function routeForCategory(slug) {
  return `#courses/${encodeURIComponent(slug)}`;
}

function openCatalogue(slug = 'all', updateHistory = true) {
  state.currentCategory = slug === 'all' || directionBySlug(slug) ? slug : 'all';
  state.visibleCount = PAGE_SIZE;
  page.cataloguePage.hidden = false;
  document.body.classList.add('catalogue-open');
  renderCatalogue();
  if (updateHistory) history.pushState({ view: 'catalogue', category: state.currentCategory }, '', routeForCategory(state.currentCategory));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeCatalogue(updateHistory = true, targetHash = 'courses') {
  window.location.href = `index.html#${targetHash}`;
}

function scrollToSection(id) {
  if (document.body.classList.contains('courses-page')) {
    const landingSection = id === 'education-providers' ? 'providers' : id;
    window.location.href = id === 'courses' ? routeForCategory('all') : `index.html#${landingSection}`;
    return;
  }
  if (document.body.classList.contains('catalogue-open')) closeCatalogue(true, id);
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  page.navigation.classList.remove('mobile-open');
  page.menuButton.setAttribute('aria-expanded', 'false');
}

function selectAudience(audience, shouldScroll = true, directionSlug = '') {
  renderForm(audience);
  if (shouldScroll) scrollToSection('contact');
  if (audience === 'seafarer' && directionSlug) {
    const select = page.dynamicFields.querySelector('select');
    const direction = directionBySlug(directionSlug);
    if (select && direction) select.value = directionLabel(direction);
  }
}

let toastTimer;
function showToast(message) {
  page.toast.textContent = message;
  page.toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => page.toast.classList.remove('visible'), 3000);
}

async function setLanguage(language, showConfirmation = true, persist = true) {
  if (!languageNames[language]) return;
  state.currentLanguage = language;
  if (persist) storeLanguage(language);
  document.documentElement.lang = language;
  document.querySelectorAll('[data-language]').forEach(button => {
    const active = button.dataset.language === language;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  if (page.dynamicFields.isConnected) renderForm(page.leadForm.dataset.formState || 'seafarer', true);
  translateStaticPage();
  page.categoryGrid.setAttribute('aria-busy', 'true');
  page.sourceStatus.innerHTML = `<span class="status-dot"></span><span>${t('Loading course titles from tcsavant.com…')}</span>`;
  const result = await fetchCourses(language);
  if (state.currentLanguage !== language) return;
  state.courses = result.courses;
  state.sourceMode = result.sourceMode;
  renderLandingCategories();
  if (document.body.classList.contains('catalogue-open')) renderCatalogue();
  if (page.courseDialog.open && page.dialogProvider) renderProviderDialog(page.dialogProvider);
  if (showConfirmation) {
    const loadedMessage = {
      en: 'English course catalogue loaded.',
      ru: 'Russian course catalogue loaded.',
      uk: 'Ukrainian course catalogue loaded.'
    };
    showToast(t(loadedMessage[language]));
  }
}

function renderProviderDialog(provider) {
  page.dialogKicker.textContent = t('EDUCATIONAL PROVIDER · PROFILE CONCEPT');
  page.dialogTitle.textContent = t(provider);
  page.dialogBody.textContent = t('This placeholder demonstrates how a future provider profile may present specialisms, delivery formats and planned courses. No provider partnership or course availability is implied.');
  page.dialogEnquiry.textContent = t('Discuss Provider Partnership →');
  page.dialogAudience = 'provider';
  page.dialogProvider = provider;
}

function applyLocationRoute() {
  const match = location.hash.match(/^#courses\/([^/?#]+)/);
  const slug = match ? decodeURIComponent(match[1]) : (new URLSearchParams(location.search).get('category') || 'all');
  openCatalogue(slug, false);
}

document.addEventListener('click', event => {
  const scrollControl = event.target.closest('[data-scroll]');
  if (scrollControl) scrollToSection(scrollControl.dataset.scroll);
  const audienceControl = event.target.closest('[data-audience]');
  if (audienceControl) selectAudience(audienceControl.dataset.audience);
  const formAudienceControl = event.target.closest('[data-form-audience]');
  if (formAudienceControl) renderForm(formAudienceControl.dataset.formAudience);
  const categoryControl = event.target.closest('[data-category]');
  if (categoryControl) openCatalogue(categoryControl.dataset.category);
  const catalogueCategory = event.target.closest('[data-catalogue-category]');
  if (catalogueCategory) openCatalogue(catalogueCategory.dataset.catalogueCategory);
  if (event.target.closest('[data-catalogue-home]')) {
    closeCatalogue(true, 'hero');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  if (event.target.closest('[data-catalogue-close]')) scrollToSection('courses');
  if (event.target.closest('[data-catalogue-all]')) openCatalogue('all');
  const courseEnquiry = event.target.closest('[data-course-enquire]');
  if (courseEnquiry) selectAudience('seafarer', true, courseEnquiry.dataset.courseDirection);
  const providerControl = event.target.closest('[data-provider]');
  if (providerControl) {
    renderProviderDialog(providerControl.dataset.provider);
    page.courseDialog.showModal();
  }
  if (event.target.closest('[data-close-dialog]')) page.courseDialog.close();
  if (event.target.closest('[data-dialog-enquiry]')) {
    page.courseDialog.close();
    selectAudience(page.dialogAudience);
  }
  const languageControl = event.target.closest('[data-language]');
  if (languageControl) setLanguage(languageControl.dataset.language);
  if (event.target.closest('#catalogue-more')) {
    state.visibleCount += PAGE_SIZE;
    renderCatalogue();
  }
});

document.querySelectorAll('.audience-card').forEach(card => {
  card.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectAudience(card.dataset.audience);
    }
  });
});

document.querySelectorAll('.provider-directory-card').forEach(card => {
  card.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      card.querySelector('[data-provider]').click();
    }
  });
});

page.menuButton.addEventListener('click', () => {
  const open = !page.navigation.classList.contains('mobile-open');
  page.navigation.classList.toggle('mobile-open', open);
  page.menuButton.setAttribute('aria-expanded', String(open));
});

page.leadForm.addEventListener('submit', event => {
  event.preventDefault();
  page.leadForm.innerHTML = `<div class="success-panel"><div class="success-mark">✓</div><h3>${t('Prototype enquiry complete')}</h3><p>${t('Your enquiry has been demonstrated successfully. No information has been sent or stored.')}</p><button class="button button-light" type="button" data-restart-form>${t('Start another enquiry')}</button></div>`;
  page.leadForm.querySelector('[data-restart-form]').addEventListener('click', () => location.reload());
});

const observedSections = ['courses', 'education-providers', 'companies', 'about']
  .map(id => document.getElementById(id))
  .filter(Boolean);

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    document.querySelectorAll('.desktop-nav [data-scroll]').forEach(button => {
      button.classList.toggle('active', button.dataset.scroll === visible.target.id);
    });
  }, { rootMargin: '-20% 0px -65% 0px', threshold: [0, .2, .5] });
  observedSections.forEach(section => observer.observe(section));
}

window.addEventListener('popstate', applyLocationRoute);
renderForm('seafarer');
setLanguage(state.currentLanguage, false, false).then(applyLocationRoute);
