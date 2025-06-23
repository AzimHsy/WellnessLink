<?php
session_start();
require_once 'database/config.php';

if (!isset($_SESSION['email'])) {
    http_response_code(401);
    echo json_encode(["error" => "Not logged in"]);
    exit;
}

$email = $_SESSION['email'];
$result = $conn->query("SELECT id FROM users WHERE email = '$email'");
$user = $result->fetch_assoc();
$user_id = $user['id'];

$sql = "SELECT id, title, message FROM notifications WHERE user_id = ? AND is_read = 0 ORDER BY created_at DESC";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$res = $stmt->get_result();

$notifications = [];
while ($row = $res->fetch_assoc()) {
    $notifications[] = $row;
}
echo json_encode($notifications);
