<?php
declare(strict_types=1);
require_once __DIR__ . '/form-session.php';
header('Cache-Control: no-store, no-cache, must-revalidate');
header('X-Content-Type-Options: nosniff');

$type = $_GET['form'] ?? '';
if ($_SERVER['REQUEST_METHOD'] !== 'GET' || !is_string($type) || !in_array($type, ['contact', 'partner'], true)) {
    http_response_code(400);
    exit;
}
if (!extension_loaded('gd') || !start_form_session()) {
    http_response_code(503);
    exit;
}

$alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
$answer = '';
for ($i = 0; $i < 6; $i++) {
    $answer .= $alphabet[random_int(0, strlen($alphabet) - 1)];
}
$image = imagecreatetruecolor(240, 80);
$background = imagecolorallocate($image, 241, 245, 250);
imagefill($image, 0, 0, $background);
for ($i = 0; $i < 160; $i++) {
    $noise = imagecolorallocate($image, random_int(130, 210), random_int(140, 210), random_int(150, 220));
    imagefilledellipse($image, random_int(0, 239), random_int(0, 79), 2, 2, $noise);
}
for ($i = 0; $i < 6; $i++) {
    $glyph = imagecreatetruecolor(24, 30);
    $transparent = imagecolorallocate($glyph, 241, 245, 250);
    imagefill($glyph, 0, 0, $transparent);
    imagecolortransparent($glyph, $transparent);
    $ink = imagecolorallocate($glyph, random_int(15, 55), random_int(35, 75), random_int(70, 110));
    imagestring($glyph, 5, 7, 6, $answer[$i], $ink);
    $rotated = imagerotate($glyph, random_int(-18, 18), $transparent);
    imagecopyresampled($image, $rotated, 8 + $i * 38, random_int(8, 17), 0, 0, 36, 52, imagesx($rotated), imagesy($rotated));
    imagedestroy($glyph);
    imagedestroy($rotated);
}
for ($i = 0; $i < 3; $i++) {
    $line = imagecolorallocate($image, 140, 160, 180);
    imageline($image, 0, random_int(10, 70), 239, random_int(10, 70), $line);
}
$_SESSION['form_captcha'][$type] = ['hash' => hash('sha256', $answer), 'expires' => time() + 300];
session_write_close();
header('Content-Type: image/png');
imagepng($image);
imagedestroy($image);
