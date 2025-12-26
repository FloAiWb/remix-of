<?php

if (!defined('ABSPATH')) {
    exit;
}

class GravMix_Activator
{
    public static function activate(): void
    {
        $pages = [
            'gravmix_home' => [
                'title' => 'Главная',
                'slug' => 'home',
                'content' => '[gravmix_home]'
            ],
            'gravmix_engrave_designer' => [
                'title' => 'Конструктор',
                'slug' => 'engrave',
                'content' => '[gravmix_engrave_designer]'
            ],
            'gravmix_catalog' => [
                'title' => 'Каталог',
                'slug' => 'catalog',
                'content' => '[products columns="4" limit="12"]'
            ],
            'gravmix_how' => [
                'title' => 'Как это работает',
                'slug' => 'how-it-works',
                'content' => 'Опишите процесс гравировки, сроки и этапы. Отредактируйте эту страницу.'
            ],
            'gravmix_about' => [
                'title' => 'О нас',
                'slug' => 'about',
                'content' => 'Расскажите о GravMix, миссии и производстве. Отредактируйте эту страницу.'
            ],
            'gravmix_contacts' => [
                'title' => 'Контакты',
                'slug' => 'contacts',
                'content' => '[gravmix_contacts]'
            ],
        ];

        foreach ($pages as $option_key => $page) {
            $existing_id = get_option($option_key);
            if ($existing_id && get_post_status($existing_id)) {
                continue;
            }

            $page_id = wp_insert_post([
                'post_title' => $page['title'],
                'post_name' => $page['slug'],
                'post_content' => $page['content'],
                'post_status' => 'publish',
                'post_type' => 'page'
            ]);

            if (!is_wp_error($page_id)) {
                update_option($option_key, $page_id);
            }
        }

        $home_id = get_option('gravmix_home');
        if ($home_id && get_post_status($home_id)) {
            update_option('show_on_front', 'page');
            update_option('page_on_front', $home_id);
        }

        if (!get_option(GRAVMIX_OPTION_KEY)) {
            $defaults = [
                'phone' => '+7 (900) 000-00-00',
                'whatsapp_link' => 'https://wa.me/79000000000',
                'telegram_link' => 'https://t.me/gravmix',
                'telegram_bot_token' => '',
                'telegram_chat_id' => '',
                'product_bracelet_id' => '',
                'product_tag_id' => '',
                'product_keychain_id' => '',
                'address' => 'Москва, ул. Примерная, 10',
                'hours' => 'Пн–Сб 10:00–20:00',
            ];
            add_option(GRAVMIX_OPTION_KEY, $defaults);
        }
    }
}
