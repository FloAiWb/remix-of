<?php

if (!defined('ABSPATH')) {
    exit;
}

class GravMix_WooCommerce
{
    public function __construct()
    {
        add_filter('woocommerce_get_item_data', [$this, 'render_item_data'], 10, 2);
        add_action('woocommerce_checkout_create_order_line_item', [$this, 'add_order_item_meta'], 10, 4);
    }

    public function render_item_data(array $item_data, array $cart_item): array
    {
        if (empty($cart_item['gravmix_engraving'])) {
            return $item_data;
        }

        $engrave = $cart_item['gravmix_engraving'];
        $item_data[] = [
            'name' => 'Гравировка',
            'value' => esc_html($engrave['text'] ?? '')
        ];
        $item_data[] = [
            'name' => 'Шрифт',
            'value' => esc_html($engrave['font'] ?? '')
        ];
        $item_data[] = [
            'name' => 'Изделие',
            'value' => esc_html($engrave['productType'] ?? '')
        ];

        return $item_data;
    }

    public function add_order_item_meta($item, $cart_item_key, $values, $order): void
    {
        if (empty($values['gravmix_engraving'])) {
            return;
        }

        $engrave = $values['gravmix_engraving'];
        $item->add_meta_data('Гравировка', $engrave['text'] ?? '');
        $item->add_meta_data('Шрифт', $engrave['font'] ?? '');
        $item->add_meta_data('Изделие', $engrave['productType'] ?? '');
    }
}
