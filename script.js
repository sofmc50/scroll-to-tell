const progressBar = document.querySelector("#progressBar");
const parallaxLayers = document.querySelectorAll(".layer");
const princess = document.querySelector("#princess");
const wellScene = document.querySelector("#wellScene");

// This runs every time the user scrolls.
window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const pageHeight = document.body.scrollHeight - window.innerHeight;
  const percentScrolled = (scrollTop / pageHeight) * 100;

  progressBar.style.width = percentScrolled + "%";

  // Move each background layer at a slightly different speed.
  parallaxLayers.forEach((layer) => {
    const speed = Number(layer.dataset.speed);
    layer.style.transform = `translateY(${scrollTop * speed}px)`;
  });

  // Start moving Mira toward the well when this scene is on screen.
  const sceneTop = wellScene.offsetTop;
  const distanceIntoScene = scrollTop - sceneTop + window.innerHeight;
  const walkAmount = Math.max(0, Math.min(distanceIntoScene / 8, 95));
  princess.style.transform = `translateX(${walkAmount}px)`;
});

// Reveal story cards one at a time.
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.35 }
);

document.querySelectorAll(".reveal").forEach((item) => {
  observer.observe(item);
});

// TODO: Make Mira fall down the well in the next version.
