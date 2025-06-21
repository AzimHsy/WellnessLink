let glassesTaken = parseInt(localStorage.getItem("glassesTaken")) || 0;
const maxGlasses = 8;

const svgWater = document.querySelector(".water-fill");
const progressFill = document.querySelector(".progress-fill");
const glassesText = document.getElementById("glasses-taken");
const remainingText = document.getElementById("glasses-remaining");
const addGlassBtn = document.getElementById("add-glass");
const resetGlassBtn = document.getElementById("reset-glass"); // ✅ Move this up

// 🗓️ Reset logic (disabled for now during debugging)
if (false) {
  const today = new Date().toLocaleDateString();
  const lastRecordedDate = localStorage.getItem("lastRecordedDate");

  if (lastRecordedDate !== today) {
    glassesTaken = 0;
    localStorage.setItem("lastRecordedDate", today);
    localStorage.setItem("glassesTaken", glassesTaken);
  }
}

// ✅ Add Reset Button Listener
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
      localStorage.setItem("glassesTaken", glassesTaken);
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

// ✅ Now it's safe to call UI update
updateUI();

addGlassBtn.addEventListener("click", () => {
  if (glassesTaken >= maxGlasses) return;

  glassesTaken++;
  localStorage.setItem("glassesTaken", glassesTaken);
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

function updateUI() {
  const ratio = glassesTaken / maxGlasses;
  svgWater.setAttribute("y", 1496 - 1496 * ratio);
  progressFill.style.width = `${ratio * 100}%`;

  glassesText.textContent = `${glassesTaken} glasses taken`;
  remainingText.textContent = `remaining glasses : ${
    maxGlasses - glassesTaken
  }`;

  saveWaterIntake();

  addGlassBtn.disabled = glassesTaken >= maxGlasses;

  addGlassBtn.textContent =
    glassesTaken >= maxGlasses ? "Goal Completed!" : "Add Glass";

  resetGlassBtn.disabled = glassesTaken === 0;
  resetGlassBtn.style.opacity = glassesTaken === 0 ? "0.5" : "1";
  resetGlassBtn.style.cursor = glassesTaken === 0 ? "not-allowed" : "pointer";
}

function saveWaterIntake() {
  fetch("save_water.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `glasses_taken=${glassesTaken}`,
  });
}
