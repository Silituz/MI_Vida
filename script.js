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
const galleryButton = document.querySelector("#galleryButton");
const galleryModal = document.querySelector("#galleryModal");
const galleryGrid = document.querySelector("#galleryGrid");
const galleryClose = document.querySelector("#galleryClose");
const secretModal = document.querySelector("#secretModal");
const secretClose = document.querySelector("#secretClose");
const reasonText = document.querySelector("#reasonText");

const noReplies = [
  "No puedo decir no a ti",
  "Espera... casi digo si",
  "Me estoy haciendo la dificil",
  "No, pero con carino",
  "Tal vez si, mi amor",
  "Uy... se movio solito",
  "Ok, me ganaste",
  "Si, pero con drama"
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
  "assets/photo-11-sleepy.png",
  "assets/rosa-eterna.png",
  "assets/photo-12-poster.png",
  "assets/photo-13-sleep.png",
  "assets/photo-14-disney.png",
  "assets/photo-15-ancient1.png",
  "assets/photo-16-ancient2.png",
  "assets/photo-17-cute1.png",
  "assets/photo-18-cute2.png",
  "assets/photo-19-bed.png",
  "assets/photo-21-cute4.png",
  "assets/photo-22-bunny.png",
  "assets/photo-23-cute5.png",
  "assets/photo-24-flower.png",
  "assets/photo-25-anime.png",
  "assets/photo-26-cute6.png",
  "assets/photo-27-anime2.png",
  "assets/photo-28-anime3.png",
  "assets/photo-29-anime4.png",
  "assets/photo-30-disney2.png",
  "assets/photo-31-anime5.png",
  "assets/photo-32-anime6.png",
  "assets/photo-33-cute7.png",
  "assets/photo-34-cute8.png",
  "assets/photo-35-cute9.png",
  "assets/photo-36-cute10.png",
  "assets/photo-37-rosa_eterna2.png"
];

let currentScreen = 0;
let toastTimer;
let photoHeartClicks = 0;
let nextFloatingPhoto = 0;
let galleryBuilt = false;
let galleryScrollTop = 0;
let photoOpenedFromGallery = false;
let secretClicks = Number(sessionStorage.getItem("secretClicks") || "0");
let secretUnlocked = sessionStorage.getItem("secretUnlocked") === "true";

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

function unlockSecret() {
  secretUnlocked = true;
  sessionStorage.setItem("secretUnlocked", "true");
  createBurst(document.querySelector(".love-app"));

  if (secretModal && typeof secretModal.showModal === "function") {
    secretModal.showModal();
  }
}

function countSecretMoment() {
  if (secretUnlocked) {
    return;
  }

  secretClicks += 1;
  sessionStorage.setItem("secretClicks", String(secretClicks));

  if (secretClicks === 7) {
    showToast("Ya casi encuentras algo secreto...");
  }

  if (secretClicks >= 10) {
    unlockSecret();
  }
}

function sweetenNo(button) {
  const noCount = Number(button.dataset.noCount || "0") + 1;
  const nextText = noReplies[Math.floor(Math.random() * noReplies.length)];
  const x = Math.round((Math.random() * 44) - 22);
  const y = Math.round((Math.random() * 18) - 9);
  const tilt = Math.round((Math.random() * 10) - 5);
  const moods = ["is-playful", "is-glow", "is-shy", "is-kiss", "is-floating", "is-tiny"];
  const mood = moods[Math.floor(Math.random() * moods.length)];

  button.dataset.noCount = String(noCount);
  button.textContent = nextText;
  button.classList.remove("is-playful", "is-glow", "is-shy", "is-kiss", "is-floating", "is-tiny");
  button.classList.add("is-cute", mood);
  button.style.setProperty("--no-x", `${x}px`);
  button.style.setProperty("--no-y", `${y}px`);
  button.style.setProperty("--no-tilt", `${tilt}deg`);
  createBurst(button);

  if (noCount < 3) {
    showToast(noCount === 1 ? "Ese no se puso nervioso." : "Creo que ese no ya quiere ser si.");
    return;
  }

  button.textContent = "Si, ya no puedo resistirme";
  button.classList.add("is-glow");
  button.style.setProperty("--no-x", "0px");
  button.style.setProperty("--no-y", "0px");
  button.style.setProperty("--no-tilt", "0deg");
  showToast("Listo. El no se rindio al amor.");

  button.dataset.next = "";
  button.removeAttribute("data-no");
}

