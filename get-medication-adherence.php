<?php
session_start();
include "database/config.php";

$user_id = $_SESSION['user_id'] ?? null;

if (!$user_id) {
    http_response_code(401);
    echo json_encode(["error" => "User not logged in"]);
    exit;
}

// Example logic (you can adjust this based on how you track adherence)
$sql = "SELECT date, taken FROM medication_logs
        WHERE user_id = ?
        AND date >= CURDATE() - INTERVAL 6 DAY
        ORDER BY date ASC";

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
