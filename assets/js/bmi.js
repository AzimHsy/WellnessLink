document
  .getElementById("bmi-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const height = parseFloat(document.getElementById("height").value) / 100; // convert cm to meters
    const weight = parseFloat(document.getElementById("weight").value);
    const age = parseInt(document.getElementById("age").value);
    const gender = document.querySelector('input[name="gender"]:checked');

    if (!height || !weight || !age || !gender) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Input",
        text: "Please fill in all fields correctly.",
      });
      return;
    }

    const bmi = (weight / (height * height)).toFixed(1);
    let category = "";
    let color = "";
    let advice = "";

    if (bmi < 18.5) {
      category = "Underweight";
      color = "#00bcd4"; // blue
      advice =
        "Consider a balanced diet with healthy fats and protein. You may want to consult a nutritionist for weight gain strategies.";
    } else if (bmi >= 18.5 && bmi <= 22.9) {
      category = "Normal Weight";
      color = "#4caf50"; // green
      advice =
        "Great job! Keep maintaining a healthy lifestyle with regular exercise and a balanced diet.";
    } else if (bmi >= 23 && bmi <= 24.9) {
      category = "Overweight";
      color = "#ff9800"; // orange
      advice =
        "Try incorporating more physical activity into your routine and monitor your eating habits. Small changes can lead to big results!";
    } else {
      category = "Obese";
      color = "#f44336"; // red
      advice =
        "It’s advisable to consult with a healthcare provider. Focus on a sustainable weight-loss plan involving exercise and healthier eating.";
    }

    Swal.fire({
      title: `<span style="color:${color}">Your BMI is ${bmi}</span>`,
      html: `
    <h3 style="color:${color}; margin-bottom: 10px;">${category}</h3>
    <p style="font-size: 1rem; color: #333;">${advice}</p>
  `,
      icon: "info",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Save to Dashboard",
      cancelButtonText: "Close",
      confirmButtonColor: color,
      cancelButtonColor: "#aaa",
      preConfirm: () => {
        return fetch("save-bmi.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `bmi=${bmi}&category=${encodeURIComponent(category)}`,
        })
          .then((res) => res.json())
          .then((data) => {
            if (!data.success) {
              throw new Error(data.message || "Save failed.");
            }
          })
          .catch((error) => {
            Swal.showValidationMessage(`Save failed: ${error}`);
          });
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "Saved!",
          text: "Your BMI has been saved to the dashboard.",
          confirmButtonColor: color,
        });
      }
    });
  });
