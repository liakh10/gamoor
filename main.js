/* ---------- GAME DATA ---------- */
const GAMES = [
  { logo:"logos/cs2.png",        color:"#d98c1f", verdict:"global elite" },
  { logo:"logos/dota2.png",      color:"#9a2b1e", verdict:"divine rank" },
  { logo:"logos/eldenring.png",  color:"#b89a3a", verdict:"no-hit run" },
  { logo:"logos/pubg.png",       color:"#d6a01f", verdict:"chicken dinner x999" },
  { logo:"logos/apex.png",       color:"#d6334b", verdict:"apex predator" },
  { logo:"logos/gta5.png",       color:"#1f9b6e", verdict:"100% / no cops" },
  { logo:"logos/cyberpunk.png",  color:"#e8d020", verdict:"street cred max" },
  { logo:"logos/bg3.png",        color:"#7b3ff2", verdict:"every ending seen" },
  { logo:"logos/rust.png",       color:"#a33020", verdict:"base never raided" },
  { logo:"logos/siege.png",      color:"#1a6fd1", verdict:"diamond" },
  { logo:"logos/terraria.png",   color:"#3aa856", verdict:"moon lord down" },
  { logo:"logos/dontstarve.png", color:"#5a6b2f", verdict:"day 9999" },
];

const STATS = [
  ["hours played", "999,999"],
  ["touched grass", "0"],
  ["energy drinks", "4,382"],
  ["hours of sleep", "0"],
  ["games dropped", "none"],
  ["lobbies cleared", "∞"],
];

/* ---------- BOOT SEQUENCE ---------- */
const bootLines = [
  "> GAMOOR_OS v9.99 booting...",
  "> loading sleep_schedule.dll ... FAILED",
  "> loading social_life.exe ... NOT FOUND",
  "> mounting energy_drinks ... OK",
  "> calibrating bloodshot_eyes ... OK",
  "> ping: 9ms",
  "> SYSTEM READY.",
];

const bootLog = document.getElementById("bootLog");
const bootStart = document.getElementById("bootStart");
let li = 0;

function typeBoot(){
  if (li < bootLines.length){
    bootLog.textContent += bootLines[li] + "\n";
    li++;
    setTimeout(typeBoot, 360);
  } else {
    setTimeout(() => bootStart.classList.add("show"), 350);
  }
}
setTimeout(typeBoot, 500);

/* ---------- ENTER ---------- */
let entered = false;
function enter(){
  if (entered || !bootStart.classList.contains("show")) return;
  entered = true;
  document.getElementById("boot").classList.add("gone");
  const app = document.getElementById("app");
  app.setAttribute("aria-hidden","false");
  requestAnimationFrame(() => app.classList.add("on"));
  document.getElementById("ticker").classList.add("on");
  document.getElementById("sound").classList.add("on");
  revealGames();
  enableSound();   // fires inside the click gesture -> autoplay allowed
}
document.getElementById("boot").addEventListener("click", enter);

/* ---------- RENDER GAMES ---------- */
const gamesEl = document.getElementById("games");
GAMES.forEach(g => {
  const d = document.createElement("div");
  d.className = "game";
  d.style.setProperty("--gc", g.color);
  d.innerHTML = `
    <img src="favicon.png" alt="" class="game-face" />
    <img src="${g.logo}" alt="" class="game-logo" />
    <div class="game-verdict">${g.verdict}</div>`;
  gamesEl.appendChild(d);
});

function revealGames(){
  const tiles = [...document.querySelectorAll(".game")];
  tiles.forEach((t,i) => setTimeout(() => t.classList.add("in"), 120 + i*70));
}

/* ---------- RENDER STATS ---------- */
const statList = document.getElementById("statList");
STATS.forEach(([k,v]) => {
  const li = document.createElement("li");
  li.innerHTML = `<span>${k}</span><b>${v}</b>`;
  statList.appendChild(li);
});

/* ---------- TICKER ---------- */
const tickText = "$GAMOOR  •  ONE MORE GAME  •  HE NEVER LOGGED OFF  •  RANK: TERMINAL  •  EYES BLEEDING PING PERFECT  •  ";
document.getElementById("ticker").innerHTML = `<span>${tickText.repeat(3)}</span>`;

/* ---------- SOUND (WebAudio ambient + keyclicks) ---------- */
let actx = null, hum = null, soundOn = false;
const soundBtn = document.getElementById("sound");

function initAudio(){
  if (actx) return;
  actx = new (window.AudioContext || window.webkitAudioContext)();
}
function startHum(){
  hum = actx.createOscillator();
  const g = actx.createGain();
  hum.type = "sawtooth"; hum.frequency.value = 48;
  g.gain.value = 0.025;
  const lp = actx.createBiquadFilter();
  lp.type = "lowpass"; lp.frequency.value = 200;
  hum.connect(lp); lp.connect(g); g.connect(actx.destination);
  hum.start();
  hum._g = g;
}
function keyClick(){
  if (!soundOn || !actx) return;
  const o = actx.createOscillator(), g = actx.createGain();
  o.type = "square"; o.frequency.value = 800 + Math.random()*400;
  g.gain.setValueAtTime(0.04, actx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.05);
  o.connect(g); g.connect(actx.destination);
  o.start(); o.stop(actx.currentTime + 0.05);
}

function enableSound(){
  initAudio();
  if (actx.state === "suspended") actx.resume();
  if (soundOn) return;
  soundOn = true;
  startHum();
  soundBtn.textContent = "SOUND: ON";
}
function disableSound(){
  if (!soundOn) return;
  soundOn = false;
  if (hum){ hum.stop(); hum = null; }
  soundBtn.textContent = "SOUND: OFF";
}
soundBtn.addEventListener("click", () => {
  if (soundOn) disableSound(); else enableSound();
});

document.addEventListener("mouseover", e => {
  if (e.target.closest(".game") || e.target.closest(".btn")) keyClick();
});
