<?php

// error_reporting(E_ALL);
// ini_set('display_errors', 1);

// Database config
$host = "localhost";
$user = "root";
$password = "";
$database = "users_db";

// Create connection
$conn = new mysqli($host, $user, $password, $database);
    
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$conn->set_charset("utf8mb4");
