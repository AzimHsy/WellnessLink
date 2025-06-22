<?php
session_start();
require_once 'database/config.php';

if (!isset($_SESSION['email'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $bmi = $_POST['bmi'];
    $category = $_POST['category'];

    $email = $_SESSION['email'];
    $userResult = $conn->query("SELECT id FROM users WHERE email = '$email'");
    $user = $userResult->fetch_assoc();
    $user_id = $user['id'];

    $conn->query("UPDATE health_records SET bmi='$bmi', bmi_category='$category' WHERE user_id=$user_id");

    echo json_encode(['success' => true]);
    exit;
}

echo json_encode(['success' => false, 'message' => 'Invalid request']);
