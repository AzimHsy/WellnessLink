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

  function redirectWithLoader(url) {
    if (window.location.href === url) return;

    loader.style.display = "block";
    document.body.style.pointerEvents = "none";

    setTimeout(() => {
      window.location.href = url;
    }, 1200);
  }

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
});
