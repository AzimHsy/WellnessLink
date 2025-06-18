<?php

// Register Process

session_start();
require_once 'database/config.php';

if (isset($_POST['register'])) {
    $name = $_POST['username'];
    $email = $_POST['email'];
    $password = $_POST['password'];

    if (empty($name) || empty($email) || empty($password)) {
        $_SESSION['register_error'] = 'All fields are required';
    } else {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $checkEmail = $conn->query("SELECT email FROM users WHERE email = '$email'");
        if ($checkEmail->num_rows > 0) {
            $_SESSION['register_error'] = 'Email is already registered';
        } else {
            $conn->query("INSERT INTO users (name, email, password) VALUES ('$name', '$email', '$hashedPassword')");
            $_SESSION['register_success'] = 'Registration successful. You can now log in.';
        }
    }

    header("Location: index.php");
    exit();
}

// Login Process

if (isset($_POST['login'])) {
    $email = $_POST['email'];
    $password = $_POST['password'];

    $result = $conn->query("SELECT * FROM users WHERE email = '$email'");
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        if (password_verify($password, $user['password'])) {
            $_SESSION['username'] = $user['username'];
            $_SESSION['email'] = $user['email'];
            header("Location: dashboard.php");
            exit();
        }
    }

    $_SESSION['login_error'] = 'Incorrect email or password';
    header("Location: index.php");
    exit();
}
