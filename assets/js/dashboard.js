fetch("get-weekly-water.php?t=" + new Date().getTime())
  .then((res) => res.json())
  .then((data) => {
    if (!Array.isArray(data)) {
      console.error("Unexpected data format:", data);
      return;
    }
    const today = new Date();

    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(today.getDate() - (6 - i));
      return {
        day: d.toLocaleDateString("en-US", { weekday: "short" }), // e.g. "Mon"
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }), // e.g. "Jun 20"
        fullDate:
          d.getFullYear() +
          "-" +
          String(d.getMonth() + 1).padStart(2, "0") +
          "-" +
          String(d.getDate()).padStart(2, "0"),
      };
    });

    // 🧠 Map API result into a map with fullDate as key
    const dataMap = new Map(
      data.map((item) => [item.date, item.glasses_taken])
    );

    const labels = last7Days.map((d) => d.day);
    const values = last7Days.map((d) => dataMap.get(d.fullDate) || 0);
    const tooltipDates = last7Days.map((d) => d.date);

    toggleChartOverlay("waterChart", values);
    renderWaterChart(labels, values, tooltipDates);
  })
  .catch((err) => {
    console.error("Error fetching weekly water data:", err);
  });

function renderWaterChart(labels, values, tooltipDates) {
  const ctx = document.getElementById("waterChart");
  if (!ctx) return;

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
          tooltipDates, // attach custom date array to the dataset
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 8,
          title: {
            display: true,
            text: "Glasses",
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const glasses = ctx.raw;
              const date = ctx.dataset.tooltipDates[ctx.dataIndex]; // get date from custom array
              return `${glasses} glass(es) on ${date}`;
            },
          },
        },
      },
    },
  });
}

// ====== BMI Charts
fetch("get-bmi-trend.php")
  .then((res) => res.json())
  .then((data) => {
    const labels = data.map((item) =>
      new Date(item.date).toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      })
    );
    const values = data.map((item) => parseFloat(item.bmi));

    toggleChartOverlay("bmiChart", values);
    const bmiCtx = document.getElementById("bmiChart").getContext("2d");
    new Chart(bmiCtx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "BMI",
            data: values,
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
        },
        plugins: {
          legend: {
            display: true,
            position: "top",
          },
        },
      },
    });
  });

// Medication Doughnut Chart
fetch("get-medication-adherence.php")
  .then((res) => res.json())
  .then((data) => {
    const takenDays = data.filter((d) => d.taken == 1).length;
    const skippedDays = data.filter((d) => d.taken == 0).length;
    const adherence = Math.round((takenDays / 7) * 100);

    document.getElementById("medPercent").textContent = adherence + "%";

    toggleChartOverlay("medChart", [takenDays, skippedDays]);
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
  });

function toggleChartOverlay(chartId, valuesArray) {
  const overlay = document
    .querySelector(`#${chartId}`)
    .closest(".chart-box")
    .querySelector(".chart-overlay");
  const hasData =
    Array.isArray(valuesArray) && valuesArray.some((v) => parseFloat(v) > 0);
  if (!hasData) {
    overlay.style.opacity = "1";
  } else {
    overlay.style.opacity = "0";
  }
}

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

  gsap.set(".edit-card", { opacity: 0, scale: 0.85 });

  cancelBtn.addEventListener("click", () => {
    // Animate out
    gsap.to(".edit-card", {
      duration: 0.3,
      opacity: 0,
      scale: 0.85,
      ease: "power2.in",
      onComplete: () => {
        editCard.style.display = "none";
        document.body.style.overflowY = "auto";
      },
    });
  });

  const headerTips = [
    "Stay active for at least 30 minutes each day.",
    "Eat a balanced diet full of fruits and veggies.",
    "Sleep at least 7–9 hours every night.",
    "Avoid excessive sugar and processed foods.",
    "Take breaks and stretch during long screen time.",
    "Practice deep breathing to manage stress.",
    "Stay consistent with your wellness habits.",
  ];

  let headerTipIndex = 0;
  const headerTipElement = document.getElementById("header-health-tip");

  // Show the first tip
  headerTipElement.textContent = headerTips[headerTipIndex];
  headerTipIndex = (headerTipIndex + 1) % headerTips.length;

  function updateHeaderTip() {
    gsap.to(headerTipElement, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        headerTipElement.textContent = headerTips[headerTipIndex];
        headerTipIndex = (headerTipIndex + 1) % headerTips.length;
        gsap.to(headerTipElement, {
          opacity: 1,
          duration: 0.5,
        });
      },
    });
  }

  setInterval(updateHeaderTip, 5000);

  document.getElementById("deleteAccountBtn").addEventListener("click", () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Your account and all data will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch("delete-account.php", {
          method: "POST",
        })
          .then((res) => res.text())
          .then((data) => {
            Swal.fire(
              "Deleted!",
              "Your account has been deleted.",
              "success"
            ).then(() => {
              window.location.href = "index.php"; // Redirect to homepage or login
            });
          });
      }
    });
  });
});
