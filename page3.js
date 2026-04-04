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
  applyTheme(document.body.classList.contains("light") ? "dark" : "light");
}

// ==================== CONFIG ====================
const startDate = new Date("2025-12-20");

// 🎂 Set birthdays here (month is 0-indexed: 0=Jan, 1=Feb ...)
const gabBirthday   = { month: 11,  day: 5, name: "Gabriel" };    
const clouieBirthday = { month: 7, day: 31,  name: "Clouie" }; 

let currentLetterFilename = "";
let currentLetterContent  = "";
let currentLetterTitle    = "";
let currentLetterImageUrl = "";
let allLetters  = [];
let allPhotos   = [];
let currentFolder = "letters";
let isEditMode  = false;

// ==================== DAILY LOVE NOTES ====================
const loveNotes = [
  "You are my favorite notification. 🌸",
  "Every day with you feels like the best day of my life.",
  "I fall in love with you a little more every single day.",
  "You are my sunshine on the cloudiest days. ☀️",
  "Thank you for choosing me, every single day. 💌",
  "With you, ordinary moments feel extraordinary.",
  "You make my heart do ridiculous things. 💓",
  "I love you more than yesterday, less than tomorrow.",
  "You are my favorite person in the whole world. 🌍",
  "Being loved by you is the greatest gift. 🎁",
  "You are the reason I smile for no reason at all.",
  "Home is wherever I'm with you. 🏡",
  "I never want to stop making memories with you.",
  "You are my peace, my joy, and my adventure. 🌺",
  "Every love song finally makes sense because of you.",
  "I am so lucky to call you mine. 🍀",
  "You are the best thing that ever happened to me.",
  "My heart knew you before we even met. 💫",
  "With you, forever doesn't feel long enough.",
  "You are my person. Always and forever. ♥",
  "Loving you is the easiest thing I've ever done.",
  "You make every day worth living. 🌷",
  "I choose you. Today, tomorrow, always.",
  "You are my calm in every storm. 🌈",
  "Every moment with you is a treasure I keep forever.",
  "You are my greatest adventure. 🗺️",
  "I love the way you love me. 💝",
  "You light up every room and every corner of my heart.",
  "I am endlessly grateful for you. 🌙",
  "You are my today and all of my tomorrows. ✨"
];

function initLoveNote() {
  const today = new Date();
  const idx = (today.getFullYear() * 1000 + today.getMonth() * 31 + today.getDate()) % loveNotes.length;
  document.getElementById("loveNoteText").textContent = loveNotes[idx];
}

