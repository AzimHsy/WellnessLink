const trailer = document.getElementById("trailer");
const icon = trailer.querySelector("ion-icon");

const animateTrailer = (e, scale = 1, opacity = 0) => {
  const x = e.clientX;
  const y = e.clientY;

  trailer.animate(
    {
      transform: `translate(${x}px, ${y}px) scale(${scale})`,
    },
    {
      duration: 500,
      fill: "forwards",
    }
  );

  trailer.style.opacity = opacity;
};

// Handle mouse movement
window.addEventListener("mousemove", (e) => {
  const container = document.querySelector(".functions-container");
  const overContainer = container.contains(e.target);
  const overFunction = e.target.closest(".funct");

  if (overFunction) {
    animateTrailer(e, 3.5, 1); // Expand more on .funct
  } else if (overContainer) {
    animateTrailer(e, 0, 1); // Show when inside container
  } else {
    animateTrailer(e, 1, 0); // Hide
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const loader = document.querySelector(".loader");
  const currentPage = window.location.pathname.split("/").pop();

  const pageMap = {
    "dashboard.php": ".funct0",
    "nearby-clinic.php": ".funct1",
    "bmi.php": ".funct2",
    "reminder.php": ".funct3",
    "water.php": ".funct4",
  };

  const activeSelector = pageMap[currentPage];
  if (activeSelector) {
    document.querySelector(activeSelector).classList.add("active");
  }

  function redirectWithLoader(url) {
    if (window.location.href === url) return;
    loader.style.display = "block";
    document.body.style.pointerEvents = "none";
    setTimeout(() => {
      window.location.href = url;
    }, 1200);
  }

  document.querySelector(".funct0").addEventListener("click", () => {
    redirectWithLoader("http://localhost/wellnesslink/dashboard.php");
  });

  document.querySelector(".funct1").addEventListener("click", () => {
    redirectWithLoader("http://localhost/wellnesslink/nearby-clinic.php");
  });

  document.querySelector(".funct2").addEventListener("click", () => {
    redirectWithLoader("http://localhost/wellnesslink/bmi.php");
  });

  document.querySelector(".funct3").addEventListener("click", () => {
    redirectWithLoader("http://localhost/wellnesslink/reminder.php");
  });

  document.querySelector(".funct4").addEventListener("click", () => {
    redirectWithLoader("http://localhost/wellnesslink/water.php");
  });

  const players = document.querySelectorAll(".funct");

  players.forEach((funct) => {
    const lottie = funct.querySelector("dotlottie-player");

    if (lottie) {
      funct.addEventListener("mouseenter", () => lottie.play());
      funct.addEventListener("mouseleave", () => lottie.stop());
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const logoutBtn = document.getElementById("logout-btn");
  console.log("Logout button is:", logoutBtn);

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      Swal.fire({
        title: "Are you sure?",
        text: "You will be logged out of your account.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, log me out",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "logout.php";
        }
      });
    });
  }
});
let notificationTimeout;
window.notifications = [];

const badge = document.getElementById("notificationCount");
const notifyBtn = document.getElementById("notifyBtn");

// 🔁 1. Fetch notifications silently on page load
fetch("get-notification.php")
  .then((res) => res.json())
  .then((data) => {
    if (Array.isArray(data) && data.length > 0) {
      // Store data globally
      window.notifications = data;

      // Update badge only if not shown yet this session
      if (!sessionStorage.getItem("notificationsShown")) {
        badge.textContent = data.length;
        badge.style.display = "inline-block";
      }

      // Mark as read immediately (optional)
      const ids = data.map((n) => n.id).join(",");
      fetch("mark-notifications-read.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `ids=${ids}`,
      });
    } else {
      // Fallback notification
      window.notifications = [
        {
          title: "No Notifications Available!",
          message: "You're all caught up for now.",
        },
      ];
    }
  });

// 🛎️ 2. Notification button click handler
notifyBtn.addEventListener("click", () => {
  if (window.notifications.length > 0) {
    showMultipleNotifications(window.notifications);
    sessionStorage.setItem("notificationsShown", "true");
    badge.style.display = "none";
  }
});

// ✅ 3. Show notification cards
function showMultipleNotifications(notificationsList, duration = 4000) {
  const container = document.getElementById("notificationBox");

  container.innerHTML = "";
  clearTimeout(notificationTimeout);

  // Disable button temporarily
  notifyBtn.disabled = true;
  notifyBtn.classList.add("disabled");

  const elements = [];

  notificationsList.forEach((notif) => {
    const inner = document.createElement("div");
    inner.className = "notification-inner";
    inner.innerHTML = `
      <div class="notification-icon">
        <svg class="icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </div>
      <div class="notification-text">
        <p class="title">${notif.title}</p>
        <p class="subtitle">${notif.message}</p>
      </div>
      <div class="notification-action">
        <button type="button" class="closeNotification">
          <svg class="x-icon" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>
      </div>
    `;
    container.appendChild(inner);
    elements.push(inner);
  });

  // Entrance animation
  gsap.from(elements, {
    opacity: 0,
    x: 100,
    duration: 0.6,
    ease: "power3.out",
    stagger: 0.15,
  });

  // Auto-close after duration
  if (duration > 0) {
    notificationTimeout = setTimeout(() => {
      hideAllNotifications();
    }, duration);
  }

  // Close individual notifications
  container.querySelectorAll(".closeNotification").forEach((btn) => {
    btn.addEventListener("click", () => {
      const inner = btn.closest(".notification-inner");
      gsap.to(inner, {
        opacity: 0,
        x: 100,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => {
          inner.remove();

          const remaining = container.querySelectorAll(
            ".notification-inner"
          ).length;
          if (remaining === 0) {
            clearTimeout(notificationTimeout);
            notifyBtn.disabled = false;
            notifyBtn.classList.remove("disabled");
            badge.textContent = "0";
            badge.style.display = "none";
          } else {
            badge.textContent = remaining;
          }
        },
      });
    });
  });
}

function hideAllNotifications() {
  const container = document.getElementById("notificationBox");

  const all = container.querySelectorAll(".notification-inner");
  gsap.to(all, {
    opacity: 0,
    x: 100,
    duration: 0.5,
    ease: "power2.in",
    onComplete: () => {
      container.innerHTML = "";
      notifyBtn.disabled = false;
      notifyBtn.classList.remove("disabled");
      badge.textContent = "0";
      badge.style.display = "none";
    },
  });
}
