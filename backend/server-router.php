<?php
/**
 * Router script for PHP's built-in server (php -S).
 * Serves static files from public/ directly, routes everything else to Laravel.
 */

$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

// If the request is for a real file in public/, serve it directly
if ($uri !== '/' && file_exists(__DIR__ . '/public' . $uri)) {
    return false; // let PHP's built-in server handle static files
}

// Otherwise, route through Laravel
$_SERVER['SCRIPT_NAME'] = '/index.php';
require_once __DIR__ . '/public/index.php';
