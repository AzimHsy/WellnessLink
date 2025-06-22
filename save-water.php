<?php
session_start();
include 'database/config.php';

// Get the logged-in user ID
$user_id = $_SESSION['user_id'] ?? null;

if (!$user_id) {
    http_response_code(401);
    echo "User not authenticated.";
    exit;
}

$glasses_taken = intval($_POST['glasses_taken'] ?? 0);
$today = date('Y-m-d');

// Check if today's record already exists
$stmt = $conn->prepare("SELECT id FROM water_intake WHERE user_id = ? AND date = ?");
$stmt->bind_param("is", $user_id, $today);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    // Update the existing record
    $update = $conn->prepare("UPDATE water_intake SET glasses_taken = ? WHERE user_id = ? AND date = ?");
    $update->bind_param("iis", $glasses_taken, $user_id, $today);
    $update->execute();
    $update->close();
} else {
    // Insert a new record
    $insert = $conn->prepare("INSERT INTO water_intake (user_id, date, glasses_taken) VALUES (?, ?, ?)");
    $insert->bind_param("isi", $user_id, $today, $glasses_taken);
    $insert->execute();
    $insert->close();
}

$stmt->close();
$conn->close();

echo "Water intake saved.";
