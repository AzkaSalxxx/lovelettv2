const lockScreen = document.getElementById("lockScreen");
const mainContent = document.getElementById("mainContent");
const unlockBtn = document.getElementById("unlockBtn");
const wrongText = document.getElementById("wrongText");

const bgMusic = document.getElementById("bgMusic");

const letterTitle = document.getElementById("letterTitle");
const letterText = document.getElementById("letterText");
const skipBtn = document.getElementById("skipBtn");

const slidePhoto = document.getElementById("slidePhoto");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let currentPhoto = 0;
let typingIndex = 0;
let typingTimer;
let isSkipped = false;

document.documentElement.style.setProperty(
  "--bg-image",
  `url('${config.background}')`
);

function fillPinScroll() {
  const pinIds = ["pin1", "pin2", "pin3", "pin4"];

  pinIds.forEach((id) => {
    const select = document.getElementById(id);

    for (let i = 0; i <= 9; i++) {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = i;
      select.appendChild(option);
    }
  });
}

function getPinValue() {
  return (
    document.getElementById("pin1").value +
    document.getElementById("pin2").value +
    document.getElementById("pin3").value +
    document.getElementById("pin4").value
  );
}

function openWebsite() {
  lockScreen.style.display = "none";
  mainContent.style.display = "block";

  bgMusic.src = config.music;
  bgMusic.play().catch(() => {});

  startLetter();
  showPhoto();
}

unlockBtn.addEventListener("click", () => {
  const pin = getPinValue();

  if (pin === config.pin) {
    openWebsite();
  } else {
    wrongText.textContent = "PIN salah 😭";
  }
});

function startLetter() {
  letterTitle.textContent = config.letterTitle;
  letterText.textContent = "";
  typingIndex = 0;
  isSkipped = false;

  typeLetter();
}

function typeLetter() {
  if (isSkipped) return;

  if (typingIndex < config.letterText.length) {
    letterText.textContent += config.letterText.charAt(typingIndex);
    typingIndex++;

    typingTimer = setTimeout(typeLetter, config.typingSpeed || 45);
  }
}

skipBtn.addEventListener("click", () => {
  isSkipped = true;
  clearTimeout(typingTimer);
  letterText.textContent = config.letterText;
});

function showPhoto() {
  if (!config.photos || config.photos.length === 0) return;
  slidePhoto.src = config.photos[currentPhoto];
}

function nextPhoto() {
  currentPhoto++;

  if (currentPhoto >= config.photos.length) {
    currentPhoto = 0;
  }

  showPhoto();
}

function prevPhoto() {
  currentPhoto--;

  if (currentPhoto < 0) {
    currentPhoto = config.photos.length - 1;
  }

  showPhoto();
}

nextBtn.addEventListener("click", nextPhoto);
prevBtn.addEventListener("click", prevPhoto);

fillPinScroll();
