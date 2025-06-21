function toggleCustomDisease(value) {
  const container = document.getElementById("custom-disease-container");
  container.style.display = value === "Others" ? "block" : "none";
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("health-form");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    Swal.fire({
      title: "Submit your info?",
      text: "You can edit it later.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, submit it",
    }).then((result) => {
      if (result.isConfirmed) {
        form.submit();
      }
    });
  });
});
