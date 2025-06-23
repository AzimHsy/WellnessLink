<?php
session_start();
require_once 'database/config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['email'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $bmi = $_POST['bmi'] ?? null;
    $category = $_POST['category'] ?? null;

    if (!$bmi || !$category) {
        echo json_encode(['success' => false, 'message' => 'Missing BMI or category']);
        exit;
    }

    // Get user_id
    $email = $_SESSION['email'];
    $userResult = $conn->query("SELECT id FROM users WHERE email = '$email'");
    if (!$userResult || $userResult->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'User not found']);
        exit;
    }

    $user = $userResult->fetch_assoc();
    $user_id = $user['id'];

    // Update health_records
    $update = $conn->prepare("UPDATE health_records SET bmi = ?, bmi_category = ? WHERE user_id = ?");
    $update->bind_param("dsi", $bmi, $category, $user_id);
    $update->execute();
    $update->close();

    // Insert into bmi_logs
    $insert = $conn->prepare("INSERT INTO bmi_logs (user_id, bmi, bmi_category) VALUES (?, ?, ?)");
    if (!$insert) {
        echo json_encode(['success' => false, 'message' => 'Prepare failed: ' . $conn->error]);
        exit;
    }

    $insert->bind_param("ids", $user_id, $bmi, $category);
    if ($insert->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Insert failed: ' . $insert->error]);
    }

    $insert->close();
    exit;
}

echo json_encode(['success' => false, 'message' => 'Invalid request']);
