<?php
session_start();
include 'database/config.php';

if (!isset($_SESSION['email'])) {
    http_response_code(401);
    exit("Not logged in");
}

$email = $_SESSION['email'];
$res = $conn->query("SELECT id FROM users WHERE email = '$email'");
if (!$res || $res->num_rows === 0) {
    http_response_code(404);
    exit("User not found");
}
$user = $res->fetch_assoc();
$user_id = $user['id'];

$title = $_POST['title'] ?? '';
$message = $_POST['message'] ?? '';

if ($title && $message) {
    $stmt = $conn->prepare("INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)");
    $stmt->bind_param("iss", $user_id, $title, $message);
    $stmt->execute();
    $stmt->close();
    echo "Notification saved.";
} else {
    echo "Missing title or message";
}
