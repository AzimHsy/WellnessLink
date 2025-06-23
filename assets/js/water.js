const initialInput = document.getElementById("initial-glasses");
const initialGlasses = parseInt(initialInput.value) || 0;
const userId = initialInput.dataset.userid;
const storageKey = `glassesTaken_${userId}`;

let glassesTaken = localStorage.getItem(storageKey);

// If no localStorage for this user, use server value and store it
if (glassesTaken === null || isNaN(parseInt(glassesTaken))) {
  glassesTaken = initialGlasses;
  localStorage.setItem(storageKey, glassesTaken);
} else {
  glassesTaken = parseInt(glassesTaken);
}

const maxGlasses = 8;

const svgWater = document.querySelector(".water-fill");
const progressFill = document.querySelector(".progress-fill");
const glassesText = document.getElementById("glasses-taken");
const remainingText = document.getElementById("glasses-remaining");
const addGlassBtn = document.getElementById("add-glass");
const resetGlassBtn = document.getElementById("reset-glass");

// ✅ Daily Reset Logic: resets every new day (based on local date)
const today = new Date().toLocaleDateString();
const lastRecordedDateKey = `lastRecordedDate_${userId}`;
const lastRecordedDate = localStorage.getItem(lastRecordedDateKey);

if (lastRecordedDate !== today) {
  glassesTaken = 0;
  localStorage.setItem(lastRecordedDateKey, today);
  localStorage.setItem(storageKey, glassesTaken);
}

// 🔄 Reset Button
resetGlassBtn.addEventListener("click", () => {
  Swal.fire({
    title: "Reset Water Intake?",
    text: "Are you sure you want to reset your water intake for today?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, reset it!",
    cancelButtonText: "No, keep it",
  }).then((result) => {
    if (result.isConfirmed) {
      glassesTaken = 0;
      updateUI();

      Swal.fire({
        title: "Reset!",
        text: "Your water intake has been reset.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  });
});

// ➕ Add Glass Button
addGlassBtn.addEventListener("click", () => {
  if (glassesTaken >= maxGlasses) return;

  glassesTaken++;
  updateUI();

  if (glassesTaken === maxGlasses) {
    addGlassBtn.disabled = true;

    Swal.fire({
      title: "Great job!",
      text: "You've completed your water goal for today!",
      icon: "success",
      confirmButtonText: "OK",
    });
  }
});

// 📊 Update UI
function updateUI() {
  const ratio = glassesTaken / maxGlasses;
  svgWater.setAttribute("y", 1496 - 1496 * ratio);
  progressFill.style.width = `${ratio * 100}%`;

  glassesText.textContent = `${glassesTaken} glasses taken`;
  remainingText.textContent = `remaining glasses : ${
    maxGlasses - glassesTaken
  }`;

  // Save to localStorage per user
  localStorage.setItem(storageKey, glassesTaken);

  // Save to database
  saveWaterIntake();

  // Button states
  if (glassesTaken >= maxGlasses) {
    addGlassBtn.disabled = true;
    addGlassBtn.textContent = "Goal Completed!";
    addGlassBtn.classList.add("goal-completed");

    // Notify backend that user completed water goal
    fetch("add-notification.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `title=Water Goal Completed&message=You’ve completed your 8-glass water intake today!`,
    });
  } else {
    addGlassBtn.disabled = false;
    addGlassBtn.textContent = "Add Glass";
    addGlassBtn.classList.remove("goal-completed");
  }

  resetGlassBtn.disabled = glassesTaken === 0;
  resetGlassBtn.style.opacity = glassesTaken === 0 ? "0.5" : "1";
  resetGlassBtn.style.cursor = glassesTaken === 0 ? "not-allowed" : "pointer";
}

// 💾 Save to database
function saveWaterIntake() {
  fetch("save-water.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `glasses_taken=${glassesTaken}`,
  });
}

const healthTips = [
  "Stay hydrated for better health.",
  "Drink water before you feel thirsty.",
  "Water helps maintain energy and focus.",
  "Hydration supports kidney function.",
  "Start your morning with a glass of water.",
  "Replace sugary drinks with water.",
  "Eat fruits high in water like watermelon.",
];

let tipIndex = 0;
const tipElement = document.getElementById("health-tip-text");

// ✅ Show first tip immediately
tipElement.textContent = healthTips[tipIndex];
tipIndex = (tipIndex + 1) % healthTips.length;

function showNextTip() {
  // Fade out
  gsap.to(tipElement, {
    opacity: 0,
    duration: 0.5,
    onComplete: () => {
      // Change text
      tipElement.textContent = healthTips[tipIndex];
      tipIndex = (tipIndex + 1) % healthTips.length;

      // Fade in
      gsap.to(tipElement, {
        opacity: 1,
        duration: 0.5,
      });
    },
  });
}

// ✅ Change every 3 seconds
setInterval(showNextTip, 5000);

updateUI();
