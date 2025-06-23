<?php
require 'database/config.php';
session_start();

date_default_timezone_set('Asia/Kuala_Lumpur');
header('Content-Type: application/json');

if (!isset($_SESSION['email'])) {
    echo json_encode([]);
    exit();
}

$email = $_SESSION['email'];
$userResult = $conn->query("SELECT id FROM users WHERE email = '$email'");
$user = $userResult->fetch_assoc();
$user_id = $user['id'];

// Get current time (server time)
$now = date("H:i:s");
$two_minutes_later = date("H:i:s", strtotime("+2 minutes"));

$sql = "SELECT * FROM reminders 
        WHERE user_id = ? 
        AND reminder_time BETWEEN ? AND ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("iss", $user_id, $now, $two_minutes_later);
$stmt->execute();

$result = $stmt->get_result();
$due_reminders = [];

while ($row = $result->fetch_assoc()) {
    $due_reminders[] = $row;
}

echo json_encode($due_reminders);

$conn->close();
