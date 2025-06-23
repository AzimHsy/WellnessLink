<?php
session_start();
require_once 'database/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: dashboard.php");
    exit();
}


if (!isset($_SESSION['email'])) {
    http_response_code(403);
    exit("Not logged in.");
}

$email = $_SESSION['email'];

// Get user ID
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(404);
    exit("User not found.");
}

$user = $result->fetch_assoc();
$user_id = $user['id'];

// Delete from related tables first (optional based on your DB structure)
$conn->query("DELETE FROM water_intake WHERE user_id = $user_id");
$conn->query("DELETE FROM health_records WHERE user_id = $user_id");
$conn->query("DELETE FROM reminders WHERE user_id = $user_id");
$conn->query("DELETE FROM notifications WHERE user_id = $user_id");

// Delete from users table
$conn->query("DELETE FROM users WHERE id = $user_id");

// Destroy session
session_unset();
session_destroy();

echo "Account deleted.";