// ==================== PETALS ====================
(function spawnPetals() {
  const container = document.getElementById("petalsContainer");
  const petals = ["🌸","🌺","✿","❀","🌷","·","∘"];
  const count = window.innerWidth <= 480 ? 10 : 22;
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

// ==================== HELPERS ====================
function pad(n) { return String(n).padStart(2, "0"); }

function timeTo(target) {
  const diff = target - new Date();
  if (diff <= 0) return { days:0, hours:0, mins:0, secs:0, done:true };
  const s = Math.floor(diff / 1000);
  return { days: Math.floor(s/86400), hours: Math.floor((s%86400)/3600), mins: Math.floor((s%3600)/60), secs: s%60, done:false };
}

function tickNum(el, val) {
  if (!el) return;
  el.classList.remove("tick");
  void el.offsetWidth;
  el.classList.add("tick");
  el.textContent = val;
  setTimeout(() => el.classList.remove("tick"), 200);
}

// ==================== BIRTHDAY HELPERS ====================
function getNextBirthday(month, day) {
  const now = new Date();
  let candidate = new Date(now.getFullYear(), month, day, 0, 0, 0);
  if (candidate <= now) candidate = new Date(now.getFullYear() + 1, month, day, 0, 0, 0);
  return candidate;
}

// ==================== MONTHSARY ====================
function getNextMonthsary() {
  const now = new Date();
  let y = now.getFullYear(), m = now.getMonth();
  let c = new Date(y, m, 20, 0, 0, 0);
  if (c <= now) { m++; if (m > 11) { m = 0; y++; } c = new Date(y, m, 20, 0, 0, 0); }
  return c;
}

const anniversaryDate = new Date("2026-12-20T00:00:00");
let lastMSecs = -1, lastASecs = -1, lastGBSecs = -1, lastCBSecs = -1;

// ==================== MAIN UPDATE ====================
function updateAll() {
  const now  = new Date();
  const diff = now - startDate;
  const totalDays     = Math.floor(diff / 864e5);
  const months        = Math.floor(totalDays / 30);
  const remainingDays = totalDays % 30;

  document.getElementById("statMonths").textContent = `${months} months`;
  document.getElementById("statDays").textContent   = `${remainingDays} days together`;
  document.getElementById("headerSub").textContent  = `${totalDays} days of loving you ♥`;

  // Monthsary
  const nextM  = getNextMonthsary();
  const mT     = timeTo(nextM);
  const mLabel = nextM.toLocaleDateString("en-US", { month:"long", day:"numeric", year:"numeric" });
  document.getElementById("monthsaryDateText").textContent = mT.done ? "Happy Monthsary! 🎉" : mLabel;
  document.getElementById("statNext").textContent = mT.done ? "Happy Monthsary! 🎉" : `${mT.days}d ${pad(mT.hours)}h left`;
  if (mT.secs !== lastMSecs) {
    tickNum(document.getElementById("mDays"),  pad(mT.days));
    tickNum(document.getElementById("mHours"), pad(mT.hours));
    tickNum(document.getElementById("mMins"),  pad(mT.mins));
    tickNum(document.getElementById("mSecs"),  pad(mT.secs));
    lastMSecs = mT.secs;
  }

  // Anniversary
  const aT = timeTo(anniversaryDate);
  if (aT.secs !== lastASecs) {
    tickNum(document.getElementById("aDays"),  pad(aT.days));
    tickNum(document.getElementById("aHours"), pad(aT.hours));
    tickNum(document.getElementById("aMins"),  pad(aT.mins));
    tickNum(document.getElementById("aSecs"),  pad(aT.secs));
    lastASecs = aT.secs;
  }
  if (aT.done) {
    document.getElementById("anniversaryCard").querySelector(".countdown-date-text").textContent = "Happy Anniversary! 🥂";
  }

  // Gab Birthday
  const gabNext = getNextBirthday(gabBirthday.month, gabBirthday.day);
  const gT = timeTo(gabNext);
  document.getElementById("gabBdayDate").textContent = gabNext.toLocaleDateString("en-US", { month:"long", day:"numeric" });
  if (gT.secs !== lastGBSecs) {
    tickNum(document.getElementById("gb1"), pad(gT.days));
    tickNum(document.getElementById("gb2"), pad(gT.hours));
    tickNum(document.getElementById("gb3"), pad(gT.mins));
    tickNum(document.getElementById("gb4"), pad(gT.secs));
    lastGBSecs = gT.secs;
  }
  if (gT.done) document.getElementById("gabBdayDate").textContent = "Happy Birthday Gab! 🎂";

  // Clouie Birthday
  const clouieNext = getNextBirthday(clouieBirthday.month, clouieBirthday.day);
  const cT = timeTo(clouieNext);
  document.getElementById("clouieBdayDate").textContent = clouieNext.toLocaleDateString("en-US", { month:"long", day:"numeric" });
  if (cT.secs !== lastCBSecs) {
    tickNum(document.getElementById("cb1"), pad(cT.days));
    tickNum(document.getElementById("cb2"), pad(cT.hours));
    tickNum(document.getElementById("cb3"), pad(cT.mins));
    tickNum(document.getElementById("cb4"), pad(cT.secs));
    lastCBSecs = cT.secs;
  }
  if (cT.done) document.getElementById("clouieBdayDate").textContent = "Happy Birthday Clouie! 🎂";
}

updateAll();
setInterval(updateAll, 1000);
initLoveNote();

// ==================== NAV ====================
function setActiveNav(type) {
  document.getElementById("navLetters").classList.toggle("active",  type === "letters");
  document.getElementById("navPhotos").classList.toggle("active",   type === "photos");
  document.getElementById("navTimeline").classList.toggle("active", type === "timeline");
  document.getElementById("searchWrap").classList.toggle("hidden",  type !== "letters");
  document.getElementById("letterToolbar").classList.toggle("hidden", type !== "letters");
  document.getElementById("photoToolbar").classList.toggle("hidden",  type !== "photos");
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
  if (type === "timeline") loadTimeline();
}

// ==================== PHOTOS ====================
function loadPhotos() {
  const area = document.getElementById("contentArea");
  area.innerHTML = `<div class="empty-state">Loading...</div>`;
  fetch("/photos")
    .then(r => r.json())
    .then(data => {
      allPhotos = data;
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
          <p class="photo-caption">${escHtml(photo.caption) || "&nbsp;"}</p>
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
    .then(d => { if (d.success) { showToast("Memory removed 🌸"); loadPhotos(); } else showToast("Couldn't delete ✗"); })
    .catch(() => showToast("Network error ✗"));
}

// ==================== TIMELINE ====================
async function loadTimeline() {
  const area = document.getElementById("contentArea");
  area.innerHTML = `<div class="empty-state">Loading timeline...</div>`;

  try {
    // Fetch both in parallel
    const [lettersRes, photosRes] = await Promise.all([
      fetch("/letters").then(r => r.json()),
      fetch("/photos").then(r => r.json())
    ]);

    allLetters = lettersRes;
    allPhotos  = photosRes;

    // Merge and sort by date descending
    const items = [
      ...lettersRes.map(l => ({ type: "letter", date: l.date, data: l })),
      ...photosRes.map(p => ({
        type: "photo",
        date: p.uploaded_at || new Date().toISOString().slice(0, 10),
        data: p
      }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    area.innerHTML = "";
    if (!items.length) {
      area.innerHTML = `<div class="empty-state">Nothing on the timeline yet 🌸</div>`;
      return;
    }

    const wrap = document.createElement("div");
    wrap.className = "timeline-wrap";

    items.forEach((item, i) => {
      const tItem = document.createElement("div");
      tItem.className = `timeline-item ${item.type}-type`;
      tItem.style.animationDelay = (i * 0.06) + "s";

      const dateLabel = new Date(item.date).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric"
      });

      if (item.type === "letter") {
        const preview = item.data.content.replace(/<[^>]*>/g, "").substring(0, 80).trim();
        tItem.innerHTML = `
          <div class="timeline-date-label">${dateLabel}</div>
          <div class="timeline-card" onclick="openLetter('${escHtml(item.data.title)}','${escHtml(item.data.date)}','${escHtml(item.data.content).replace(/'/g,"\\'")}','${escHtml(item.data.filename)}','${escHtml(item.data.image_url)}')">
            <div><span class="timeline-type-badge letter">💌 Letter</span></div>
            <div class="timeline-card-title">${escHtml(item.data.title)}</div>
            <div class="timeline-card-preview">${escHtml(preview)}…</div>
          </div>
        `;
      } else {
        tItem.innerHTML = `
          <div class="timeline-date-label">${dateLabel}</div>
          <div class="timeline-card photo-type">
            <span class="timeline-type-badge photo" style="margin:10px 10px 0;">🌸 Memory</span>
            <img src="${escHtml(item.data.url)}" alt="${escHtml(item.data.caption)}" loading="lazy" />
            <div class="timeline-card-caption">${escHtml(item.data.caption) || "A precious memory"}</div>
          </div>
        `;
      }

      wrap.appendChild(tItem);
    });

    area.appendChild(wrap);

  } catch {
    area.innerHTML = `<div class="empty-state">Couldn't load timeline 🌸</div>`;
  }
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
      thumb.innerHTML = `<img src="${ev.target.result}" alt="preview" /><button class="preview-remove" onclick="removePending(this)">✕</button>`;
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

function removePending(btn) {
  const thumb = btn.parentElement;
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
  dz.addEventListener("drop", e => { e.preventDefault(); dz.classList.remove("drag-over"); addPendingFiles(Array.from(e.dataTransfer.files)); });
});

async function confirmUpload() {
  if (!pendingFiles.length) return;
  const caption = document.getElementById("captionInput").value.trim();
  const progress = document.getElementById("uploadProgress");
  const fill     = document.getElementById("progressFill");
  const pText    = document.getElementById("progressText");
  const btn      = document.getElementById("uploadConfirmBtn");

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
      const d   = await res.json();
      if (d.success) uploaded++; else failed++;
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

// ==================== WRITE / EDIT LETTER MODAL ====================
function openWriteModal() {
  isEditMode = false;
  document.getElementById("writeModalTag").textContent     = "New Letter";
  document.getElementById("writeModalHeading").textContent = "Write a Letter 💌";
  document.getElementById("writeSubmitBtn").textContent    = "Send 💌";
  document.getElementById("writeTitle").value   = "";
  document.getElementById("writeContent").value = "";
  document.getElementById("writeModal").classList.remove("hidden");
  document.body.style.overflow = "hidden";
  setTimeout(() => document.getElementById("writeTitle").focus(), 100);
}

function openEditModal() {
  isEditMode = true;
  document.getElementById("writeModalTag").textContent     = "Edit Letter";
  document.getElementById("writeModalHeading").textContent = "Edit Letter ✏️";
  document.getElementById("writeSubmitBtn").textContent    = "Save Changes ✓";
  document.getElementById("writeTitle").value   = currentLetterTitle;
  document.getElementById("writeContent").value = currentLetterContent;
  document.getElementById("writeModal").classList.remove("hidden");
  document.body.style.overflow = "hidden";
  setTimeout(() => document.getElementById("writeTitle").focus(), 100);
}

function closeWriteModal() {
  document.getElementById("writeModal").classList.add("hidden");
  document.body.style.overflow = "";
}

function handleWriteModalClick(e) {
  if (e.target === document.getElementById("writeModal")) closeWriteModal();
}

async function submitLetter() {
  const title   = document.getElementById("writeTitle").value.trim();
  const content = document.getElementById("writeContent").value.trim();
  if (!title)   { showToast("Please add a title 💌"); return; }
  if (!content) { showToast("Please write something 💌"); return; }

  const btn = document.getElementById("writeSubmitBtn");
  const original = btn.textContent;
  btn.textContent = isEditMode ? "Saving..." : "Sending...";
  btn.disabled = true;

  try {
    let res, data;
    if (isEditMode) {
      res  = await fetch("/edit_letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: currentLetterFilename, title, content })
      });
      data = await res.json();
      if (data.success) {
        // Update modal view immediately
        currentLetterTitle   = title;
        currentLetterContent = content;
        document.getElementById("modalTitle").textContent  = title;
        document.getElementById("modalContent").innerHTML  = content.replace(/\n/g, "<br>");
        closeWriteModal();
        showToast("Letter updated ✓");
        openFolder("letters");
      } else { showToast("Couldn't update ✗"); }
    } else {
      res  = await fetch("/add_letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content })
      });
      data = await res.json();
      if (data.success) {
        closeWriteModal();
        showToast("Letter sent 💌");
        openFolder("letters");
      } else { showToast("Couldn't send letter ✗"); }
    }
  } catch {
    showToast("Network error ✗");
  } finally {
    btn.textContent = original;
    btn.disabled = false;
  }
}

// ==================== LETTERS ====================
function renderLetters(letters) {
  const area = document.getElementById("contentArea");
  area.innerHTML = "";
  if (!letters.length) {
    area.innerHTML = `<div class="empty-state">No letters yet... write one! 💌</div>`;
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
  renderLetters(allLetters.filter(l =>
    l.title.toLowerCase().includes(q) ||
    l.content.toLowerCase().includes(q) ||
    l.date.toLowerCase().includes(q)
  ));
}

function openLetter(title, date, content, filename, image_url) {
  currentLetterFilename = filename;
  currentLetterTitle    = title;
  currentLetterContent  = content;
  currentLetterImageUrl = image_url || "";

  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalDate").textContent  = date;
  document.getElementById("modalContent").innerHTML = content.replace(/\n/g, "<br>");

  const imgWrap = document.getElementById("modalImageWrap");
  const imgEl   = document.getElementById("modalImage");
  if (image_url) { imgEl.src = image_url; imgWrap.classList.remove("hidden"); }
  else           { imgEl.src = "";        imgWrap.classList.add("hidden"); }

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
  if (e.key === "Escape") { closeLetter(); closeLightbox(); closeWriteModal(); }
});

// ==================== DELETE LETTER ====================
function deleteLetter() {
  if (!confirm("Delete this letter forever? 💔")) return;
  fetch("/delete_letter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: currentLetterFilename })
  })
    .then(r => r.json())
    .then(data => {
      if (data.success) { closeLetter(); showToast("Letter deleted 💔"); openFolder("letters"); }
      else showToast("Couldn't delete ✗");
    })
    .catch(() => showToast("Network error ✗"));
}

// ==================== LETTER IMAGE ====================
function triggerLetterImageUpload() {
  document.getElementById("letterImageInput").click();
}

async function uploadLetterImage(e) {
  const file = e.target.files[0];
  if (!file || !currentLetterFilename) return;
  e.target.value = "";

  const btn = document.getElementById("attachImgBtn");
  btn.textContent = "⏳";
  btn.disabled = true;

  const formData = new FormData();
  formData.append("image", file);
  formData.append("letter_id", currentLetterFilename);

  try {
    const res  = await fetch("/upload_letter_image", { method: "POST", body: formData });
    const data = await res.json();
    if (data.success) {
      document.getElementById("modalImage").src = data.image_url;
      document.getElementById("modalImageWrap").classList.remove("hidden");
      currentLetterImageUrl = data.image_url;
      showToast("Image attached 🌸");
      fetch("/letters").then(r => r.json()).then(d => { allLetters = d; });
    } else showToast("Upload failed ✗");
  } catch {
    showToast("Network error ✗");
  } finally {
    btn.innerHTML = "🖼️ Image";
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
  setTimeout(() => { t.classList.remove("show"); setTimeout(() => t.classList.add("hidden"), 400); }, 2800);
}

function escHtml(str) {
  return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

// ==================== INIT ====================
openFolder("letters");

// ==================== MUSIC ====================
const music    = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicToggle");
let musicPlaying = false;

function setMusicUI(playing) {
  musicPlaying = playing;
  musicBtn.innerHTML = playing ? `<span class="music-icon">♪</span> Pause` : `<span class="music-icon">♪</span> Music`;
  musicBtn.classList.toggle("playing", playing);
}

function toggleMusic() {
  if (!musicPlaying) {
    music.play().then(() => setMusicUI(true)).catch(() => showToast("Tap anywhere to enable music 🎵"));
  } else { music.pause(); setMusicUI(false); }
}

document.addEventListener("click", function initMusicOnce() {
  if (!musicPlaying) { music.volume = 0.7; music.play().then(() => setMusicUI(true)).catch(() => {}); }
  document.removeEventListener("click", initMusicOnce);
}, { once: true });

setMusicUI(false);