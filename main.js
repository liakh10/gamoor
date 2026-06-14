/* ---------- GAME DATA ---------- */
const GAMES = [
  { name:"CS2",        icon:"🔫", color:"#d98c1f", verdict:"global elite" },
  { name:"MINECRAFT",  icon:"⛏️", color:"#3aa856", verdict:"ender dragon dead" },
  { name:"GTA",        icon:"🚗", color:"#1f9b6e", verdict:"100% / no cops" },
  { name:"LEAGUE",     icon:"⚔️", color:"#1a6fd1", verdict:"challenger" },
  { name:"FORTNITE",   icon:"🛡️", color:"#7b3ff2", verdict:"victory royale" },
  { name:"ELDEN RING", icon:"💀", color:"#b89a3a", verdict:"no-hit run" },
  { name:"VALORANT",   icon:"🎯", color:"#d6334b", verdict:"radiant" },
  { name:"DARK SOULS", icon:"🔥", color:"#a33020", verdict:"all bosses" },
  { name:"ROBLOX",     icon:"🧱", color:"#cf2a2a", verdict:"obby cleared" },
  { name:"DOTA 2",     icon:"🛡️", color:"#9a2b1e", verdict:"divine rank" },
  { name:"WARZONE",    icon:"💣", color:"#5a6b2f", verdict:"nuke unlocked" },
  { name:"OSU!",       icon:"🎵", color:"#e0408f", verdict:"FC ranked #1" },
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
    <div class="game-icon">${g.icon}</div>
    <div class="game-name">${g.name}</div>
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

soundBtn.addEventListener("click", () => {
  initAudio();
  if (actx.state === "suspended") actx.resume();
  soundOn = !soundOn;
  if (soundOn){
    startHum();
    soundBtn.textContent = "SOUND: ON";
  } else {
    if (hum){ hum.stop(); hum = null; }
    soundBtn.textContent = "SOUND: OFF";
  }
});

document.addEventListener("mouseover", e => {
  if (e.target.closest(".game") || e.target.closest(".btn")) keyClick();
});
