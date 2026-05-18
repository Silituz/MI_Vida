const SUNO_URL = "https://suno.com/s/R6oedOLFIogGrXNe";
const LOCAL_SONG = "assets/rosa-eterna.mp3";

const screens = [...document.querySelectorAll(".screen")];
const dots = [...document.querySelectorAll(".progress-dot")];
const toast = document.querySelector("#toast");
const song = document.querySelector("#song");
const musicButton = document.querySelector("#musicButton");
const restartButton = document.querySelector("#restartButton");
const modal = document.querySelector("#photoModal");
const modalImage = document.querySelector("#modalImage");
const modalClose = document.querySelector("#modalClose");

const noReplies = [
  "Si, pero con drama",
  "Bueno... si",
  "Si, me dio pena",
  "Si, obvio",
  "Si, porque eres lindo",
  "Si, siguiente pregunta"
];

const photoSources = [
  "assets/photo-01-ti-amo.png",
  "assets/photo-02-bakery.png",
  "assets/photo-03-portrait-soft.png",
  "assets/photo-04-portrait-smile.png",
  "assets/photo-05-cuddle.png",
  "assets/photo-06-sunset.png",
  "assets/photo-07-weekend.png",
  "assets/photo-08-selfie.png",
  "assets/photo-09-breakfast.png",
  "assets/photo-10-memory-box.png",
  "assets/photo-11-sleepy.png"
];

let currentScreen = 0;
let toastTimer;
let photoHeartClicks = 0;
let nextFloatingPhoto = 0;

function setScreen(nextScreen) {
  currentScreen = Math.max(0, Math.min(nextScreen, screens.length - 1));

  screens.forEach((screen, index) => {
    screen.classList.toggle("active", index === currentScreen);
  });

  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === Math.min(currentScreen, dots.length - 1));
  });
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function prepareSong() {
  if (!song.src) {
    song.src = LOCAL_SONG;
  }

  song.loop = true;
}

async function playSong({ quiet = false } = {}) {
  prepareSong();

  try {
    await song.play();
    musicButton.classList.add("playing");
    if (!quiet) {
      showToast("Rosa eterna esta sonando para Mi Vida preciosa.");
    }
    return true;
  } catch {
    musicButton.classList.remove("playing");
    if (!quiet) {
      showToast("Toca la nota musical para activar Rosa eterna.");
    }
    return false;
  }
}

function createBurst(origin) {
  const rect = origin.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  for (let i = 0; i < 12; i += 1) {
    const heart = document.createElement("span");
    const angle = (Math.PI * 2 * i) / 12;
    const distance = 58 + Math.random() * 34;

    heart.className = "burst";
    heart.textContent = i % 3 === 0 ? "Ti amo" : "♥";
    heart.style.left = `${centerX}px`;
    heart.style.top = `${centerY}px`;
    heart.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
    heart.style.setProperty("--y", `${Math.sin(angle) * distance}px`);

    document.body.append(heart);
    setTimeout(() => heart.remove(), 920);
  }
}

function sweetenNo(button) {
  const nextText = noReplies[Math.floor(Math.random() * noReplies.length)];
  button.textContent = nextText;
  button.classList.add("is-cute");
  button.classList.toggle("is-floating");
  button.classList.toggle("is-tiny");
  createBurst(button);
  showToast("El universo tradujo esa respuesta a un si bonito.");

  button.dataset.next = "";
  button.removeAttribute("data-no");
}

function openPhoto(src) {
  modalImage.src = src;

  if (typeof modal.showModal === "function") {
    modal.showModal();
  }
}

function growFloatingPhoto(button) {
  photoHeartClicks += 1;
  button.classList.add("is-big");
  createBurst(button);

  setTimeout(() => {
    button.classList.remove("is-big");
    swapFloatingPhoto(button);
  }, 760);

  if (photoHeartClicks % 10 === 0) {
    showToast("Ti amo, Mi Vida preciosa.");
  } else {
    showToast("Un recuerdo mas grande para ti.");
  }
}

function swapFloatingPhoto(button) {
  const image = button.querySelector("img");
  const currentSource = button.dataset.float;
  let nextSource = photoSources[nextFloatingPhoto % photoSources.length];
  nextFloatingPhoto += 1;

  if (nextSource === currentSource) {
    nextSource = photoSources[nextFloatingPhoto % photoSources.length];
    nextFloatingPhoto += 1;
  }

  button.dataset.float = nextSource;
  image.src = nextSource;
}

document.addEventListener("click", (event) => {
  const floatingPhoto = event.target.closest("[data-float]");
  const photoButton = event.target.closest("[data-photo]");
  const nextButton = event.target.closest("[data-next]");
  const noButton = event.target.closest("[data-no]");

  playSong({ quiet: true });

  if (floatingPhoto) {
    growFloatingPhoto(floatingPhoto);
    return;
  }

  if (photoButton) {
    const src = photoButton.dataset.photo || photoButton.getAttribute("src");
    openPhoto(src);
    return;
  }

  if (noButton) {
    sweetenNo(noButton);
    return;
  }

  if (nextButton) {
    createBurst(nextButton);
    setScreen(currentScreen + 1);
  }
});

restartButton.addEventListener("click", () => {
  document.querySelectorAll(".answer.no").forEach((button) => {
    button.classList.remove("is-cute", "is-floating", "is-tiny");
    button.dataset.no = "";
    delete button.dataset.next;
  });

  const labels = ["No", "No se", "Tal vez no"];
  document.querySelectorAll(".answer.no").forEach((button, index) => {
    button.textContent = labels[index] || "No";
  });

  setScreen(0);
});

musicButton.addEventListener("click", async (event) => {
  event.stopPropagation();

  if (!song.paused) {
    song.pause();
    musicButton.classList.remove("playing");
    showToast("Pause Rosa eterna.");
    return;
  }

  const started = await playSong();

  if (!started) {
    window.open(SUNO_URL, "_blank", "noopener,noreferrer");
    showToast("Abri Rosa eterna en Suno.");
  }
});

modalClose.addEventListener("click", () => modal.close());

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.close();
  }
});

window.addEventListener("DOMContentLoaded", () => {
  playSong({ quiet: true });
});

window.addEventListener("pageshow", () => {
  playSong({ quiet: true });
});

setScreen(0);
