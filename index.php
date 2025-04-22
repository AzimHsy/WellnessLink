<?php 

session_start();

$errors = [
  'login' => $_SESSION['login_error'] ?? '',
  'register' => $_SESSION['register_error'] ?? ''
];

$success = $_SESSION['register_success'] ?? '';

$activeForm = $_SESSION['active_form'] ?? 'login';

session_unset();

function showSuccess($success) {
  return !empty($success) ? "<p class='success-message'>$success</p>" : '';
}

function showError($error,) {
  return !empty($error) ? "<p class='error-message'>$error</p>" : '';
}

function isActiveForm ($formName, $activeForm) {
  return $formName === $activeForm ? 'active' : '';
}

?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="assets/css/style.css">
    <title>Wellness-Link</title>
  </head>
  <body class="<?php echo isset($_SESSION['form_mode']) && $_SESSION['form_mode'] == 'sign-up' ? 'sign-up-mode' : ''; ?>">
    <div class="container">
      <div class="forms-container">
        <div class="signin-signup"  >
          <form action="login-register.php" class="sign-in-form" method="post">
            <h2 class="title">Sign in</h2>
            <?= showError($errors['login']); ?>
            <div class="input-field">
              <i class="bx bxs-envelope"></i>
              <input type="email" name="email" placeholder="Email" />
            </div>
            <div class="input-field">
              <i class="bx bxs-lock"></i>
              <input type="password" name="password" placeholder="Password" />
            </div>
            <input type="submit" name="login" value="Login" class="btn solid" />
            <p class="social-text">Or Sign in with social platforms</p>
            <div class="social-media">
              <a href="#" class="social-icon">
                <i class="bx bxl-facebook"></i>
              </a>
              <a href="#" class="social-icon">
                <i class="bx bxl-twitter"></i>
              </a>
              <a href="#" class="social-icon">
                <i class="bx bxl-google"></i>
              </a>
              <a href="#" class="social-icon">
                <i class="bx bxl-linkedin"></i>
              </a>
            </div>
          </form>
          <form action="login-register.php" class="sign-up-form" method="post" <?= isActiveForm('register', $activeForm); ?>>
            <h2 class="title">Sign up</h2>
            <?= showError($errors['register']); ?>
            <?= showSuccess($success); ?>
            <div class="input-field">
              <i class="bx bxs-user"></i>
              <input type="text" name="username" placeholder="Username" />
            </div>
            <div class="input-field">
              <i class="bx bxs-envelope"></i>
              <input type="email" name="email" placeholder="Email" />
            </div>
            <div class="input-field">
              <i class="bx bxs-lock"></i>
              <input type="password" name="password" placeholder="Password" />
            </div>
            <input type="submit" name="register" id="sign-up-register" class="btn" value="Sign up" />
            <p class="social-text">Or Sign up with social platforms</p>
            <div class="social-media">
              <a href="#" class="social-icon">
                <i class="bx bxl-facebook"></i>
              </a>
              <a href="#" class="social-icon">
                <i class="bx bxl-twitter"></i>
              </a>
              <a href="#" class="social-icon">
                <i class="bx bxl-google"></i>
              </a>
              <a href="#" class="social-icon">
                <i class="bx bxl-linkedin"></i>
              </a>
            </div>
          </form>
        </div>
      </div>

      <div class="panels-container">
        <div class="panel left-panel">
          <div class="content">
            <h3>Welcome to Wellness-Link !</h3>
            <p>Don't have an account ?</p>
            <button class="btn transparent" id="sign-up-btn">Sign up</button>
          </div>
          <img src="img/log.svg" class="image" alt="" />
        </div>
        <div class="panel right-panel">
          <div class="content">
            <h3>Welcome back !</h3>
            <p>Already have an account ?</p>
            <button class="btn transparent" id="sign-in-btn">Sign in</button>
          </div>
          <img src="img/register.svg" class="image" alt="" />
        </div>
      </div>
    </div>
    <script src="assets/js/app.js"></script>
    
  </body>
</html>
