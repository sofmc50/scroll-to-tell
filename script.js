const progressBar = document.querySelector("#progressBar");
const parallaxLayers = document.querySelectorAll(".layer");
const princess = document.querySelector("#princess");
const wellScene = document.querySelector("#wellScene");
const fallScene = document.querySelector("#fallScene");
const fallingPrincess = document.querySelector("#fallingPrincess");
const rescueScene = document.querySelector("#rescueScene");

// Keep a number between 0 and 1.
function clamp(number) {
  return Math.max(0, Math.min(number, 1));
}

function updateStory() {
  const scrollTop = window.scrollY;
  const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
  const percentScrolled = pageHeight > 0 ? (scrollTop / pageHeight) * 100 : 0;

  progressBar.style.width = percentScrolled + "%";

  // Move background pieces at slightly different speeds.
  parallaxLayers.forEach((layer) => {
    const scene = layer.closest("section");
    const sceneBox = scene.getBoundingClientRect();

    if (sceneBox.bottom > 0 && sceneBox.top < window.innerHeight) {
      const speed = Number(layer.dataset.speed);
      const movement = -sceneBox.top * speed;
      layer.style.translate = `0 ${movement}px`;
    }
  });

  // Move Mira closer to the well.
  const wellBox = wellScene.getBoundingClientRect();
  const walkProgress = clamp((window.innerHeight - wellBox.top) / (window.innerHeight + wellBox.height));
  princess.style.transform = `translateX(${walkProgress * 105}px)`;

  // Move Mira down the tunnel while the tall falling scene scrolls.
  const fallBox = fallScene.getBoundingClientRect();
  const fallDistance = fallScene.offsetHeight - window.innerHeight;
  const fallProgress = clamp(-fallBox.top / fallDistance);
  fallingPrincess.style.transform = `translate(-50%, ${fallProgress * 58}vh) rotate(${fallProgress * 55}deg)`;

  // Grow the escape vine and raise Pip as the rescue scene appears.
  const rescueBox = rescueScene.getBoundingClientRect();
  const rescueProgress = clamp((window.innerHeight - rescueBox.top) / (window.innerHeight + rescueBox.height * 0.4));
  rescueScene.style.setProperty("--vine-progress", rescueProgress);
  rescueScene.style.setProperty("--star-rise", `${rescueProgress * -170}px`);
}

// requestAnimationFrame keeps the scroll event smooth.
let waitingForFrame = false;

window.addEventListener("scroll", () => {
  if (!waitingForFrame) {
    window.requestAnimationFrame(() => {
      updateStory();
      waitingForFrame = false;
    });
    waitingForFrame = true;
  }
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
  { threshold: 0.25 }
);

document.querySelectorAll(".reveal").forEach((item) => {
  observer.observe(item);
});

// Set the correct positions when the page first opens.
updateStory();
