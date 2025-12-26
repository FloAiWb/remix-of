<?php

if (!defined('ABSPATH')) {
    exit;
}

class GravMix_Shortcodes
{
    public function __construct()
    {
        add_shortcode('gravmix_home', [$this, 'render_home']);
        add_shortcode('gravmix_engrave_designer', [$this, 'render_designer']);
        add_shortcode('gravmix_contacts', [$this, 'render_contacts']);
        add_action('wp_enqueue_scripts', [$this, 'enqueue_assets']);
    }

    public function enqueue_assets(): void
    {
        if (!is_singular()) {
            return;
        }

        global $post;
        if (!$post) {
            return;
        }

        $content = $post->post_content ?? '';
        if (!has_shortcode($content, 'gravmix_home') && !has_shortcode($content, 'gravmix_engrave_designer') && !has_shortcode($content, 'gravmix_contacts')) {
            return;
        }

        wp_enqueue_style('gravmix-style', GRAVMIX_PLUGIN_URL . 'assets/css/gravmix-style.css', [], GRAVMIX_PLUGIN_VERSION);
        wp_enqueue_script('gravmix-home', GRAVMIX_PLUGIN_URL . 'assets/js/gravmix-home.js', [], GRAVMIX_PLUGIN_VERSION, true);
        wp_enqueue_script('gravmix-designer', GRAVMIX_PLUGIN_URL . 'assets/js/gravmix-designer.js', [], GRAVMIX_PLUGIN_VERSION, true);

        $options = get_option(GRAVMIX_OPTION_KEY, []);
        $localize = [
            'restUrl' => esc_url_raw(rest_url('gravmix/v1')),
            'nonce' => wp_create_nonce('wp_rest'),
            'whatsapp' => $options['whatsapp_link'] ?? '',
            'telegram' => $options['telegram_link'] ?? '',
            'phone' => $options['phone'] ?? '',
            'productMap' => [
                'bracelet' => (int)($options['product_bracelet_id'] ?? 0),
                'tag' => (int)($options['product_tag_id'] ?? 0),
                'keychain' => (int)($options['product_keychain_id'] ?? 0),
            ],
            'mockups' => [
                'bracelet' => GRAVMIX_PLUGIN_URL . 'assets/mockups/bracelet.svg',
                'tag' => GRAVMIX_PLUGIN_URL . 'assets/mockups/tag.svg',
                'keychain' => GRAVMIX_PLUGIN_URL . 'assets/mockups/keychain.svg',
            ],
        ];

        wp_localize_script('gravmix-designer', 'gravmixData', $localize);
    }

