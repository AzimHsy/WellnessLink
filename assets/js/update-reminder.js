document.querySelectorAll(".edit-btn").forEach((btn) => {
  btn.addEventListener("click", function (e) {
    e.preventDefault();

    const row = btn.closest("tr");

    const id = btn.dataset.id;
    const name = row.children[1].textContent;
    const dosage = row.children[2].textContent.split(" ")[0];
    const dosageType = row.children[2].textContent.split(" ")[1];
    const time = row.children[3].textContent;

    Swal.fire({
      title: "Edit Reminder",
      html: `
    <form id="editForm">
    <div>
        <input type="hidden" id="reminder-id" value="${id}">
        <p>Medication Name:</p>
        <input type="text" id="medic-name" class="swal2-input" value="${name}" required>
    </div>
    <div>
       <p>Dosage:</p>
       <input type="number" id="dosage" class="swal2-input" value="${dosage}" required>
    </div>
    <div>
       <p>Dosage Type:</p>
            <select id="dosage-type" class="swal2-input" name="dosage-type" required>
                <option disabled selected>Select unit</option>
                <option value="mg">mg</option>
                <option value="ml">ml</option>
                <option value="tablet">tablet</option>
                <option value="capsule">capsule</option>
            </select>
    </div>
    <div>             
        <p>Time:</p>
        <input type="time" id="reminder-time" class="swal2-input" value="${convertTo24Hour(
          time
        )}" required></div>
    </form> `,
      showCancelButton: true,
      confirmButtonText: "Save Changes",
      focusConfirm: false,
      preConfirm: () => {
        const name = document.getElementById("medic-name").value.trim();
        const dosage = document.getElementById("dosage").value;
        const dosageType = document.getElementById("dosage-type").value.trim();
        const time = document.getElementById("reminder-time").value;
        const id = document.getElementById("reminder-id").value;

        if (!name || !dosage || !dosageType || !time || !id) {
          Swal.showValidationMessage("All fields are required.");
          return false;
        }

        return { id, name, dosage, dosageType, time };
      },
    }).then((result) => {
      if (!result.isConfirmed) return;

      fetch("http://localhost/wellnesslink/update-reminder.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.value),
      })
        .then((res) => {
          if (!res.ok) throw new Error("HTTP error " + res.status);
          return res.json();
        })
        .then((data) => {
          console.log("PHP responded:", data);
          if (data.success) {
            Swal.fire("Updated!", "Reminder has been updated.", "success").then(
              () => location.reload()
            );
          } else {
            Swal.fire("Error", data.error || "Update failed.", "error");
          }
        })
        .catch((err) => {
          console.error("Fetch failed:", err);
          Swal.fire("Error", "Could not contact the server.", "error");
        });
    });
  });
});

function convertTo24Hour(time12h) {
  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":");

  if (modifier === "PM" && hours !== "12") {
    hours = parseInt(hours) + 12;
  }
  if (modifier === "AM" && hours === "12") {
    hours = "00";
  }
  return `${hours}:${minutes}`;
}
