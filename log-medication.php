<?php
require 'database/config.php';
session_start();

header('Content-Type: application/json');

if (!isset($_SESSION['email'])) {
    echo json_encode(["success" => false, "error" => "User not logged in"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['taken']) || !isset($data['reminder_id'])) {
    echo json_encode(["success" => false, "error" => "Missing values"]);
    exit();
}

$email = $_SESSION['email'];
$userResult = $conn->query("SELECT id FROM users WHERE email = '$email'");
$user = $userResult->fetch_assoc();
$user_id = $user['id'];

$reminder_id = intval($data['reminder_id']);
$taken = intval($data['taken']); // 1 = taken, 0 = ignored
$date = date("Y-m-d");

// ✅ Check if this reminder has already been logged today
$check = $conn->prepare("SELECT id FROM medication_logs WHERE user_id = ? AND reminder_id = ? AND date = ?");
$check->bind_param("iis", $user_id, $reminder_id, $date);
$check->execute();
$checkResult = $check->get_result();

if ($checkResult->num_rows > 0) {
    echo json_encode(["success" => false, "error" => "Already logged today for this reminder"]);
    exit();
}

// ✅ Insert the log
$stmt = $conn->prepare("INSERT INTO medication_logs (user_id, reminder_id, date, taken) VALUES (?, ?, ?, ?)");
$stmt->bind_param("iisi", $user_id, $reminder_id, $date, $taken);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $conn->error]);
}
