// ==================== THEME ====================
(function initTheme() {
  const saved = localStorage.getItem("theme") || "dark";
  applyTheme(saved, false);
})();

function applyTheme(theme, animate = true) {
  document.body.classList.toggle("light", theme === "light");
  const icon = document.getElementById("themeIcon");
  if (icon) icon.textContent = theme === "light" ? "🌙" : "☀️";
  localStorage.setItem("theme", theme);
  const metaTheme = document.getElementById("metaThemeColor");
  if (metaTheme) metaTheme.content = theme === "light" ? "#faf6f0" : "#0d0a0e";
  if (animate) document.body.style.transition = "background 0.4s ease, color 0.4s ease";
}

function toggleTheme() {
  const isLight = document.body.classList.contains("light");
  applyTheme(isLight ? "dark" : "light");
}

// ==================== CONFIG ====================
const startDate = new Date("2025-12-20");
let currentLetterFilename = "";
let currentLetterImageUrl = "";
let allLetters = [];
let currentFolder = "letters";

// ==================== PETALS ====================
(function spawnPetals() {
  const container = document.getElementById("petalsContainer");
  const petals = ["🌸", "🌺", "✿", "❀", "🌷", "·", "∘"];
  const isMobile = window.innerWidth <= 480;
  const count = isMobile ? 10 : 22;
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "petal";
    p.textContent = petals[Math.floor(Math.random() * petals.length)];
    p.style.left = Math.random() * 100 + "vw";
    p.style.fontSize = (10 + Math.random() * 14) + "px";
    p.style.animationDuration = (12 + Math.random() * 20) + "s";
    p.style.animationDelay = -(Math.random() * 20) + "s";
    p.style.opacity = 0;
    container.appendChild(p);
  }
})();

// ==================== COUNTDOWN HELPERS ====================
function pad(n) { return String(n).padStart(2, "0"); }

function timeTo(target) {
  const diff = target - new Date();
  if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0, done: true };
  const totalSecs = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSecs / 86400),
    hours: Math.floor((totalSecs % 86400) / 3600),
    mins: Math.floor((totalSecs % 3600) / 60),
    secs: totalSecs % 60,
    done: false
  };
}

function tickNum(el, val) {
  el.classList.remove("tick");
  void el.offsetWidth;
  el.classList.add("tick");
  el.textContent = val;
  setTimeout(() => el.classList.remove("tick"), 200);
}

// ==================== NEXT MONTHSARY ====================
function getNextMonthsary() {
  const now = new Date();
  let y = now.getFullYear(), m = now.getMonth();
  let candidate = new Date(y, m, 20, 0, 0, 0);
  if (candidate <= now) {
    m++;
    if (m > 11) { m = 0; y++; }
    candidate = new Date(y, m, 20, 0, 0, 0);
  }
  return candidate;
}

// ==================== ANNIVERSARY ====================
const anniversaryDate = new Date("2026-12-20T00:00:00");

// ==================== MAIN UPDATE ====================
let lastMSecs = -1, lastASecs = -1;

function updateAll() {
  const now = new Date();
  const diff = now - startDate;
  const totalDays = Math.floor(diff / 864e5);
  const months = Math.floor(totalDays / 30);
  const remainingDays = totalDays % 30;

  document.getElementById("statMonths").textContent = `${months} months`;
  document.getElementById("statDays").textContent = `${remainingDays} days together`;
  document.getElementById("headerSub").textContent = `${totalDays} days of loving you ♥`;

  const nextM = getNextMonthsary();
  const mT = timeTo(nextM);
  const mLabel = nextM.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  document.getElementById("monthsaryDateText").textContent = mT.done ? "Happy Monthsary! 🎉" : mLabel;
  document.getElementById("statNext").textContent = mT.done ? "Happy Monthsary! 🎉" : `${mT.days}d ${pad(mT.hours)}h left`;

  if (mT.secs !== lastMSecs) {
    tickNum(document.getElementById("mDays"), pad(mT.days));
    tickNum(document.getElementById("mHours"), pad(mT.hours));
    tickNum(document.getElementById("mMins"), pad(mT.mins));
    tickNum(document.getElementById("mSecs"), pad(mT.secs));
    lastMSecs = mT.secs;
  }

  const aT = timeTo(anniversaryDate);
  if (aT.secs !== lastASecs) {
    tickNum(document.getElementById("aDays"), pad(aT.days));
    tickNum(document.getElementById("aHours"), pad(aT.hours));
    tickNum(document.getElementById("aMins"), pad(aT.mins));
    tickNum(document.getElementById("aSecs"), pad(aT.secs));
    lastASecs = aT.secs;
  }

  if (aT.done) {
    document.getElementById("anniversaryCard")
      .querySelector(".countdown-date-text").textContent = "Happy Anniversary! 🥂";
  }
}

