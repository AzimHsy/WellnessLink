<?php
require 'database/config.php';
session_start();
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if (
    !isset($data['id']) || !isset($data['name']) ||
    !isset($data['dosage']) || !isset($data['dosageType']) ||
    !isset($data['time'])
) {
    echo json_encode(['success' => false, 'error' => 'Missing required fields.']);
    exit;
}

$id = intval($data['id']);
$name = $conn->real_escape_string(trim($data['name']));
$dosage = intval($data['dosage']);
$dosageType = $conn->real_escape_string(trim($data['dosageType']));
$time = $conn->real_escape_string(trim($data['time']));
$repeat = isset($data['repeat']) ? $conn->real_escape_string($data['repeat']) : 'once';

$stmt = $conn->prepare("UPDATE reminders SET medication_name = ?, dosage = ?, dosage_type = ?, reminder_time = ?, repeat_type = ? WHERE id = ?");
$stmt->bind_param("sisssi", $name, $dosage, $dosageType, $time, $repeat, $id);

if ($stmt->execute()) {
    $_SESSION['reminder_updated'] = true;
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to update reminder.']);
}

$stmt->close();
$conn->close();
