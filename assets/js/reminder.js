document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".delete-form").forEach((form) => {
    let allowSubmit = false;

    form.addEventListener("submit", function (e) {
      if (!allowSubmit) {
        e.preventDefault();
        Swal.fire({
          title: "Are you sure you want to delete this reminder?",
          icon: "warning",
          showDenyButton: true,
          confirmButtonText: "Yes, delete it",
          confirmButtonColor: "#32a7c2",
          denyButtonText: "Cancel",
        }).then((result) => {
          if (result.isConfirmed) {
            allowSubmit = true;
            form.requestSubmit();
          } else if (result.isDenied) {
            Swal.fire("Reminder not deleted", "", "info");
          }
        });
      }
    });
  });

  const modal = document.querySelector(".edit-modal");
  const modalContent = document.querySelector(".modal-content");

  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const row = btn.closest("tr");
      const id = btn.dataset.id;
      const name = row.children[1].textContent;
      const [dosage, dosageType] = row.children[2].textContent.split(" ");
      const time12h = row.children[3].textContent;

      document.getElementById("manual-id").value = id;
      document.getElementById("manual-name").value = name;
      document.getElementById("manual-dosage").value = dosage;
      document.getElementById("manual-dosage-type").value = dosageType;
      document.getElementById("manual-time").value = convertTo24Hour(time12h);

      const repeatValue = row.dataset.repeat || "once";
      document.getElementById("manual-repeat").value = repeatValue;

      modal.classList.add("visible");
      modal.classList.remove("hidden");
      document.body.classList.add("modal-open");

      gsap.fromTo(
        modalContent,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.7, ease: "bounce.out" }
      );
    });
  });

  document.getElementById("close-modal").addEventListener("click", () => {
    gsap.to(modalContent, {
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        modal.classList.remove("visible"); // trigger fade out
        document.body.classList.remove("modal-open");

        // wait for CSS transition to finish before hiding completely
        setTimeout(() => {
          modal.classList.add("hidden");
        }, 300); // match CSS transition time
      },
    });
  });

  document.getElementById("manualEditForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const id = document.getElementById("manual-id").value;
    const name = document.getElementById("manual-name").value.trim();
    const dosage = document.getElementById("manual-dosage").value;
    const dosageType = document
      .getElementById("manual-dosage-type")
      .value.trim();
    const time = document.getElementById("manual-time").value;
    const repeatSelect = document.getElementById("repeat");
    // const repeat = repeatSelect ? repeatSelect.value : "once";
    const repeat = document.getElementById("manual-repeat").value;

    fetch("update-reminder.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name, dosage, dosageType, time, repeat }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          window.location.href = "reminder.php";
        } else {
          alert("Update failed: " + (data.error || "Unknown error."));
        }
      })

      .catch((err) => {
        console.error("Fetch error:", err);
        alert("Could not contact the server.");
      });
  });

  function convertTo24Hour(time12h) {
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");

    hours = parseInt(hours);
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  }
});