updateAll();
setInterval(updateAll, 1000);

// ==================== NAV ====================
function setActiveNav(type) {
  document.getElementById("navLetters").classList.toggle("active", type === "letters");
  document.getElementById("navPhotos").classList.toggle("active", type === "photos");
  document.getElementById("searchWrap").classList.toggle("hidden", type !== "letters");
  document.getElementById("photoToolbar").classList.toggle("hidden", type !== "photos");
  currentFolder = type;
}

function openFolder(type) {
  setActiveNav(type);
  const area = document.getElementById("contentArea");
  area.innerHTML = `<div class="empty-state">Loading...</div>`;
  if (type === "letters") {
    fetch("/letters")
      .then(r => r.json())
      .then(data => { allLetters = data; renderLetters(data); })
      .catch(() => { area.innerHTML = `<div class="empty-state">Couldn't load letters 🌸</div>`; });
  }
  if (type === "photos") loadPhotos();
}

// ==================== PHOTOS ====================
function loadPhotos() {
  const area = document.getElementById("contentArea");
  area.innerHTML = `<div class="empty-state">Loading...</div>`;
  fetch("/photos")
    .then(r => r.json())
    .then(data => {
      area.innerHTML = "";
      if (!data.length) {
        area.innerHTML = `<div class="empty-state">No memories yet...<br>tap <strong>Add Memory</strong> to upload one 🌸</div>`;
        return;
      }
      data.forEach((photo, i) => {
        const div = document.createElement("div");
        div.className = "photo-item";
        div.style.animationDelay = (i * 0.07) + "s";
        div.innerHTML = `
          <button class="photo-delete-btn" onclick="deletePhoto('${escHtml(photo.filename)}', event)" title="Delete">✕</button>
          <img src="${escHtml(photo.url)}" alt="${escHtml(photo.caption)}" loading="lazy" />
          <p class="photo-caption">${escHtml(photo.caption)}</p>
        `;
        area.appendChild(div);
      });
    })
    .catch(() => { area.innerHTML = `<div class="empty-state">Couldn't load memories 🌸</div>`; });
}

function deletePhoto(filename, e) {
  e.stopPropagation();
  if (!confirm("Remove this memory?")) return;
  fetch("/delete_photo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename })
  })
    .then(r => r.json())
    .then(d => {
      if (d.success) { showToast("Memory removed 🌸"); loadPhotos(); }
      else showToast("Couldn't delete ✗");
    })
    .catch(() => showToast("Network error ✗"));
}

// ==================== UPLOAD MODAL ====================
let pendingFiles = [];

