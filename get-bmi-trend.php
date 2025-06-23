<?php
session_start();
include "database/config.php";

$user_id = $_SESSION['user_id'] ?? null;

if (!$user_id) {
    http_response_code(401);
    echo json_encode(["error" => "User not logged in"]);
    exit;
}

$sql = "SELECT DATE(created_at) as date, bmi FROM bmi_logs
        WHERE user_id = ?
        AND created_at >= CURDATE() - INTERVAL 6 MONTH
        ORDER BY created_at ASC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

header('Content-Type: application/json');
echo json_encode($data, JSON_PRETTY_PRINT);
