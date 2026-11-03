<?php
declare(strict_types=1);

// Uses the hosting server's mail transport; no external service is required.
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function respond(int $status, bool $ok, string $message): void
{
    http_response_code($status);
    echo json_encode(['ok' => $ok, 'message' => $message]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    respond(405, false, 'Please submit the enquiry form.');
}
if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 32768) {
    respond(413, false, 'Your submission is too large. Please shorten your message.');
}

function field(string $name, int $limit = 200): string
{
    $value = $_POST[$name] ?? '';
    if (!is_string($value) || strlen($value) > $limit || preg_match('//u', $value) !== 1 || strpos($value, "\0") !== false) {
        respond(422, false, 'Please check the submitted details and try again.');
    }
    return trim(str_replace(["\r\n", "\r"], "\n", $value));
}

$type = field('formType');
if (!in_array($type, ['contact', 'partner'], true)) {
    respond(422, false, 'Please use a valid enquiry form.');
}
if (field('website') !== '') {
    respond(422, false, 'Unable to submit this enquiry.');
}

$labels = [
    'firstName' => 'First name', 'lastName' => 'Last name',
    'email' => 'Email', 'phone' => 'Phone',
];
if ($type === 'contact') {
    $labels += [
        'subject' => 'Subject', 'queryType' => 'Query related to', 'product' => 'Product',
        'pinCode' => 'ZIP / postal code', 'city' => 'City', 'state' => 'State', 'message' => 'Message',
    ];
    $required = ['firstName', 'lastName', 'phone', 'pinCode', 'city', 'state'];
} else {
    $labels += [
        'city' => 'City', 'state' => 'State', 'company' => 'Company', 'pinCode' => 'PIN code',
        'existingDistributor' => 'Already a battery distributor', 'industryYears' => 'Years in battery industry',
        'companyType' => 'Firm / company type', 'portfolio' => 'Applying distributorship for',
        'turnover' => 'Annual turnover', 'dealers' => 'Number of dealers',
        'salesTeam' => 'Sales team / service manpower', 'warehouse' => 'Area of warehouse',
        'consent' => 'Consent to be contacted',
    ];
    $required = ['firstName', 'lastName', 'phone', 'city', 'state', 'company', 'pinCode', 'consent'];
}
$limits = json_decode(file_get_contents(__DIR__ . '/form-limits.json'), true);
if (!is_array($limits) || !isset($limits[$type])) {
    respond(503, false, 'Unable to validate your enquiry right now. Please try again later.');
}
$values = [];
foreach ($labels as $key => $label) {
    $limit = $key === 'message' ? 5000 : ($limits[$type][$key] ?? 200);
    $values[$key] = field($key, $limit * 4);
    if (preg_match_all('/./us', $values[$key]) > $limit) {
        respond(422, false, $label . ' must contain no more than ' . $limit . ' characters.');
    }
}
foreach ($required as $key) {
    if ($values[$key] === '') {
        respond(422, false, 'Please complete: ' . $labels[$key] . '.');
    }
}
$email = $values['email'];
if ($email !== '' && (!filter_var($email, FILTER_VALIDATE_EMAIL) || preg_match('/[\r\n]/', $email))) {
    respond(422, false, 'Please enter a valid email address.');
}
foreach ($values as $key => $value) {
    if ($key !== 'message' && preg_match('/[\x00-\x1F\x7F]/u', $value)) {
        respond(422, false, 'Please enter ' . strtolower($labels[$key]) . ' on a single line.');
    }
}
$digits = preg_replace('/\D/', '', $values['phone']);
if (!preg_match('/^\+?[0-9() .-]+$/', $values['phone']) || strlen($digits) < 7 || strlen($digits) > 15
    || preg_match('/^0+$/', $digits)) {
    respond(422, false, 'Please enter a valid phone number containing 7 to 15 digits.');
}
$options = json_decode(file_get_contents(__DIR__ . '/form-options.json'), true);
if (!is_array($options) || !isset($options[$type])) {
    respond(503, false, 'Unable to validate your enquiry right now. Please try again later.');
}
foreach ($options[$type] as $key => $allowed) {
    if ($values[$key] !== '' && !in_array($values[$key], $allowed, true)) {
        respond(422, false, 'Please select a valid option for ' . strtolower($labels[$key]) . '.');
    }
}
if ($type === 'partner' && $values['consent'] !== 'yes') {
    respond(422, false, 'Please agree to be contacted about your application.');
}

// Limit repeated submissions from the same browser without storing enquiry details.
require_once __DIR__ . '/form-session.php';
if (!start_form_session()) {
    respond(503, false, 'Unable to submit right now. Please try again later.');
}
$captchaAnswer = strtoupper(field('captcha', 6));
$challenge = $_SESSION['form_captcha'][$type] ?? null;
// Consume the challenge on every validation attempt to prevent replay.
unset($_SESSION['form_captcha'][$type]);
if (!is_array($challenge) || (int) $challenge['expires'] < time()
    || !preg_match('/^[A-Z2-9]{6}$/', $captchaAnswer)
    || !hash_equals($challenge['hash'], hash('sha256', $captchaAnswer))) {
    session_write_close();
    respond(422, false, 'The security code is incorrect or expired. Please enter the new code and try again.');
}
if (time() - (int) ($_SESSION['last_form_submission'] ?? 0) < 60) {
    header('Retry-After: 60');
    respond(429, false, 'Please wait a minute before sending another enquiry.');
}

$title = $type === 'contact' ? 'Website enquiry' : 'Distributor application';
$body = $title . "\nSubmitted at: " . gmdate('Y-m-d H:i:s') . " UTC\n\n";
foreach ($labels as $key => $label) {
    $value = $values[$key] !== '' ? $values[$key] : 'Not provided';
    $body .= $label . ":\n" . $value . "\n\n";
}
$headers = [
    'From: Eastman Website <support@eaplworld.com>',
    'Bcc: ravishridhar1@gmail.com',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
];
if ($email !== '') {
    $headers[] = 'Reply-To: ' . $email;
}
$sent = function_exists('mail') && @mail(
    'marketing@eaplworld.com',
    '[EAPL Website] ' . $title,
    chunk_split(base64_encode($body)),
    implode("\r\n", $headers)
);
if (!$sent) {
    session_write_close();
    respond(503, false, 'We could not send your enquiry. Please try again later or email marketing@eaplworld.com.');
}
$_SESSION['last_form_submission'] = time();
session_write_close();
respond(200, true, 'Thank you. Your enquiry has been submitted successfully.');
