const notifiedReminders = new Set();

setInterval(() => {
  fetch("get-due-reminders.php")
    .then((res) => res.json())
    .then((reminders) => {
      if (Array.isArray(reminders) && reminders.length > 0) {
        reminders.forEach((reminder) => {
          // 💡 Skip if this reminder was already notified
          if (notifiedReminders.has(reminder.id)) return;

          // ✅ Mark this reminder as notified
          notifiedReminders.add(reminder.id);

          Swal.fire({
            icon: "info",
            title: "Time to take your medication!",
            html: `
    <b>${reminder.medication_name}</b><br>
    ${reminder.dosage} ${reminder.dosage_type}<br>
    Repeat: ${reminder.repeat_type}
  `,
            showDenyButton: true,
            confirmButtonText: "Taken",
            denyButtonText: "Ignore",
            confirmButtonColor: "#28a745",
            denyButtonColor: "#dc3545",
          }).then((result) => {
            const taken = result.isConfirmed ? 1 : result.isDenied ? 0 : null;
            if (taken === null) return;

            fetch("log-medication.php", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                reminder_id: reminder.id, // ✅ now this is required
                taken: taken,
              }),
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.success) {
                  console.log("Medication log saved.");
                } else {
                  console.error("Log failed:", data.error);
                }
              })
              .catch((err) => {
                console.error("Logging error:", err);
              });
          });
        });
      }
    })
    .catch((err) => {
      console.error("Reminder fetch error:", err);
    });
}, 60000); // Check every 1 minute

// Reset every 24 hours (or when the page reloads, which is simpler)
window.addEventListener("beforeunload", () => {
  notifiedReminders.clear();
});
