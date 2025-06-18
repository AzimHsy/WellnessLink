// 💧 Water Intake Bar Chart
const waterLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const waterData = [5, 8, 7, 6, 9, 4, 7];

const waterCtx = document.getElementById("waterChart").getContext("2d");
new Chart(waterCtx, {
  type: "bar",
  data: {
    labels: waterLabels,
    datasets: [
      {
        label: "Glasses of Water",
        data: waterData,
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

// Sleep Charts
const sleepCtx = document.getElementById("sleepChart").getContext("2d");
const sleepPercent = 72;

document.getElementById("sleepPercent").textContent = sleepPercent + "%";

new Chart(sleepCtx, {
  type: "doughnut",
  data: {
    labels: ["Good Sleep", "Remaining"],
    datasets: [
      {
        data: [sleepPercent, 100 - sleepPercent],
        backgroundColor: ["#5cb85c", "#e0e0e0"],
        borderWidth: 1,
      },
    ],
  },
  options: {
    cutout: "72%",
    plugins: {
      legend: {
        display: true, // ✅ Turn it on
        position: "bottom", // ✅ Place it below the chart
      },
      tooltip: { enabled: true },
    },
  },
});
