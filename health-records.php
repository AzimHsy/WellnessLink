    <?php
    session_start();
    require_once 'database/config.php';

    if (!isset($_SESSION['username'])) {
        header("Location: index.php");
        exit();
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $disease = $_POST['disease'] === 'Others' ? $_POST['custom_disease'] : $_POST['disease'];
        $medication_name = $_POST['medication_name'];
        $frequency = $_POST['frequency'];
        $allergies = $_POST['allergies'];
        $bmi = "Not Provided";

        // Get user ID
        $email = $_SESSION['email'];
        $userResult = $conn->query("SELECT id FROM users WHERE email = '$email'");
        $user = $userResult->fetch_assoc();
        $user_id = $user['id'];

        // Insert/update logic
        $check = $conn->query("SELECT id FROM health_records WHERE user_id = $user_id");
        if ($check->num_rows > 0) {
            $conn->query("UPDATE health_records SET disease='$disease', medication_name='$medication_name', frequency='$frequency', allergies='$allergies', bmi='$bmi' WHERE user_id=$user_id");
        } else {
            $conn->query("INSERT INTO health_records (user_id, disease, medication_name, frequency, allergies, bmi) VALUES ($user_id, '$disease', '$medication_name', '$frequency', '$allergies', '$bmi')");
        }

        echo "CURRENT SESSION user_id: " . $_SESSION['user_id'];


        header("Location: dashboard.php");
        exit();
    }
    ?>


    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <link rel="stylesheet" href="assets/css/interface.css">
        <link rel="stylesheet" href="assets/css/records.css">
        <script src="https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs" type="module"></script>
    </head>

    <body>

        <div class="records-container">
            <div class="lottie-anim-holder">
                <dotlottie-player
                    src="https://lottie.host/eb860977-3e52-4c45-91c8-4f115892b9b6/Ql5shUZY6p.lottie"
                    background="transparent"
                    speed="1"
                    loop
                    autoplay></dotlottie-player>
            </div>

            <div class="form-container">
                <div class="heading">
                    <h1>Welcome <span><?php echo htmlspecialchars($_SESSION['username']); ?>,</span> Please fill in your details before we get started.</h1>
                </div>
                <div class="records-card">
                    <form id="health-form" action="health-records.php" method="POST">
                        <div class="input-type">
                            <label>Disease</label>
                            <select name="disease" id="disease-select" required onchange="toggleCustomDisease(this.value)">
                                <option value="" disabled selected>Select Disease</option>
                                <option>Type 2 Diabetes</option>
                                <option>Hypertension</option>
                                <option>Asthma</option>
                                <option>High Cholesterol</option>
                                <option>Heart Disease</option>
                                <option>Arthritis</option>
                                <option>Depression</option>
                                <option>Thyroid Disorder</option>
                                <option>Chronic Kidney Disease</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>

                        <div class="input-type" id="custom-disease-container">
                            <label>Specify Other Disease</label>
                            <input type="text" name="custom_disease" id="custom-disease" placeholder="Enter disease name">
                        </div>

                        <div class="input-type">
                            <label>Medication Name</label>
                            <input type="text" name="medication_name" required>
                        </div>
                        <div class="input-type">
                            <label>Medication Frequency</label>
                            <select name="frequency" required>
                                <option value="" disabled selected>Choose Frequency</option>
                                <option>Once daily</option>
                                <option>Two times daily</option>
                                <option>Three times daily</option>
                                <option>Before meals</option>
                                <option>After meals</option>
                                <option>Every 8 hours</option>
                                <option>As needed</option>
                            </select>
                        </div>
                        <div class="input-type">
                            <label>Allergies / Alerts</label>
                            <input type="text" name="allergies" required>
                        </div>
                        <div class="records-btn">
                            <button type="submit" name="submit_form">
                                <span>Submit</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <script src="assets/js/records.js" defer></script>
        <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    </body>

    </html>