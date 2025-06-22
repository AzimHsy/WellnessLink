// ✅ Make sure Chart.js is loaded before this script runs
console.log("Dashboard JS loaded");

fetch("get-weekly-data.php")
  .then((res) => res.json())
  .then((data) => {
    if (!Array.isArray(data)) {
      console.error("Unexpected data format:", data);
      return;
    }
    console.log("Fetched data:", data);

    // 🗓️ Format dates to weekday names
    const raw = data.map((item) => {
      const date = new Date(item.date);
      const day = date.toLocaleDateString("en-US", { weekday: "short" }); // 'Mon', 'Tue'...
      return { day, value: item.glasses_taken };
    });

    // 🧠 Ensure all 7 days are shown
    const fullWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weekMap = new Map(raw.map((d) => [d.day, d.value]));
    const labels = fullWeek;
    const values = fullWeek.map((day) => weekMap.get(day) || 0);

    // 🖌️ Draw chart
    renderWaterChart(labels, values);
  })
  .catch((err) => {
    console.error("Error fetching weekly water data:", err);
  });

function renderWaterChart(labels, values) {
  const ctx = document.getElementById("waterChart");

  if (!ctx) {
    console.error("Canvas with id='waterChart' not found.");
    return;
  }

  new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Glasses of Water",
          data: values,
          backgroundColor: "#29b6f6",
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 10,
        },
      },
    },
  });
}

// BMI Charts
const bmiCtx = document.getElementById("bmiChart").getContext("2d");

const bmiChart = new Chart(bmiCtx, {
  type: "line",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], // Replace with actual months or dates
    datasets: [
      {
        label: "BMI",
        data: [23.4, 23.1, 22.9, 22.7, 22.5, 22.2], // Replace with actual BMI values
        borderColor: "#0275d8",
        backgroundColor: "rgba(2, 117, 216, 0.2)",
        fill: true,
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: "BMI Value",
        },
      },
      x: {
        // title: {
        //   display: true,
        //   //   text: "Month",
        // },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        enabled: true,
      },
    },
  },
});

// 💊 Medication Doughnut Chart
const takenDays = 5;
const skippedDays = 2;
const adherence = Math.round((takenDays / 7) * 100);
document.getElementById("medPercent").textContent = adherence + "%";

const medCtx = document.getElementById("medChart").getContext("2d");
new Chart(medCtx, {
  type: "doughnut",
  data: {
    labels: ["Taken", "Skipped"],
    datasets: [
      {
        data: [takenDays, skippedDays],
        backgroundColor: ["#4caf50", "#e74c3c"],
        borderWidth: 0,
      },
    ],
  },
  options: {
    cutout: "75%",
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.raw} day(s)`,
        },
      },
    },
  },
});

document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;
  const updateSuccess = body.getAttribute("data-update-success");
  const editBtn = document.getElementById("edit-btn");
  const editCard = document.querySelector(".edit-card-holder");
  const cancelBtn = document.getElementById("cancel-edit");

  if (updateSuccess === "1") {
    Swal.fire({
      icon: "success",
      title: "Updated!",
      text: "Your health record has been successfully updated.",
      confirmButtonColor: "#3085d6",
      timer: 2000,
      showConfirmButton: false,
    });
  }

  const diseaseSelect = document.getElementById("disease-select");
  diseaseSelect.addEventListener("change", function () {
    const container = document.getElementById("custom-disease-container");
    container.style.display = this.value === "Others" ? "block" : "none";
  });

  editBtn.addEventListener("click", () => {
    editCard.style.display = "flex";
    document.body.style.overflow = "hidden";
    editCard.scrollIntoView({ behavior: "smooth" });

    gsap.to(".edit-card", {
      duration: 1,
      y: 0,
      opacity: 1,
      scale: 1,
      ease: "bounce.out",
    });

    gsap.fromTo(
      ".edit-card-holder",
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: "power1.out" }
    );
  });

  // Reset initial states before animation
  gsap.set(".edit-card", { opacity: 0, scale: 0.85 });

  cancelBtn.addEventListener("click", () => {
    // Animate out
    gsap.to(".edit-card", {
      duration: 0.3,
      opacity: 0,
      scale: 0.85,
      ease: "power2.in",
      onComplete: () => {
        // Only hide after animation completes
        editCard.style.display = "none";
        document.body.style.overflowY = "auto";
      },
    });
  });
});
