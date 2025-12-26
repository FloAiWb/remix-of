<?php

if (!defined('ABSPATH')) {
    exit;
}

class GravMix_REST
{
    public function __construct()
    {
        add_action('rest_api_init', [$this, 'register_routes']);
    }

    public function register_routes(): void
    {
        register_rest_route('gravmix/v1', '/lead', [
            'methods' => 'POST',
            'callback' => [$this, 'handle_lead'],
            'permission_callback' => [$this, 'verify_public_nonce']
        ]);

        register_rest_route('gravmix/v1', '/preview', [
            'methods' => 'POST',
            'callback' => [$this, 'handle_preview'],
            'permission_callback' => [$this, 'verify_public_nonce']
        ]);

        register_rest_route('gravmix/v1', '/add-to-cart', [
            'methods' => 'POST',
            'callback' => [$this, 'handle_add_to_cart'],
            'permission_callback' => [$this, 'verify_public_nonce']
        ]);
    }

    public function verify_public_nonce(WP_REST_Request $request): bool
    {
        $nonce = $request->get_header('x_wp_nonce');
        if (!$nonce) {
            return false;
        }

        return wp_verify_nonce($nonce, 'wp_rest') === 1;
    }

    private function rate_limit(string $key, int $limit = 30, int $window = 600): bool
    {
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        $transient_key = 'gravmix_rl_' . md5($key . $ip);
        $data = get_transient($transient_key);

        if (!$data) {
            set_transient($transient_key, ['count' => 1, 'start' => time()], $window);
            return true;
        }

        if ($data['count'] >= $limit) {
            return false;
        }

        $data['count']++;
        set_transient($transient_key, $data, $window);
        return true;
    }

    public function handle_lead(WP_REST_Request $request)
    {
        if (!$this->rate_limit('lead')) {
            return new WP_REST_Response(['message' => 'Rate limit'], 429);
        }

        $params = $request->get_json_params();
        $name = sanitize_text_field($params['name'] ?? '');
        $phone = sanitize_text_field($params['phone'] ?? '');
        $product = sanitize_text_field($params['productType'] ?? '');
        $text = sanitize_text_field($params['text'] ?? '');
        $font = sanitize_text_field($params['fontId'] ?? '');
        $preview = $params['previewPngBase64'] ?? '';

        $options = get_option(GRAVMIX_OPTION_KEY, []);
        $token = $options['telegram_bot_token'] ?? '';
        $chat_id = $options['telegram_chat_id'] ?? '';

        if (!$token || !$chat_id) {
            return new WP_REST_Response(['message' => 'Telegram settings missing'], 400);
        }

        $message = "Новый лид GravMix%0A" .
            "Имя: {$name}%0A" .
            "Телефон: {$phone}%0A" .
            "Изделие: {$product}%0A" .
            "Текст: {$text}%0A" .
            "Шрифт: {$font}";

        $response = wp_remote_post("https://api.telegram.org/bot{$token}/sendMessage", [
            'body' => [
                'chat_id' => $chat_id,
                'text' => $message,
                'parse_mode' => 'HTML'
            ],
            'timeout' => 15
        ]);

        if (is_wp_error($response)) {
            return new WP_REST_Response(['message' => 'Telegram error'], 500);
        }

        if ($preview) {
            wp_remote_post("https://api.telegram.org/bot{$token}/sendPhoto", [
                'body' => [
                    'chat_id' => $chat_id,
                    'photo' => $preview,
                    'caption' => 'Превью гравировки'
                ],
                'timeout' => 20
            ]);
        }

        return new WP_REST_Response(['message' => 'Sent'], 200);
    }

    public function handle_preview(WP_REST_Request $request)
    {
        if (!$this->rate_limit('preview', 60, 600)) {
            return new WP_REST_Response(['message' => 'Rate limit'], 429);
        }

        $params = $request->get_json_params();
        $text = sanitize_text_field($params['text'] ?? 'GravMix');
        $font = sanitize_text_field($params['fontId'] ?? 'serif');
        $product = sanitize_text_field($params['productType'] ?? 'bracelet');

        $hash = md5($text . $font . $product);
        $cached = get_transient('gravmix_preview_' . $hash);
        if ($cached) {
            return new WP_REST_Response(['preview' => $cached], 200);
        }

        if (!function_exists('imagecreatetruecolor')) {
            return new WP_REST_Response(['message' => 'GD not available'], 500);
        }

        $upload_dir = wp_upload_dir();
        $dir = trailingslashit($upload_dir['basedir']) . 'gravmix-previews';
        if (!file_exists($dir)) {
            wp_mkdir_p($dir);
        }

        $file = $dir . '/preview-' . $hash . '.png';
        $width = 900;
        $height = 540;
        $image = imagecreatetruecolor($width, $height);
        $bg = imagecolorallocate($image, 20, 20, 24);
        imagefill($image, 0, 0, $bg);

        $metal = imagecolorallocate($image, 180, 180, 190);
        imagefilledrectangle($image, 120, 160, 780, 380, $metal);

        $shadow = imagecolorallocate($image, 40, 40, 40);
        $text_color = imagecolorallocate($image, 230, 230, 230);
        imagestring($image, 5, 260, 255, $text, $shadow);
        imagestring($image, 5, 258, 253, $text, $text_color);

        imagepng($image, $file);
        imagedestroy($image);

        $url = trailingslashit($upload_dir['baseurl']) . 'gravmix-previews/preview-' . $hash . '.png';
        set_transient('gravmix_preview_' . $hash, $url, 6 * HOUR_IN_SECONDS);

        return new WP_REST_Response(['preview' => $url], 200);
    }

    public function handle_add_to_cart(WP_REST_Request $request)
    {
        if (!class_exists('WooCommerce')) {
            return new WP_REST_Response(['message' => 'WooCommerce not active'], 400);
        }

        if (!$this->rate_limit('add_to_cart', 20, 300)) {
            return new WP_REST_Response(['message' => 'Rate limit'], 429);
        }

        $params = $request->get_json_params();
        $product_id = absint($params['productId'] ?? 0);
        $engrave = [
            'text' => sanitize_text_field($params['text'] ?? ''),
            'font' => sanitize_text_field($params['fontId'] ?? ''),
            'productType' => sanitize_text_field($params['productType'] ?? ''),
        ];

        if (!$product_id) {
            return new WP_REST_Response(['message' => 'Missing product ID'], 400);
        }

        $cart_item_data = [
            'gravmix_engraving' => $engrave
        ];

        $added = WC()->cart->add_to_cart($product_id, 1, 0, [], $cart_item_data);
        if (!$added) {
            return new WP_REST_Response(['message' => 'Unable to add to cart'], 500);
        }

        return new WP_REST_Response(['message' => 'Added', 'cartUrl' => wc_get_cart_url()], 200);
    }
}