function openUploadModal() {
  pendingFiles = [];
  document.getElementById("uploadPreviewGrid").innerHTML = "";
  document.getElementById("captionInput").value = "";
  document.getElementById("captionWrap").style.display = "none";
  document.getElementById("uploadConfirmBtn").style.display = "none";
  document.getElementById("uploadProgress").classList.add("hidden");
  document.getElementById("dropZone").style.display = "";
  document.getElementById("uploadModal").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeUploadModal() {
  document.getElementById("uploadModal").classList.add("hidden");
  document.body.style.overflow = "";
  pendingFiles = [];
}

function handleUploadModalClick(e) {
  if (e.target === document.getElementById("uploadModal")) closeUploadModal();
}

function handleFileSelect(e) {
  const files = Array.from(e.target.files || []);
  if (!files.length) return;
  addPendingFiles(files);
  openUploadModal();
  e.target.value = "";
}

function addPendingFiles(files) {
  const grid = document.getElementById("uploadPreviewGrid");
  files.forEach(file => {
    if (!file.type.startsWith("image/")) return;
    pendingFiles.push(file);
    const thumb = document.createElement("div");
    thumb.className = "preview-thumb";
    const reader = new FileReader();
    reader.onload = ev => {
      thumb.innerHTML = `
        <img src="${ev.target.result}" alt="preview" />
        <button class="preview-remove" onclick="removePending(this)">✕</button>
      `;
    };
    reader.readAsDataURL(file);
    grid.appendChild(thumb);
  });
  if (pendingFiles.length > 0) {
    document.getElementById("captionWrap").style.display = "";
    document.getElementById("uploadConfirmBtn").style.display = "";
    document.getElementById("dropZone").style.display = "none";
  }
}

function removePending(buttonEl) {
  const thumb = buttonEl.parentElement;
  const idx = Array.from(thumb.parentElement.children).indexOf(thumb);
  pendingFiles.splice(idx, 1);
  thumb.remove();
  if (!pendingFiles.length) {
    document.getElementById("captionWrap").style.display = "none";
    document.getElementById("uploadConfirmBtn").style.display = "none";
    document.getElementById("dropZone").style.display = "";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const dz = document.getElementById("dropZone");
  if (!dz) return;
  dz.addEventListener("dragover", e => { e.preventDefault(); dz.classList.add("drag-over"); });
  dz.addEventListener("dragleave", () => dz.classList.remove("drag-over"));
  dz.addEventListener("drop", e => {
    e.preventDefault();
    dz.classList.remove("drag-over");
    addPendingFiles(Array.from(e.dataTransfer.files));
  });
});

async function confirmUpload() {
  if (!pendingFiles.length) return;
  const caption = document.getElementById("captionInput").value.trim();
  const progress = document.getElementById("uploadProgress");
  const fill = document.getElementById("progressFill");
  const pText = document.getElementById("progressText");
  const btn = document.getElementById("uploadConfirmBtn");

  progress.classList.remove("hidden");
  btn.disabled = true;
  btn.textContent = "Uploading...";

  let uploaded = 0, failed = 0;
  const filesToUpload = [...pendingFiles];
  pendingFiles = [];

  for (let i = 0; i < filesToUpload.length; i++) {
    const formData = new FormData();
    formData.append("photo", filesToUpload[i]);
    formData.append("caption", caption || filesToUpload[i].name.replace(/\.[^.]+$/, ""));
    pText.textContent = `Uploading ${i + 1} of ${filesToUpload.length}...`;
    fill.style.width = ((i / filesToUpload.length) * 100) + "%";
    try {
      const res = await fetch("/upload_photo", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) uploaded++; else failed++;
    } catch { failed++; }
  }

  fill.style.width = "100%";
  pText.textContent = failed
    ? `${uploaded} uploaded, ${failed} failed`
    : `${uploaded} photo${uploaded > 1 ? "s" : ""} saved 🌸`;

  setTimeout(() => {
    closeUploadModal();
    loadPhotos();
    showToast(failed ? `${uploaded} uploaded, ${failed} failed ✗` : "Memory saved 🌸");
  }, 900);
}

// ==================== LETTERS ====================
function renderLetters(letters) {
  const area = document.getElementById("contentArea");
  area.innerHTML = "";
  if (!letters.length) {
    area.innerHTML = `<div class="empty-state">No letters found... write one! 💌</div>`;
    return;
  }
  letters.forEach((letter, i) => {
    const div = document.createElement("div");
    div.className = "item";
    div.style.animationDelay = (i * 0.07) + "s";
    const preview = letter.content.replace(/<[^>]*>/g, "").substring(0, 80).trim();
    div.innerHTML = `
      <div class="item-number">Letter No. ${i + 1}</div>
      <h3>${escHtml(letter.title)}</h3>
      <p>${escHtml(preview)}…</p>
      <div class="item-footer">
        <small>${escHtml(letter.date)}</small>
        <span class="read-more">Read →</span>
      </div>
    `;
    div.addEventListener("click", () =>
      openLetter(letter.title, letter.date, letter.content, letter.filename, letter.image_url)
    );
    area.appendChild(div);
  });
}

function filterLetters() {
  const q = document.getElementById("searchInput").value.trim().toLowerCase();
  if (!q) { renderLetters(allLetters); return; }
  const filtered = allLetters.filter(l =>
    l.title.toLowerCase().includes(q) ||
    l.content.toLowerCase().includes(q) ||
    l.date.toLowerCase().includes(q)
  );
  renderLetters(filtered);
}

function openLetter(title, date, content, filename, image_url) {
  currentLetterFilename = filename;
  currentLetterImageUrl = image_url || "";
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalDate").textContent = date;
  document.getElementById("modalContent").innerHTML = content.replace(/\n/g, "<br>");

  // Show image if exists
  const imgWrap = document.getElementById("modalImageWrap");
  const imgEl = document.getElementById("modalImage");
  if (image_url) {
    imgEl.src = image_url;
    imgWrap.classList.remove("hidden");
  } else {
    imgEl.src = "";
    imgWrap.classList.add("hidden");
  }

  document.getElementById("letterModal").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeLetter() {
  document.getElementById("letterModal").classList.add("hidden");
  document.body.style.overflow = "";
}

function handleModalClick(e) {
  if (e.target === document.getElementById("letterModal")) closeLetter();
}

document.addEventListener("keydown", e => {
  if (e.key === "Escape") { closeLetter(); closeLightbox(); }
});

function renameLetter() {
  const newTitle = prompt("Enter a new title for this letter:");
  if (!newTitle || !newTitle.trim()) return;
  fetch("/rename_letter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename: currentLetterFilename, new_title: newTitle.trim() })
  })
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        document.getElementById("modalTitle").textContent = newTitle.trim();
        openFolder("letters");
        showToast("Title updated ✓");
      } else {
        showToast("Couldn't update title ✗");
      }
    })
    .catch(() => showToast("Network error ✗"));
}

