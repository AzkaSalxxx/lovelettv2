const $ = (id) => document.getElementById(id);
const screens = ["startScreen", "lockScreen", "letterScreen", "galleryScreen"];
let typedPin = "";

function showScreen(id) {
  screens.forEach(screen => $(screen).classList.remove("active"));
  $(id).classList.add("active");
}

function applyConfig() {
  const bg = WEBSITE_CONFIG.background;
  if (bg.type === "image") {
    document.body.style.setProperty("--custom-bg", `url('${bg.value}')`);
  } else {
    document.body.style.setProperty("--custom-bg", bg.value);
  }

  $("coverTitle").textContent = WEBSITE_CONFIG.coverTitle;
  $("coverSubtitle").textContent = WEBSITE_CONFIG.coverSubtitle;
  $("letterTitle").textContent = WEBSITE_CONFIG.letterTitle;
  $("letterText").innerHTML = WEBSITE_CONFIG.letterText.map(t => `<p>${t}</p>`).join("");
  $("letterSign").textContent = WEBSITE_CONFIG.letterSign;
  $("bgMusic").src = WEBSITE_CONFIG.music;

  const gallery = $("gallery");
  gallery.innerHTML = "";
  WEBSITE_CONFIG.photos.forEach((src, index) => {
    const card = document.createElement("div");
    card.className = "polaroid";
    card.style.setProperty("--rot", `${[-4, 3, -2, 5, -5, 2, 4, -3][index % 8]}deg`);
    card.innerHTML = `<img src="${src}" alt="memory ${index + 1}">`;
    card.addEventListener("click", () => openModal(src));
    gallery.appendChild(card);
  });
}

function updatePinDisplay() {
  const digits = typedPin.padEnd(4, "0").slice(0, 4).split("");
  [...$("pinDisplay").children].forEach((box, i) => box.textContent = digits[i]);
}

function openModal(src) {
  $("modalImg").src = src;
  $("photoModal").classList.add("active");
}

function unlock() {
  if (typedPin === WEBSITE_CONFIG.pin) {
    $("pinMessage").textContent = "Unlocked ❤";
    setTimeout(() => showScreen("letterScreen"), 500);
  } else {
    $("pinMessage").textContent = "PIN salah, coba lagi.";
    typedPin = "";
    updatePinDisplay();
  }
}

$("startBtn").addEventListener("click", async () => {
  try {
    await $("bgMusic").play();
  } catch (e) {
    console.log("Music needs user interaction.");
  }
  showScreen("lockScreen");
});

$("nextBtn").addEventListener("click", () => showScreen("galleryScreen"));
$("backLetter").addEventListener("click", () => showScreen("letterScreen"));
$("closeModal").addEventListener("click", () => $("photoModal").classList.remove("active"));

$("clearPin").addEventListener("click", () => {
  typedPin = "";
  $("pinMessage").textContent = "";
  updatePinDisplay();
});
$("enterPin").addEventListener("click", unlock);

document.querySelectorAll(".keypad button").forEach(btn => {
  btn.addEventListener("click", () => {
    const value = btn.textContent.trim();
    if (!/^\d$/.test(value)) return;
    if (typedPin.length < 4) typedPin += value;
    $("pinMessage").textContent = "";
    updatePinDisplay();
  });
});

document.addEventListener("keydown", (e) => {
  if (/^\d$/.test(e.key) && typedPin.length < 4) {
    typedPin += e.key;
    updatePinDisplay();
  }
  if (e.key === "Backspace") {
    typedPin = typedPin.slice(0, -1);
    updatePinDisplay();
  }
  if (e.key === "Enter") unlock();
});

applyConfig();
updatePinDisplay();
