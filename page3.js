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
function toggleTheme() { applyTheme(document.body.classList.contains("light") ? "dark" : "light"); }

// ==================== CONFIG ====================
const startDate = new Date("2025-12-20");
const gabBirthday    = { month: 6,  day: 15 }; // July 15   — change as needed
const clouieBirthday = { month: 10, day: 3  }; // Nov  3    — change as needed

// ==================== PLAYLIST ====================
// Add your songs here — just title + artist. The player uses love.mp3 for all
// but you can add multiple src files (song1.mp3, song2.mp3, etc.)
const playlist = [
  { title: "Love",       artist: "Wave To Earth", src: "love.mp3" },
  { title: "Risk It All",     artist: "Bruno Mars", src: "riskitall.mp3" },
  { title: "Superpowers", artist: "Daniel Caesar", src: "superpowers.mp3" },
];
let currentTrack  = 0;
let musicPlaying  = false;
const music = document.getElementById("bgMusic");

function loadTrack(idx) {
  currentTrack = (idx + playlist.length) % playlist.length;
  const track = playlist[currentTrack];
  music.src = track.src;
  music.load();
  document.getElementById("playerTitle").textContent  = track.title;
  document.getElementById("playerArtist").textContent = track.artist;
}

function setMusicUI(playing) {
  musicPlaying = playing;
  document.getElementById("playPauseBtn").textContent = playing ? "⏸" : "▶";
}

function toggleMusic() {
  if (!musicPlaying) {
    music.play().then(() => setMusicUI(true)).catch(() => showToast("Tap anywhere to enable music 🎵"));
  } else { music.pause(); setMusicUI(false); }
}

function prevSong() {
  loadTrack(currentTrack - 1);
  if (musicPlaying) music.play().catch(() => {});
}
function nextSong() {
  loadTrack(currentTrack + 1);
  if (musicPlaying) music.play().catch(() => {});
}
function setVolume(val) { music.volume = parseFloat(val); }

music.addEventListener("ended", () => { nextSong(); });

document.addEventListener("click", function initMusicOnce() {
  music.volume = 0.7;
  document.getElementById("volSlider").value = 0.7;
  music.play().then(() => setMusicUI(true)).catch(() => {});
  document.removeEventListener("click", initMusicOnce);
}, { once: true });

loadTrack(0);

// ==================== LOVE NOTES ====================
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
  return { days:Math.floor(s/86400), hours:Math.floor((s%86400)/3600), mins:Math.floor((s%3600)/60), secs:s%60, done:false };
}
function tickNum(el, val) {
  if (!el) return;
  el.classList.remove("tick"); void el.offsetWidth; el.classList.add("tick");
  el.textContent = val;
  setTimeout(() => el.classList.remove("tick"), 200);
}
function getNextBirthday(month, day) {
  const now = new Date();
  let c = new Date(now.getFullYear(), month, day, 0, 0, 0);
  if (c <= now) c = new Date(now.getFullYear() + 1, month, day, 0, 0, 0);
  return c;
}
function getNextMonthsary() {
  const now = new Date();
  let y = now.getFullYear(), m = now.getMonth();
  let c = new Date(y, m, 20, 0, 0, 0);
  if (c <= now) { m++; if (m > 11) { m = 0; y++; } c = new Date(y, m, 20, 0, 0, 0); }
  return c;
}

const anniversaryDate = new Date("2026-12-20T00:00:00");
let lastMSecs=-1, lastASecs=-1, lastGBSecs=-1, lastCBSecs=-1;

