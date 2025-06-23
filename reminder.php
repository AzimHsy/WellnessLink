    <?php
    require 'database/config.php';
    session_start();

    if (!isset($_SESSION['email'])) {
        header("Location: index.php");
        exit();
    }

    if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['medic-name'])) {
        $name = $conn->real_escape_string(trim($_POST['medic-name']));
        $dosage = intval($_POST['dosage']);
        $dosageType = $conn->real_escape_string(trim($_POST['dosage-type']));
        $reminderTime = $conn->real_escape_string($_POST['reminder-time']);
        $repeatType = $conn->real_escape_string($_POST['repeat']);

        // ✅ Get user_id from email
        $email = $_SESSION['email'];
        $userResult = $conn->query("SELECT id FROM users WHERE email = '$email'");
        $user = $userResult->fetch_assoc();
        $user_id = $user['id'];

        $stmt = $conn->prepare("INSERT INTO reminders (user_id, medication_name, dosage, dosage_type, reminder_time, repeat_type) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("isisss", $user_id, $name, $dosage, $dosageType, $reminderTime, $repeatType);

        if ($stmt->execute()) {
            $_SESSION['reminder_added'] = true;
            header("Location: reminder.php");
            exit;
        } else {
            echo "Failed to insert reminder.";
        }

        $stmt->close();
    }


    if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['delete_id'])) {
        $delete_id = intval($_POST['delete_id']);
        $stmt = $conn->prepare("DELETE FROM reminders WHERE id = ?");
        $stmt->bind_param("i", $delete_id);

        if ($stmt->execute()) {
            $_SESSION['reminder_deleted'] = true;
            header("Location: reminder.php");
            exit;
        } else {
            echo "Failed to delete reminder.";
        }

        $stmt->close();
    }


    ?>

    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Medication Reminder</title>
        <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
        <!-- Letak File CSS kat sini, Buat File Lain -->
        <link rel="stylesheet" href="assets/css/interface.css" />
        <link rel="stylesheet" href="assets/css/reminder.css" />
        <script src="https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs" type="module"></script>
    </head>

    <body>
        <!-- Navbar -->
        <?php include 'includes/navbar.php'; ?>
        <?php include 'includes/notification-box.php'; ?>

        <!-- Reminder Sections -->
        <div class="card-container">
            <div class="card">
                <div class="card-content">
                    <div class="heading">
                        <h1>Medication Reminder</h1>
                    </div>
                    <form id="reminder-form" action="reminder.php" method="POST">
                        <!-- Medication Name -->
                        <input type="text" placeholder="Medication Name" id="medic-name" name="medic-name" required>

                        <!-- Dosage Input -->
                        <div class="dosage-holder">
                            <input type="number" id="dosage" name="dosage" placeholder="Dosage" min="1" required>
                            <select id="dosage-type" name="dosage-type" required>
                                <option value="" disabled selected>Select unit</option>
                                <option value="mg">mg</option>
                                <option value="ml">ml</option>
                                <option value="tablet">tablet</option>
                                <option value="capsule">capsule</option>
                            </select>
                        </div>

                        <!-- Time and Repeat -->
                        <div class="time-holder" id="repeat-container">
                            <input type="time" id="reminder-time" name="reminder-time" required>
                            <select id="repeat" name="repeat" required>
                                <option selected value="once">Once</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                            </select>
                        </div>
                        <button type="submit" id="set-reminder-btn">
                            <span>Set Reminder</span>
                        </button>
                    </form>

                    <!-- Illustration -->
                    <div class="svg-holder">
                        <img src="img/reminder.svg" alt="">
                    </div>
                </div>
            </div>
        </div>

        <!-- Active Reminders Table -->
        <div class="reminders-table-section">
            <h2 class="table-heading">Active Reminders</h2>
            <table class="reminders-table">
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Medication Name</th>
                        <th>Dosage</th>
                        <th>Time</th>
                        <th>Repeat</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <?php
                require 'database/config.php';

                $email = $_SESSION['email'];
                $userResult = $conn->query("SELECT id FROM users WHERE email = '$email'");
                $user = $userResult->fetch_assoc();
                $user_id = $user['id'];

                $sql = "SELECT * FROM reminders WHERE user_id = $user_id ORDER BY reminder_time ASC";

                $result = $conn->query($sql);
                $no = 1;

                if ($result->num_rows > 0) {
                    while ($row = $result->fetch_assoc()) {
                        echo "<tr data-repeat='{$row['repeat_type']}'>
                                <td>{$no}</td>
                                <td>{$row['medication_name']}</td>
                                <td>{$row['dosage']} {$row['dosage_type']}</td>
                                <td>" . date("g:i A", strtotime($row['reminder_time'])) . "</td>
                                <td><span class='repeat-label repeat-{$row['repeat_type']}'>" . ucfirst($row['repeat_type']) . "</span></td>
                                <td>
                                    <button class='edit-btn' data-id='" . $row['id'] . "' type='button'>Edit</button>
                                    <form method='POST' action='reminder.php' class='delete-form' style='display:inline-block;'>
                                        <input type='hidden' name='delete_id' value='{$row['id']}'>
                                        <button class='delete-btn' type='submit' name='delete'>Delete</button>
                                    </form>
                                </td>
                            </tr>";
                        $no++;
                    }
                } else {
                    echo "<tr><td colspan='6'>No reminders yet.</td></tr>";
                }

                $conn->close();
                ?>

            </table>
        </div>

        <div class="edit-modal hidden">
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="manual-heading">
                    <h1>Edit Reminder</h1>
                </div>
                <form id="manualEditForm">
                    <div>
                        <input type="hidden" id="manual-id">
                        <label>Name:</label>
                        <input type="text" id="manual-name" required>
                    </div>

                    <div>
                        <label>Dosage:</label>
                        <input type="number" min="1" id="manual-dosage" required>
                    </div>

                    <div>
                        <label>Type:</label>
                        <select id="manual-dosage-type" name="dosage-type" required>
                            <option value="" disabled selected>Select unit</option>
                            <option value="mg">mg</option>
                            <option value="ml">ml</option>
                            <option value="tablet">tablet</option>
                            <option value="capsule">capsule</option>
                        </select>
                    </div>

                    <div>
                        <label>Time:</label>
                        <input type="time" id="manual-time" required>
                    </div>

                    <div>
                        <label>Repeat:</label>
                        <select id="manual-repeat" required>
                            <option value="once">Once</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                        </select>
                    </div>

                    <div class="manual-btn">
                        <button type="submit">
                            <span>Save</span>
                        </button>
                        <button type="button" id="close-modal">
                            <span>Cancel</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <div class="bg-reminder">
            <div class="bg-reminder-holder">
                <img src="img/reminder-bg.svg" alt="">
                <img src="img/reminder-bg-2.svg" alt="">
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
        <script src="assets/js/reminder.js" defer></script>
        <script src="assets/js/alarm-reminder.js" defer></script>
        <script src="assets/js/auto-break-notification.js"></script>

        <script>
            window.reminderFlags = {
                added: <?php echo isset($_SESSION['reminder_added']) ? 'true' : 'false'; ?>,
                updated: <?php echo isset($_SESSION['reminder_updated']) ? 'true' : 'false'; ?>,
                deleted: <?php echo isset($_SESSION['reminder_deleted']) ? 'true' : 'false'; ?>
            };
        </script>
        <?php
        unset($_SESSION['reminder_added']);
        unset($_SESSION['reminder_updated']);
        unset($_SESSION['reminder_deleted']);
        ?>
    </body>

    </html>