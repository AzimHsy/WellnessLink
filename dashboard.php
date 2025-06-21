<?php
session_start();
require_once 'database/config.php';

if (!isset($_SESSION['username'])) {
  header("Location: index.php");
  exit();
}

$email = $_SESSION['email'];
$userResult = $conn->query("SELECT id FROM users WHERE email = '$email'");
$user = $userResult->fetch_assoc();
$user_id = $user['id'];

$data = $conn->query("SELECT * FROM health_records WHERE user_id = $user_id")->fetch_assoc();

$diseaseDescriptions = [
  'Type 2 Diabetes' => 'A chronic condition that affects how your body processes blood sugar.',
  'Hypertension' => 'High blood pressure that can lead to severe health complications.',
  'Asthma' => 'A condition that causes difficulty breathing due to inflamed airways.',
  'High Cholesterol' => 'Excess cholesterol in blood, increasing heart disease risk.',
  'Heart Disease' => 'Covers a range of heart-related problems and conditions.',
  'Arthritis' => 'Inflammation of one or more joints, causing pain and stiffness.',
  'Depression' => 'A mental health disorder characterized by persistent sadness and loss of interest.',
  'Thyroid Disorder' => 'Conditions that affect the thyroid gland’s hormone production.',
  'Chronic Kidney Disease' => 'A gradual loss of kidney function over time.'
];

$disease = $data['disease'];
$description = $diseaseDescriptions[$disease] ?? 'No description available for this condition.';


?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Dashboard</title>
  <!-- Letak File CSS kat sini, Buat File Lain -->
  <link rel="stylesheet" href="assets/css/interface.css" />
  <link rel="stylesheet" href="assets/css/dashboard.css" />
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>

<body>
  <!-- Navbar -->
  <?php include 'includes/navbar.php'; ?>

  <!-- Hero Section -->

  <div class="heading">
    <h1>Hi <span><?php echo htmlspecialchars($_SESSION['username']); ?>,</span> here's your health snapshot!</h1>
    <h4>Health Tip : Stay active for at least 30 minutes each day</h4>
  </div>

  <div class="dashboard-container">
    <div class="dashboard-content">
      <div class="row-1-content">
        <h3><?php echo htmlspecialchars($disease); ?></h3>
        <p><?php echo $description; ?></p>
      </div>
      <div class="line-divider"></div>
      <div class="row-2-content">
        <div class="content-2-holder">
          <h3>Allergies</h3>
          <p><?php echo htmlspecialchars($data['allergies']); ?></p>
        </div>
        <div class="line-divider-two"></div>
        <div class="content-2-holder">
          <h3>Medication</h3>
          <p><?php echo htmlspecialchars($data['medication_name']); ?>, <?php echo htmlspecialchars($data['frequency']); ?></p>
        </div>
        <div class="line-divider-two"></div>
        <div class="content-2-holder">
          <h3>BMI</h3>
          <p><?php echo htmlspecialchars($data['bmi']); ?></p>
        </div>
      </div>
      <button class="Btn">Edit
        <svg class="svg" viewBox="0 0 512 512">
          <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
        </svg>
      </button>
    </div>
  </div>

  <div class="dashboard-chart-container">
    <div class="dashboard-card">
      <!-- Water Intake Chart -->
      <div class="chart-box">
        <h3>Weekly Water Intake</h3>
        <canvas id="waterChart"></canvas>
      </div>

      <!-- BMI Trend Line Chart -->
      <div class="chart-box">
        <h3>BMI Trend</h3>
        <canvas id="bmiChart"></canvas>
      </div>


      <!-- Medication Chart -->
      <div class="chart-box">
        <h3>Medication Adherence</h3>
        <div class="doughnut-container">
          <canvas id="medChart"></canvas>
          <div class="center-label" id="medPercent">86%</div>
        </div>
      </div>

      <div class="chart-box">
        <div class="notif-holder">
          <div class="notif-header">
            <h4>Health Overview</h4>
          </div>
          <div class="notif-content-area">
            <div class="notif-content">
              <p>Drink at least 8 glasses of water daily to stay hydrated and support your body's natural functions.</p>
            </div>
            <div class="notif-content">
              <p>Include more fruits, vegetables, and whole grains in your diet to improve digestion and boost immunity.</p>
            </div>
            <div class="notif-content">
              <p>Aim for 7–9 hours of quality sleep each night to help your body recover and regulate hormone levels.</p>
            </div>
            <div class="notif-content">
              <p>Get at least 30 minutes of moderate exercise most days of the week to maintain a healthy weight and heart.</p>
            </div>
            <div class="notif-content">
              <p>Manage stress with relaxation techniques like meditation, deep breathing, or yoga to support mental health.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

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
  <script src="assets/js/interface.js" defer></script>
  <script src="assets/js/dashboard.js" defer></script>
</body>

</html>