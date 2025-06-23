setTimeout(() => {
  // Send "take a break" notification to database
  fetch("add-notification.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `title=Take a Break&message=You’ve been looking at the screen for 5 minutes. Consider stretching or blinking!`,
  });

  // Fetch and show all unread notifications
  fetch("get-notification.php")
    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        showMultipleNotifications(data);

        // Update badge
        badge.textContent = data.length;
        badge.style.display = "inline-block";

        // Optional: mark as read
        const ids = data.map((n) => n.id).join(",");
        fetch("mark-notifications-read.php", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `ids=${ids}`,
        });
      }
    });
}, 5 * 60 * 1000);