// ==================== MAIN UPDATE ====================
function updateAll() {
  const now = new Date();
  const diff = now - startDate;
  const totalDays = Math.floor(diff / 864e5);
  document.getElementById("statMonths").textContent = `${Math.floor(totalDays/30)} months`;
  document.getElementById("statDays").textContent   = `${totalDays%30} days together`;
  document.getElementById("headerSub").textContent  = `${totalDays} days of loving you ♥`;

  const nextM = getNextMonthsary();
  const mT    = timeTo(nextM);
  document.getElementById("monthsaryDateText").textContent = mT.done ? "Happy Monthsary! 🎉" : nextM.toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});
  document.getElementById("statNext").textContent = mT.done ? "Happy Monthsary! 🎉" : `${mT.days}d ${pad(mT.hours)}h left`;
  if (mT.secs !== lastMSecs) {
    tickNum(document.getElementById("mDays"),  pad(mT.days));
    tickNum(document.getElementById("mHours"), pad(mT.hours));
    tickNum(document.getElementById("mMins"),  pad(mT.mins));
    tickNum(document.getElementById("mSecs"),  pad(mT.secs));
    lastMSecs = mT.secs;
  }

  const aT = timeTo(anniversaryDate);
  if (aT.secs !== lastASecs) {
    tickNum(document.getElementById("aDays"),  pad(aT.days));
    tickNum(document.getElementById("aHours"), pad(aT.hours));
    tickNum(document.getElementById("aMins"),  pad(aT.mins));
    tickNum(document.getElementById("aSecs"),  pad(aT.secs));
    lastASecs = aT.secs;
  }
  if (aT.done) document.getElementById("anniversaryCard").querySelector(".countdown-date-text").textContent = "Happy Anniversary! 🥂";

  const gN = getNextBirthday(gabBirthday.month, gabBirthday.day);
  const gT = timeTo(gN);
  document.getElementById("gabBdayDate").textContent = gT.done ? "Happy Birthday Gab! 🎂" : gN.toLocaleDateString("en-US",{month:"long",day:"numeric"});
  if (gT.secs !== lastGBSecs) {
    tickNum(document.getElementById("gb1"), pad(gT.days));
    tickNum(document.getElementById("gb2"), pad(gT.hours));
    tickNum(document.getElementById("gb3"), pad(gT.mins));
    tickNum(document.getElementById("gb4"), pad(gT.secs));
    lastGBSecs = gT.secs;
  }

  const cN = getNextBirthday(clouieBirthday.month, clouieBirthday.day);
  const cT = timeTo(cN);
  document.getElementById("clouieBdayDate").textContent = cT.done ? "Happy Birthday Clouie! 🎂" : cN.toLocaleDateString("en-US",{month:"long",day:"numeric"});
  if (cT.secs !== lastCBSecs) {
    tickNum(document.getElementById("cb1"), pad(cT.days));
    tickNum(document.getElementById("cb2"), pad(cT.hours));
    tickNum(document.getElementById("cb3"), pad(cT.mins));
    tickNum(document.getElementById("cb4"), pad(cT.secs));
    lastCBSecs = cT.secs;
  }
}
updateAll();
setInterval(updateAll, 1000);
initLoveNote();

// ==================== NAV ====================
let currentFolder = "letters";
let allLetters = [], allPhotos = [];

function setActiveNav(type) {
  ["letters","photos","timeline","bucket"].forEach(t => {
    const el = document.getElementById("nav" + t.charAt(0).toUpperCase() + t.slice(1));
    if (el) el.classList.toggle("active", t === type);
  });
  document.getElementById("searchWrap").classList.toggle("hidden",    type !== "letters");
  document.getElementById("letterToolbar").classList.toggle("hidden", type !== "letters");
  document.getElementById("photoToolbar").classList.toggle("hidden",  type !== "photos");
  document.getElementById("bucketToolbar").classList.toggle("hidden", type !== "bucket");
  currentFolder = type;
}

function openFolder(type) {
  setActiveNav(type);
  const area = document.getElementById("contentArea");
  area.innerHTML = `<div class="empty-state">Loading...</div>`;
  if (type === "letters")  loadLetters();
  if (type === "photos")   loadPhotos();
  if (type === "timeline") loadTimeline();
  if (type === "bucket")   loadBucket();
}

// ==================== LETTERS ====================
function loadLetters() {
  fetch("/letters")
    .then(r => r.json())
    .then(data => { allLetters = data; renderLetters(data); })
    .catch(() => { document.getElementById("contentArea").innerHTML = `<div class="empty-state">Couldn't load letters 🌸</div>`; });
}

function renderLetters(letters) {
  const area = document.getElementById("contentArea");
  area.innerHTML = "";
  if (!letters.length) { area.innerHTML = `<div class="empty-state">No letters yet... write one! 💌</div>`; return; }
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
    div.addEventListener("click", () => openLetter(letter.title, letter.date, letter.content, letter.filename, letter.image_url));
    area.appendChild(div);
  });
}

