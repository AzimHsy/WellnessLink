<?php
session_start();
?>


<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nearby Clinics Locator</title>
  <!-- Letak File CSS kat sini, Buat File Lain -->
  <link rel="stylesheet" href="assets/css/interface.css" />
  <link rel="stylesheet" href="assets/css/maps.css" />
  <script src="https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs" type="module"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
</head>

<body>
  <!-- Navbar -->
  <?php include 'includes/navbar.php'; ?>
  <?php include 'includes/notification-box.php'; ?>

  <!-- Hero Sections -->
  <div class="clinic-container">
    <div class="clinic-heading">
      <h2>Nearby Clinics</h2>
      <div class="small-spacer"></div>
    </div>
    <div class="find-clinic-btn">
      <div class="buttons">
        <button class="btn" id="clinic-btn" onclick="startClinicLocator()"><span></span>
          <p data-start="Clinic Found!" data-text="start!" data-title="Find Nearby Clinic"></p>
        </button>
      </div>
    </div>
    <div class="google-maps">
      <div id="map"></div>
    </div>
    <div class="search-box">
      <input
        type="text"
        id="searchBox"
        placeholder="Search Clinics ..."
        oninput="filterClinics()" />
      <div id="manualLocation">
        <label>Enter Specific Location:</label>
        <input type="text" id="locationInput" placeholder="City or address" />
        <button onclick="manualSearch()">Search</button>
      </div>
    </div>
  </div>

  <div class="clinic-list-container">
    <div class="clinic-list">
      <div id="clinics"></div>
    </div>
  </div>

  <div class="background-clinic">
    <img src="img/car-bg.svg" alt="">
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
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  <script src="assets/js/maps.js" defer></script>
  <script src="assets/js/alarm-reminder.js" defer></script>
  <script src="assets/js/auto-break-notification.js"></script>

  <script
    async
    defer
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCnku3I6HSOGz1uqlo-_eUm13_hwS9DxAw&libraries=places"></script>
</body>

</html>