    public function render_home(): string
    {
        $options = get_option(GRAVMIX_OPTION_KEY, []);
        $whatsapp = esc_url($options['whatsapp_link'] ?? '#');
        $telegram = esc_url($options['telegram_link'] ?? '#');
        $phone = esc_html($options['phone'] ?? '');
        $address = esc_html($options['address'] ?? '');
        $hours = esc_html($options['hours'] ?? '');

        $featured_products = function_exists('do_shortcode') ? do_shortcode('[products limit="4" columns="4" visibility="featured"]') : '';
        $new_products = function_exists('do_shortcode') ? do_shortcode('[products limit="4" columns="4" orderby="date" order="DESC"]') : '';

        ob_start();
        ?>
        <div class="gravmix">
            <div class="gravmix-topbar">
                <div class="gravmix-topbar__left">
                    <span class="gravmix-phone"><?php echo $phone; ?></span>
                </div>
                <div class="gravmix-topbar__right">
                    <a class="gravmix-link" href="<?php echo $whatsapp; ?>" target="_blank" rel="noopener">Написать в WhatsApp</a>
                    <a class="gravmix-link" href="<?php echo $telegram; ?>" target="_blank" rel="noopener">Написать в Telegram</a>
                    <a class="gravmix-link" href="https://www.wildberries.ru" target="_blank" rel="noopener">WB</a>
                    <a class="gravmix-link" href="https://www.ozon.ru" target="_blank" rel="noopener">Ozon</a>
                </div>
            </div>

            <header class="gravmix-hero">
                <div class="gravmix-hero__content">
                    <p class="gravmix-kicker">GravMix Premium</p>
                    <h1>Лазерная гравировка с мгновенным предпросмотром</h1>
                    <p class="gravmix-subtitle">Создайте уникальный дизайн за минуту и сразу увидьте результат на изделии.</p>
                    <div class="gravmix-hero__actions">
                        <a class="gravmix-btn" href="/engrave">Создать свой дизайн</a>
                        <a class="gravmix-btn gravmix-btn--ghost" href="/catalog">Перейти в каталог</a>
                    </div>
                </div>
                <div class="gravmix-hero__visual">
                    <div class="gravmix-metal-card">
                        <span>GravMix</span>
                        <small>Premium engraving</small>
                    </div>
                </div>
            </header>

            <nav class="gravmix-categories">
                <div class="gravmix-categories__item">
                    <h3>Браслеты</h3>
                    <ul>
                        <li>Именные</li>
                        <li>Символика</li>
                        <li>Минимализм</li>
                    </ul>
                </div>
                <div class="gravmix-categories__item">
                    <h3>Жетоны</h3>
                    <ul>
                        <li>Армейские</li>
                        <li>Медальоны</li>
                        <li>Премиум</li>
                    </ul>
                </div>
                <div class="gravmix-categories__item">
                    <h3>Брелоки</h3>
                    <ul>
                        <li>Авто</li>
                        <li>Подарочные</li>
                        <li>Корпоративные</li>
                    </ul>
                </div>
                <div class="gravmix-categories__item">
                    <h3>Подарки</h3>
                    <ul>
                        <li>К юбилею</li>
                        <li>Для пары</li>
                        <li>Особые даты</li>
                    </ul>
                </div>
            </nav>

            <section class="gravmix-section">
                <h2>Наши товары</h2>
                <div class="gravmix-grid">
                    <div class="gravmix-card">Браслеты с гравировкой</div>
                    <div class="gravmix-card">Жетоны и медальоны</div>
                    <div class="gravmix-card">Брелоки и аксессуары</div>
                    <div class="gravmix-card">Подарочные наборы</div>
                </div>
            </section>

            <section class="gravmix-section gravmix-features">
                <div>
                    <h3>Доставка по РФ</h3>
                    <p>Бережно упаковываем и отправляем в день изготовления.</p>
                </div>
                <div>
                    <h3>Индивидуальный подход</h3>
                    <p>Помогаем подобрать стиль, шрифт и компоновку.</p>
                </div>
                <div>
                    <h3>Быстрое изготовление</h3>
                    <p>Лазерная гравировка — готовность от 24 часов.</p>
                </div>
            </section>

            <section class="gravmix-section">
                <div class="gravmix-section__header">
                    <h2>Хиты продаж</h2>
                </div>
                <div class="gravmix-woo">
                    <?php echo $featured_products; ?>
                </div>
            </section>

            <section class="gravmix-section">
                <div class="gravmix-section__header">
                    <h2>Новые поступления</h2>
                </div>
                <div class="gravmix-woo">
                    <?php echo $new_products; ?>
                </div>
            </section>

            <section class="gravmix-section">
                <h2>GravMix — премиальная гравировка</h2>
                <div class="gravmix-accordion">
                    <button class="gravmix-accordion__toggle" type="button">Показать ещё</button>
                    <div class="gravmix-accordion__content">
                        <p>Мы создаём премиальные изделия с точной лазерной гравировкой: от именных браслетов до корпоративных аксессуаров. Вы видите результат заранее, утверждаете макет и получаете готовый продукт уже через 1–2 дня.</p>
                        <p>GravMix сочетает технологию и дизайн: строгие формы, металл и лаконичный стиль. Ваши идеи превращаются в вещь, которая остаётся с вами надолго.</p>
                    </div>
                </div>
            </section>

            <section class="gravmix-section">
                <h2>Доставка и оплата</h2>
                <div class="gravmix-tabs">
                    <button class="gravmix-tab is-active" data-tab="delivery" type="button">Доставка</button>
                    <button class="gravmix-tab" data-tab="payment" type="button">Оплата</button>
                </div>
                <div class="gravmix-tab-content is-active" id="delivery">
                    <p>Курьерская доставка по Москве и отправка в регионы СДЭК/Почта России.</p>
                </div>
                <div class="gravmix-tab-content" id="payment">
                    <p>Оплата картой, СБП или по счёту для организаций.</p>
                </div>
            </section>

            <footer class="gravmix-footer">
                <div>
                    <h4>Контакты</h4>
                    <p><?php echo $phone; ?></p>
                    <p><?php echo $address; ?></p>
                    <p><?php echo $hours; ?></p>
                </div>
                <div>
                    <h4>Соцсети</h4>
                    <a href="<?php echo $whatsapp; ?>" target="_blank" rel="noopener">WhatsApp</a>
                    <a href="<?php echo $telegram; ?>" target="_blank" rel="noopener">Telegram</a>
                </div>
            </footer>
        </div>
        <?php
        return ob_get_clean();
    }