function filterLetters() {
  const q = document.getElementById("searchInput").value.trim().toLowerCase();
  if (!q) { renderLetters(allLetters); return; }
  renderLetters(allLetters.filter(l =>
    l.title.toLowerCase().includes(q) || l.content.toLowerCase().includes(q) || l.date.toLowerCase().includes(q)
  ));
}

// Letter variables
let currentLetterFilename = "", currentLetterTitle = "", currentLetterContent = "", currentLetterImageUrl = "";
let isEditMode = false;

function openLetter(title, date, content, filename, image_url) {
  currentLetterFilename = filename;
  currentLetterTitle    = title;
  currentLetterContent  = content;
  currentLetterImageUrl = image_url || "";
  document.getElementById("modalTitle").textContent  = title;
  document.getElementById("modalDate").textContent   = date;
  document.getElementById("modalContent").innerHTML  = content.replace(/\n/g, "<br>");
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
function handleModalClick(e) { if (e.target === document.getElementById("letterModal")) closeLetter(); }

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
function handleWriteModalClick(e) { if (e.target === document.getElementById("writeModal")) closeWriteModal(); }

async function submitLetter() {
  const title   = document.getElementById("writeTitle").value.trim();
  const content = document.getElementById("writeContent").value.trim();
  if (!title)   { showToast("Please add a title 💌"); return; }
  if (!content) { showToast("Please write something 💌"); return; }

  const btn = document.getElementById("writeSubmitBtn");
  const orig = btn.textContent;
  btn.textContent = isEditMode ? "Saving..." : "Sending...";
  btn.disabled = true;

  try {
    const url  = isEditMode ? "/edit_letter" : "/add_letter";
    const body = isEditMode
      ? { id: currentLetterFilename, title, content }
      : { title, content };
    const res  = await fetch(url, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) });
    const data = await res.json();
    if (data.success) {
      if (isEditMode) {
        currentLetterTitle   = title;
        currentLetterContent = content;
        document.getElementById("modalTitle").textContent = title;
        document.getElementById("modalContent").innerHTML = content.replace(/\n/g, "<br>");
      }
      closeWriteModal();
      showToast(isEditMode ? "Letter updated ✓" : "Letter sent 💌");
      loadLetters();
    } else showToast(isEditMode ? "Couldn't update ✗" : "Couldn't send ✗");
  } catch { showToast("Network error ✗"); }
  finally  { btn.textContent = orig; btn.disabled = false; }
}

function deleteLetter() {
  if (!confirm("Delete this letter forever? 💔")) return;
  fetch("/delete_letter", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ id: currentLetterFilename }) })
    .then(r => r.json())
    .then(d => { if (d.success) { closeLetter(); showToast("Letter deleted 💔"); loadLetters(); } else showToast("Couldn't delete ✗"); })
    .catch(() => showToast("Network error ✗"));
}

function triggerLetterImageUpload() { document.getElementById("letterImageInput").click(); }
async function uploadLetterImage(e) {
  const file = e.target.files[0];
  if (!file || !currentLetterFilename) return;
  e.target.value = "";
  const btn = document.getElementById("attachImgBtn");
  btn.textContent = "⏳"; btn.disabled = true;
  const formData = new FormData();
  formData.append("image", file);
  formData.append("letter_id", currentLetterFilename);
  try {
    const res  = await fetch("/upload_letter_image", { method:"POST", body:formData });
    const data = await res.json();
    if (data.success) {
      document.getElementById("modalImage").src = data.image_url;
      document.getElementById("modalImageWrap").classList.remove("hidden");
      currentLetterImageUrl = data.image_url;
      showToast("Image attached 🌸");
    } else showToast("Upload failed ✗");
  } catch { showToast("Network error ✗"); }
  finally  { btn.innerHTML = "🖼️ Image"; btn.disabled = false; }
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
      if (!data.length) { area.innerHTML = `<div class="empty-state">No memories yet... tap <strong>Add Memory</strong> 🌸</div>`; return; }
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
  fetch("/delete_photo", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ filename }) })
    .then(r => r.json())
    .then(d => { if (d.success) { showToast("Memory removed 🌸"); loadPhotos(); } else showToast("Couldn't delete ✗"); })
    .catch(() => showToast("Network error ✗"));
}

