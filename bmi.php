<?php
session_start();
?>


<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>BMI Calculator</title>
    <!-- Letak File CSS kat sini, Buat File Lain -->
    <link rel="stylesheet" href="assets/css/interface.css" />
    <link rel="stylesheet" href="assets/css/bmi.css" />
</head>

<body>
    <!-- Navbar -->
    <?php include 'includes/navbar.php'; ?>

    <!-- Hero Section -->
    <main id="bmi-section">
        <div class="card">
            <h1>BMI Calculator</h1>
            <p>Check your Body Mass Index instantly !</p>
            <form id="bmi-form">
                <input type="number" min="1" id="height" placeholder="Height (cm)" required>
                <input type="number" min="1" id="weight" placeholder="Weight (kg)" required>
                <div class="one-row-content">
                    <input type="number" id="age" placeholder="Age (2 - 120)" min="2" max="120" required>
                    <div class="gender-selection">
                        <label><input type="radio" name="gender" value="male" required>Male</label>
                        <label><input type="radio" name="gender" value="female">Female</label>
                    </div>
                </div>
                <button type="submit" class="calculate-btn">Calculate BMI</button>
            </form>
            <div id="result" class="result"></div>
        </div>
    </main>

    <!-- Functions -->
    <?php include 'includes/functions.php'; ?>

    <!-- From Uiverse.io by alexruix -->
    <div class="loader"></div>

    <!-- Fonts & Icon Pugins -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap"
        rel="stylesheet" />
    <script
        type="module"
        src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
    <script
        nomodule
        src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>

    <!-- Link Javascript Files, Buat File Lain -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="assets/js/interface.js" defer></script>
    <script src="assets/js/bmi.js" defer></script>
</body>

</html>