    public function render_designer(): string
    {
        ob_start();
        ?>
        <div class="gravmix gravmix-designer">
            <div class="gravmix-designer__panel">
                <h2>Конструктор гравировки</h2>
                <label>
                    Текст гравировки
                    <input type="text" class="gravmix-input" id="gravmix-text" maxlength="24" placeholder="Введите текст на кириллице">
                </label>
                <label>
                    Шрифт
                    <select id="gravmix-font" class="gravmix-input">
                        <option value="serif">Serif</option>
                        <option value="sans">Sans</option>
                        <option value="mono">Mono</option>
                        <option value="script">Script</option>
                        <option value="display">Display</option>
                    </select>
                </label>
                <label>
                    Изделие
                    <select id="gravmix-product" class="gravmix-input">
                        <option value="bracelet">Браслет</option>
                        <option value="tag">Жетон</option>
                        <option value="keychain">Брелок</option>
                    </select>
                </label>
                <div class="gravmix-actions">
                    <button class="gravmix-btn" id="gravmix-download" type="button">Скачать превью</button>
                    <button class="gravmix-btn gravmix-btn--ghost" id="gravmix-send" type="button">Отправить в Telegram</button>
                    <button class="gravmix-btn gravmix-btn--accent" id="gravmix-add" type="button">Добавить в корзину</button>
                </div>
                <div class="gravmix-status" id="gravmix-status"></div>
            </div>
            <div class="gravmix-designer__preview">
                <canvas id="gravmix-canvas" width="900" height="540"></canvas>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }

    public function render_contacts(): string
    {
        $options = get_option(GRAVMIX_OPTION_KEY, []);
        $whatsapp = esc_url($options['whatsapp_link'] ?? '#');
        $telegram = esc_url($options['telegram_link'] ?? '#');
        $phone = esc_html($options['phone'] ?? '');

        ob_start();
        ?>
        <div class="gravmix">
            <section class="gravmix-section">
                <h2>Связаться с нами</h2>
                <p>Телефон: <?php echo $phone; ?></p>
                <div class="gravmix-actions">
                    <a class="gravmix-btn" href="<?php echo $whatsapp; ?>" target="_blank" rel="noopener">WhatsApp</a>
                    <a class="gravmix-btn gravmix-btn--ghost" href="<?php echo $telegram; ?>" target="_blank" rel="noopener">Telegram</a>
                </div>
                <form class="gravmix-form" method="post" action="#" onsubmit="return false;">
                    <label>Имя
                        <input class="gravmix-input" type="text" name="name">
                    </label>
                    <label>Телефон
                        <input class="gravmix-input" type="text" name="phone">
                    </label>
                    <label>Сообщение
                        <textarea class="gravmix-input" name="message" rows="4"></textarea>
                    </label>
                    <button class="gravmix-btn" type="submit">Отправить</button>
                </form>
            </section>
        </div>
        <?php
        return ob_get_clean();
    }
}