// Upload modal
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
function closeUploadModal() { document.getElementById("uploadModal").classList.add("hidden"); document.body.style.overflow = ""; pendingFiles = []; }
function handleUploadModalClick(e) { if (e.target === document.getElementById("uploadModal")) closeUploadModal(); }
function handleFileSelect(e) { const files = Array.from(e.target.files||[]); if (!files.length) return; addPendingFiles(files); openUploadModal(); e.target.value = ""; }

function addPendingFiles(files) {
  const grid = document.getElementById("uploadPreviewGrid");
  files.forEach(file => {
    if (!file.type.startsWith("image/")) return;
    pendingFiles.push(file);
    const thumb = document.createElement("div");
    thumb.className = "preview-thumb";
    const reader = new FileReader();
    reader.onload = ev => { thumb.innerHTML = `<img src="${ev.target.result}" /><button class="preview-remove" onclick="removePending(this)">✕</button>`; };
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
  pendingFiles.splice(Array.from(thumb.parentElement.children).indexOf(thumb), 1);
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
  const fill = document.getElementById("progressFill");
  const pText = document.getElementById("progressText");
  const btn = document.getElementById("uploadConfirmBtn");
  document.getElementById("uploadProgress").classList.remove("hidden");
  btn.disabled = true; btn.textContent = "Uploading...";
  let uploaded = 0, failed = 0;
  const files = [...pendingFiles]; pendingFiles = [];
  for (let i = 0; i < files.length; i++) {
    const fd = new FormData();
    fd.append("photo", files[i]);
    fd.append("caption", caption || files[i].name.replace(/\.[^.]+$/, ""));
    pText.textContent = `Uploading ${i+1} of ${files.length}...`;
    fill.style.width = ((i / files.length) * 100) + "%";
    try { const r = await fetch("/upload_photo",{method:"POST",body:fd}); const d = await r.json(); if(d.success) uploaded++; else failed++; } catch { failed++; }
  }
  fill.style.width = "100%";
  pText.textContent = failed ? `${uploaded} uploaded, ${failed} failed` : `${uploaded} photo${uploaded>1?"s":""} saved 🌸`;
  setTimeout(() => { closeUploadModal(); loadPhotos(); showToast(failed ? `${uploaded} uploaded, ${failed} failed ✗` : "Memory saved 🌸"); }, 900);
}

// ==================== TIMELINE ====================
async function loadTimeline() {
  const area = document.getElementById("contentArea");
  area.innerHTML = `<div class="empty-state">Loading timeline...</div>`;
  try {
    const [lettersData, photosData, bucketData] = await Promise.all([
      fetch("/letters").then(r => r.json()),
      fetch("/photos").then(r => r.json()),
      fetch("/bucket").then(r => r.json())
    ]);
    allLetters = lettersData; allPhotos = photosData;

    const achieved = bucketData.filter(b => b.achieved && b.achieved_at);
    const items = [
      ...lettersData.map(l => ({ type:"letter",  date: l.date, data: l })),
      ...photosData.map(p  => ({ type:"photo",   date: new Date().toISOString().slice(0,10), data: p })),
      ...achieved.map(b   => ({ type:"bucket",  date: b.achieved_at.slice(0,10), data: b }))
    ].sort((a,b) => new Date(b.date) - new Date(a.date));

    area.innerHTML = "";
    if (!items.length) { area.innerHTML = `<div class="empty-state">Nothing on the timeline yet 🌸</div>`; return; }

    const wrap = document.createElement("div");
    wrap.className = "timeline-wrap";

    items.forEach((item, i) => {
      const tItem = document.createElement("div");
      tItem.className = `timeline-item ${item.type}-type`;
      tItem.style.animationDelay = (i * 0.06) + "s";
      const dateLabel = new Date(item.date).toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" });

      if (item.type === "letter") {
        const preview = item.data.content.replace(/<[^>]*>/g,"").substring(0,80).trim();
        tItem.innerHTML = `
          <div class="timeline-date-label">${dateLabel}</div>
          <div class="timeline-card">
            <span class="timeline-type-badge letter">💌 Letter</span>
            <div class="timeline-card-title">${escHtml(item.data.title)}</div>
            <div class="timeline-card-preview">${escHtml(preview)}…</div>
          </div>
        `;
        tItem.querySelector(".timeline-card").addEventListener("click", () =>
          openLetter(item.data.title, item.data.date, item.data.content, item.data.filename, item.data.image_url)
        );
      } else if (item.type === "photo") {
        tItem.innerHTML = `
          <div class="timeline-date-label">${dateLabel}</div>
          <div class="timeline-card photo-type">
            <span class="timeline-type-badge photo" style="margin:10px 10px 0;">🌸 Memory</span>
            <img src="${escHtml(item.data.url)}" alt="${escHtml(item.data.caption)}" loading="lazy" />
            <div class="timeline-card-caption">${escHtml(item.data.caption) || "A precious memory"}</div>
          </div>
        `;
      } else {
        tItem.innerHTML = `
          <div class="timeline-date-label">${dateLabel}</div>
          <div class="timeline-card">
            <span class="timeline-type-badge achieved">🥂 Goal Achieved!</span>
            <div class="timeline-card-title">${escHtml(item.data.goal)}</div>
            <div class="timeline-card-preview">You did it together. 🌟</div>
          </div>
        `;
      }
      wrap.appendChild(tItem);
    });
    area.appendChild(wrap);
  } catch { area.innerHTML = `<div class="empty-state">Couldn't load timeline 🌸</div>`; }
}

// ==================== BUCKET LIST ====================
async function loadBucket() {
  const area = document.getElementById("contentArea");
  area.innerHTML = `<div class="empty-state">Loading...</div>`;
  try {
    const data = await fetch("/bucket").then(r => r.json());
    area.innerHTML = "";

    const pending  = data.filter(b => !b.achieved);
    const achieved = data.filter(b => b.achieved);
    const total    = data.length;
    const doneCount = achieved.length;

    // Progress bar
    const progressPct = total ? Math.round((doneCount / total) * 100) : 0;
    const statsEl = document.createElement("div");
    statsEl.className = "bucket-progress-wrap";
    statsEl.style.gridColumn = "1 / -1";
    statsEl.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:8px;">
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          <div class="bucket-stat-pill">🌟 ${total} total goals</div>
          <div class="bucket-stat-pill">🥂 ${doneCount} achieved</div>
          <div class="bucket-stat-pill">💭 ${pending.length} to go</div>
        </div>
      </div>
      <div class="bucket-progress-bar">
        <div class="bucket-progress-fill" style="width:${progressPct}%"></div>
      </div>
      <div class="bucket-progress-label">${progressPct}% of your bucket list complete ♥</div>
    `;
    area.appendChild(statsEl);

    if (!data.length) {
      const emptyEl = document.createElement("div");
      emptyEl.className = "empty-state";
      emptyEl.style.gridColumn = "1 / -1";
      emptyEl.innerHTML = "No goals yet... add your first dream together! 🌟";
      area.appendChild(emptyEl);
      return;
    }

    // Pending goals
    if (pending.length) {
      const secTitle = document.createElement("div");
      secTitle.className = "bucket-section-title";
      secTitle.style.gridColumn = "1 / -1";
      secTitle.textContent = "💭 Dreams to chase";
      area.appendChild(secTitle);

      pending.forEach((item, i) => {
        area.appendChild(makeBucketItem(item, i));
      });
    }

    // Achieved goals
    if (achieved.length) {
      const secTitle = document.createElement("div");
      secTitle.className = "bucket-section-title";
      secTitle.style.gridColumn = "1 / -1";
      secTitle.textContent = "🥂 Dreams achieved";
      area.appendChild(secTitle);

      achieved.forEach((item, i) => {
        area.appendChild(makeBucketItem(item, i));
      });
    }

  } catch { area.innerHTML = `<div class="empty-state">Couldn't load bucket list 🌸</div>`; }
}

function makeBucketItem(item, idx) {
  const div = document.createElement("div");
  div.className = `bucket-item${item.achieved ? " achieved" : ""}`;
  div.style.animationDelay = (idx * 0.06) + "s";
  div.style.gridColumn = "1 / -1";

  div.innerHTML = `
    <button class="bucket-check" onclick="toggleBucket(${item.id}, ${!item.achieved})" title="${item.achieved ? "Mark undone" : "Mark done"}">
      ${item.achieved ? "✓" : ""}
    </button>
    <span class="bucket-goal">${escHtml(item.goal)}</span>
    ${item.achieved ? `<span class="bucket-achieved-badge">🥂 Achieved</span>` : ""}
    <div class="bucket-actions">
      ${!item.achieved ? `<button class="bucket-action-btn" onclick="editBucketItem(${item.id}, '${escHtml(item.goal).replace(/'/g,"\\'")}', event)" title="Edit">✏️</button>` : ""}
      <button class="bucket-action-btn del" onclick="deleteBucketItem(${item.id}, event)" title="Delete">✕</button>
    </div>
  `;
  return div;
}

async function toggleBucket(id, achieved) {
  try {
    const res  = await fetch("/update_bucket", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggle", id, achieved })
    });
    const data = await res.json();
    if (data.success) {
      showToast(achieved ? "Goal achieved! 🥂" : "Marked as undone");
      loadBucket();
    } else showToast("Couldn't update ✗");
  } catch { showToast("Network error ✗"); }
}

async function deleteBucketItem(id, e) {
  e.stopPropagation();
  if (!confirm("Remove this goal?")) return;
  try {
    const res  = await fetch("/update_bucket", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id })
    });
    const data = await res.json();
    if (data.success) { showToast("Goal removed"); loadBucket(); }
    else showToast("Couldn't delete ✗");
  } catch { showToast("Network error ✗"); }
}

async function editBucketItem(id, currentGoal, e) {
  e.stopPropagation();
  const newGoal = prompt("Edit your goal:", currentGoal);
  if (!newGoal || !newGoal.trim()) return;
  try {
    const res  = await fetch("/update_bucket", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "edit", id, goal: newGoal.trim() })
    });
    const data = await res.json();
    if (data.success) { showToast("Goal updated ✓"); loadBucket(); }
    else showToast("Couldn't update ✗");
  } catch { showToast("Network error ✗"); }
}

// Add goal modal
function openAddGoalModal() {
  document.getElementById("goalInput").value = "";
  document.getElementById("addGoalModal").classList.remove("hidden");
  document.body.style.overflow = "hidden";
  setTimeout(() => document.getElementById("goalInput").focus(), 100);
}
function closeAddGoalModal() { document.getElementById("addGoalModal").classList.add("hidden"); document.body.style.overflow = ""; }
function handleGoalModalClick(e) { if (e.target === document.getElementById("addGoalModal")) closeAddGoalModal(); }

async function submitGoal() {
  const goal = document.getElementById("goalInput").value.trim();
  if (!goal) { showToast("Please enter a goal 🌟"); return; }
  const btn = document.getElementById("goalSubmitBtn");
  btn.textContent = "Adding..."; btn.disabled = true;
  try {
    const res  = await fetch("/add_bucket", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ goal }) });
    const data = await res.json();
    if (data.success) { closeAddGoalModal(); showToast("Goal added 🌟"); loadBucket(); }
    else showToast("Couldn't add goal ✗");
  } catch { showToast("Network error ✗"); }
  finally  { btn.textContent = "Add Goal 🌟"; btn.disabled = false; }
}

// ==================== LIGHTBOX ====================
function openLightbox(src) { document.getElementById("lightboxImg").src = src; document.getElementById("letterImageLightbox").classList.remove("hidden"); document.body.style.overflow = "hidden"; }
function closeLightbox()    { document.getElementById("letterImageLightbox").classList.add("hidden"); document.body.style.overflow = ""; }

// ==================== TOAST ====================
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg; t.classList.remove("hidden"); t.classList.add("show");
  setTimeout(() => { t.classList.remove("show"); setTimeout(() => t.classList.add("hidden"), 400); }, 2800);
}

function escHtml(str) {
  return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

document.addEventListener("keydown", e => {
  if (e.key === "Escape") { closeLetter(); closeLightbox(); closeWriteModal(); closeAddGoalModal(); }
});

// ==================== INIT ====================
openFolder("letters");