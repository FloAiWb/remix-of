<?php

if (!defined('ABSPATH')) {
    exit;
}

class GravMix_Admin
{
    public function __construct()
    {
        add_action('admin_menu', [$this, 'register_menu']);
        add_action('admin_init', [$this, 'register_settings']);
    }

    public function register_menu(): void
    {
        add_options_page(
            'GravMix Settings',
            'GravMix',
            'manage_options',
            'gravmix-settings',
            [$this, 'render_settings_page']
        );
    }

    public function register_settings(): void
    {
        register_setting('gravmix_settings_group', GRAVMIX_OPTION_KEY, [
            'sanitize_callback' => [$this, 'sanitize_settings']
        ]);
    }

    public function sanitize_settings(array $input): array
    {
        return [
            'phone' => sanitize_text_field($input['phone'] ?? ''),
            'whatsapp_link' => esc_url_raw($input['whatsapp_link'] ?? ''),
            'telegram_link' => esc_url_raw($input['telegram_link'] ?? ''),
            'telegram_bot_token' => sanitize_text_field($input['telegram_bot_token'] ?? ''),
            'telegram_chat_id' => sanitize_text_field($input['telegram_chat_id'] ?? ''),
            'product_bracelet_id' => absint($input['product_bracelet_id'] ?? 0),
            'product_tag_id' => absint($input['product_tag_id'] ?? 0),
            'product_keychain_id' => absint($input['product_keychain_id'] ?? 0),
            'address' => sanitize_text_field($input['address'] ?? ''),
            'hours' => sanitize_text_field($input['hours'] ?? ''),
        ];
    }

    public function render_settings_page(): void
    {
        $options = get_option(GRAVMIX_OPTION_KEY, []);
        ?>
        <div class="wrap">
            <h1>GravMix — настройки</h1>
            <form method="post" action="options.php">
                <?php settings_fields('gravmix_settings_group'); ?>
                <table class="form-table" role="presentation">
                    <tr>
                        <th scope="row"><label for="gravmix_phone">Телефон</label></th>
                        <td><input name="<?php echo esc_attr(GRAVMIX_OPTION_KEY); ?>[phone]" id="gravmix_phone" type="text" class="regular-text" value="<?php echo esc_attr($options['phone'] ?? ''); ?>"></td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="gravmix_whatsapp">WhatsApp link</label></th>
                        <td><input name="<?php echo esc_attr(GRAVMIX_OPTION_KEY); ?>[whatsapp_link]" id="gravmix_whatsapp" type="url" class="regular-text" value="<?php echo esc_attr($options['whatsapp_link'] ?? ''); ?>"></td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="gravmix_telegram">Telegram link</label></th>
                        <td><input name="<?php echo esc_attr(GRAVMIX_OPTION_KEY); ?>[telegram_link]" id="gravmix_telegram" type="url" class="regular-text" value="<?php echo esc_attr($options['telegram_link'] ?? ''); ?>"></td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="gravmix_bot">Telegram Bot Token</label></th>
                        <td><input name="<?php echo esc_attr(GRAVMIX_OPTION_KEY); ?>[telegram_bot_token]" id="gravmix_bot" type="text" class="regular-text" value="<?php echo esc_attr($options['telegram_bot_token'] ?? ''); ?>"></td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="gravmix_chat">Telegram Chat ID</label></th>
                        <td><input name="<?php echo esc_attr(GRAVMIX_OPTION_KEY); ?>[telegram_chat_id]" id="gravmix_chat" type="text" class="regular-text" value="<?php echo esc_attr($options['telegram_chat_id'] ?? ''); ?>"></td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="gravmix_product_bracelet">Товар: браслет (ID)</label></th>
                        <td><input name="<?php echo esc_attr(GRAVMIX_OPTION_KEY); ?>[product_bracelet_id]" id="gravmix_product_bracelet" type="number" class="regular-text" value="<?php echo esc_attr($options['product_bracelet_id'] ?? ''); ?>"></td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="gravmix_product_tag">Товар: жетон (ID)</label></th>
                        <td><input name="<?php echo esc_attr(GRAVMIX_OPTION_KEY); ?>[product_tag_id]" id="gravmix_product_tag" type="number" class="regular-text" value="<?php echo esc_attr($options['product_tag_id'] ?? ''); ?>"></td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="gravmix_product_keychain">Товар: брелок (ID)</label></th>
                        <td><input name="<?php echo esc_attr(GRAVMIX_OPTION_KEY); ?>[product_keychain_id]" id="gravmix_product_keychain" type="number" class="regular-text" value="<?php echo esc_attr($options['product_keychain_id'] ?? ''); ?>"></td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="gravmix_address">Адрес</label></th>
                        <td><input name="<?php echo esc_attr(GRAVMIX_OPTION_KEY); ?>[address]" id="gravmix_address" type="text" class="regular-text" value="<?php echo esc_attr($options['address'] ?? ''); ?>"></td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="gravmix_hours">Часы работы</label></th>
                        <td><input name="<?php echo esc_attr(GRAVMIX_OPTION_KEY); ?>[hours]" id="gravmix_hours" type="text" class="regular-text" value="<?php echo esc_attr($options['hours'] ?? ''); ?>"></td>
                    </tr>
                </table>
                <?php submit_button('Сохранить'); ?>
            </form>
        </div>
        <?php
    }
}