// ==================== LETTER IMAGE UPLOAD ====================
function triggerLetterImageUpload() {
  document.getElementById("letterImageInput").click();
}

async function uploadLetterImage(e) {
  const file = e.target.files[0];
  if (!file || !currentLetterFilename) return;
  e.target.value = "";

  const btn = document.getElementById("attachImgBtn");
  btn.textContent = "⏳ Uploading...";
  btn.disabled = true;

  const formData = new FormData();
  formData.append("image", file);
  formData.append("letter_id", currentLetterFilename);

  try {
    const res = await fetch("/upload_letter_image", { method: "POST", body: formData });
    const data = await res.json();
    if (data.success) {
      const imgWrap = document.getElementById("modalImageWrap");
      const imgEl = document.getElementById("modalImage");
      imgEl.src = data.image_url;
      imgWrap.classList.remove("hidden");
      currentLetterImageUrl = data.image_url;
      showToast("Image attached 🌸");
      // Refresh letters list in background
      fetch("/letters").then(r => r.json()).then(d => { allLetters = d; });
    } else {
      showToast("Upload failed ✗");
    }
  } catch {
    showToast("Network error ✗");
  } finally {
    btn.innerHTML = "🖼️ Attach Image";
    btn.disabled = false;
  }
}

// ==================== LIGHTBOX ====================
function openLightbox(src) {
  document.getElementById("lightboxImg").src = src;
  document.getElementById("letterImageLightbox").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  document.getElementById("letterImageLightbox").classList.add("hidden");
  document.body.style.overflow = "";
}

// ==================== TOAST ====================
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.remove("hidden");
  t.classList.add("show");
  setTimeout(() => {
    t.classList.remove("show");
    setTimeout(() => t.classList.add("hidden"), 400);
  }, 2800);
}

function escHtml(str) {
  return String(str)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;");
}

// ==================== INIT ====================
openFolder("letters");

// ==================== MUSIC ====================
const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicToggle");
let musicPlaying = false;

function setMusicUI(playing) {
  musicPlaying = playing;
  musicBtn.innerHTML = playing
    ? `<span class="music-icon">♪</span> Pause`
    : `<span class="music-icon">♪</span> Music`;
  musicBtn.classList.toggle("playing", playing);
}

function toggleMusic() {
  if (!musicPlaying) {
    music.play()
      .then(() => setMusicUI(true))
      .catch(() => showToast("Tap anywhere to enable music 🎵"));
  } else {
    music.pause();
    setMusicUI(false);
  }
}

document.addEventListener("click", function initMusicOnce() {
  if (!musicPlaying) {
    music.volume = 0.7;
    music.play().then(() => setMusicUI(true)).catch(() => {});
  }
  document.removeEventListener("click", initMusicOnce);
}, { once: true });

setMusicUI(false);