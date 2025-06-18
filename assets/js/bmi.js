document
  .getElementById("bmi-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const height = parseFloat(document.getElementById("height").value) / 100; // convert cm to meters
    const weight = parseFloat(document.getElementById("weight").value);

    if (!height || !weight) {
      alert("Please fill in all fields correctly.");
      return;
    }

    const bmi = (weight / (height * height)).toFixed(1);
    let message = "";

    if (bmi < 18.5) {
      message = "( Underweight )";
    } else if (bmi >= 18.5 && bmi < 24.9) {
      message = "( Normal Weight )";
    } else if (bmi >= 25 && bmi < 29.9) {
      message = "( Overweight )";
    } else {
      message = "( Obese )";
    }

    document.getElementById(
      "result"
    ).innerHTML = `<h4 class="bmi-result">Your BMI: ${bmi} <br> ${message}</h4>`;
  });