function showReason(button) {
  if (!reasonText) {
    return;
  }

  reasonText.textContent = button.dataset.reason;
  button.classList.add("is-found");
  createBurst(button);
  showToast("Una razon mas para amarte.");
}

function openPhoto(src, { fromGallery = false } = {}) {
  photoOpenedFromGallery = fromGallery;
  modalImage.src = src;

  if (typeof modal.showModal === "function") {
    modal.showModal();
  }
}

function closePhoto() {
  modal.close();

  if (photoOpenedFromGallery) {
    photoOpenedFromGallery = false;
    openGallery({ restoreScroll: true });
  }
}

function buildGallery() {
  if (galleryBuilt) {
    return;
  }

  photoSources.forEach((src, index) => {
    const button = document.createElement("button");
    const image = document.createElement("img");

    button.type = "button";
    button.dataset.photo = src;
    button.setAttribute("aria-label", `Recuerdo ${index + 1}`);
    image.src = src;
    image.alt = "";
    image.loading = "lazy";
    image.decoding = "async";

    button.append(image);
    galleryGrid.append(button);
  });

  galleryBuilt = true;
}

function openGallery({ restoreScroll = false } = {}) {
  buildGallery();

  if (typeof galleryModal.showModal === "function" && !galleryModal.open) {
    galleryModal.showModal();
  }

  if (restoreScroll) {
    requestAnimationFrame(() => {
      galleryGrid.scrollTop = galleryScrollTop;
    });
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
  const reasonButton = event.target.closest("[data-reason]");

  playSong({ quiet: true });

  if (floatingPhoto) {
    countSecretMoment();
    growFloatingPhoto(floatingPhoto);
    return;
  }

  if (reasonButton) {
    countSecretMoment();
    showReason(reasonButton);
    return;
  }

  if (photoButton) {
    countSecretMoment();
    const src = photoButton.dataset.photo || photoButton.getAttribute("src");

    if (galleryModal.open && galleryModal.contains(photoButton)) {
      galleryScrollTop = galleryGrid.scrollTop;
      galleryModal.close();
      openPhoto(src, { fromGallery: true });
      return;
    }

    openPhoto(src);
    return;
  }

  if (noButton) {
    countSecretMoment();
    sweetenNo(noButton);
    return;
  }

  if (nextButton) {
    countSecretMoment();
    createBurst(nextButton);
    setScreen(currentScreen + 1);
  }
});

restartButton.addEventListener("click", () => {
  document.querySelectorAll(".answer.no, .answer[data-no-count]").forEach((button) => {
    button.classList.remove("is-cute", "is-playful", "is-glow", "is-shy", "is-kiss", "is-floating", "is-tiny");
    button.style.removeProperty("--no-x");
    button.style.removeProperty("--no-y");
    button.style.removeProperty("--no-tilt");
    button.dataset.no = "";
    delete button.dataset.next;
    delete button.dataset.noCount;
  });

  document.querySelectorAll(".reason-star").forEach((button) => button.classList.remove("is-found"));

  if (reasonText) {
    reasonText.textContent = "Toca una estrella para descubrir una razon.";
  }

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

modalClose.addEventListener("click", closePhoto);

galleryButton.addEventListener("click", (event) => {
  event.stopPropagation();
  countSecretMoment();
  playSong({ quiet: true });
  openGallery();
});

galleryClose.addEventListener("click", () => galleryModal.close());

if (secretClose) {
  secretClose.addEventListener("click", () => secretModal.close());
}

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closePhoto();
  }
});

galleryModal.addEventListener("click", (event) => {
  if (event.target === galleryModal) {
    galleryModal.close();
  }
});

if (secretModal) {
  secretModal.addEventListener("click", (event) => {
    if (event.target === secretModal) {
      secretModal.close();
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  playSong({ quiet: true });
});

window.addEventListener("pageshow", () => {
  playSong({ quiet: true });
});

setScreen(0);
