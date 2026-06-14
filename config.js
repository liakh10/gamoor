const CA    = "2fhkzBgU47raPkUdXvb8M1BBe2ooia2n3gBje6RGpump";   // <-- paste real CA here
const X_URL = "https://x.com/soon";   // <-- paste real X link here

const HAS_CA   = CA !== "SOON";
const PUMP_URL = HAS_CA ? `https://pump.fun/coin/${CA}` : "#";
const DEX_URL  = HAS_CA ? `https://dexscreener.com/solana/${CA}` : "#";

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("caVal").textContent = CA;
  document.getElementById("xLink").href    = X_URL;
  document.getElementById("pumpLink").href  = PUMP_URL;
  document.getElementById("dexLink").href   = DEX_URL;

  document.getElementById("ca").addEventListener("click", () => {
    if (!HAS_CA) return;
    navigator.clipboard.writeText(CA);
    const v = document.getElementById("caVal");
    const prev = v.textContent;
    v.textContent = "copied";
    setTimeout(() => v.textContent = prev, 1100);
  });
});
