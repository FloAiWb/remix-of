<?php
/**
 * Plugin Name: GravMix One-Click Site
 * Description: One-click GravMix premium site with engraving designer and WooCommerce integration.
 * Version: 1.0.0
 * Author: GravMix
 * Requires at least: 6.0
 * Requires PHP: 8.0
 * Text Domain: gravmix
 */

if (!defined('ABSPATH')) {
    exit;
}

define('GRAVMIX_PLUGIN_VERSION', '1.0.0');
define('GRAVMIX_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('GRAVMIX_PLUGIN_URL', plugin_dir_url(__FILE__));

define('GRAVMIX_OPTION_KEY', 'gravmix_settings');

require_once GRAVMIX_PLUGIN_DIR . 'includes/class-gravmix-activator.php';
require_once GRAVMIX_PLUGIN_DIR . 'includes/class-gravmix-admin.php';
require_once GRAVMIX_PLUGIN_DIR . 'includes/class-gravmix-shortcodes.php';
require_once GRAVMIX_PLUGIN_DIR . 'includes/class-gravmix-rest.php';
require_once GRAVMIX_PLUGIN_DIR . 'includes/class-gravmix-woocommerce.php';

register_activation_hook(__FILE__, ['GravMix_Activator', 'activate']);

add_action('plugins_loaded', function () {
    new GravMix_Admin();
    new GravMix_Shortcodes();
    new GravMix_REST();
    new GravMix_WooCommerce();
});
