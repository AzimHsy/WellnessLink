<?php
session_start();
require_once 'database/config.php';

if (!isset($_SESSION['email'])) {
    exit;
}

$ids = explode(",", $_POST['ids']);
$placeholders = implode(',', array_fill(0, count($ids), '?'));
$types = str_repeat('i', count($ids));

$sql = "UPDATE notifications SET is_read = 1 WHERE id IN ($placeholders)";
$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$ids);
$stmt->execute();
