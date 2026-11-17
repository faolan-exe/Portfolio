// The initial theme is already set by theme-init.js (class "theme-dark" on <html>).
// This file only loads the toggle graphic and handles switching.
const root = document.documentElement;
const ease = () => Power1.easeInOut;

function saveTheme(theme) {
  try {
    localStorage.setItem("theme", theme);
  } catch {}
}

function getToggle() {
  return document.querySelector("#day, #night");
}

function blockToggleFor(ms) {
  const toggle = getToggle();
  if (!toggle) return;
  toggle.style.pointerEvents = "none";
  setTimeout(() => (toggle.style.pointerEvents = "all"), ms);
}

// Moves sun/moon/stars into place; animated when the user clicks,
// set instantly when the page loads.
function positionGraphic(dark, animate) {
  if (!window.gsap || !document.getElementById("sun")) return;
  const to = (target, vars) => (animate ? gsap.to(target, vars) : gsap.set(target, vars));
  const d = (s) => (animate ? s : 0);
  if (dark) {
    to("#sun", { duration: d(1), x: -157, opacity: 0, ease: ease() });
    to("#cloud", { duration: d(0.5), opacity: 0, ease: ease() });
    to("#moon", { duration: d(1), x: -157, rotate: -360, transformOrigin: "center", opacity: 1, ease: ease() });
    to(".star", { duration: d(0.5), opacity: 1, ease: ease() });
  } else {
    to("#sun", { duration: d(1), x: 15, opacity: 1, ease: ease() });
    to("#cloud", { duration: d(1), opacity: 1, ease: ease() });
    to("#moon", { duration: d(1), opacity: 0, x: 35, rotate: 360, transformOrigin: "center", ease: ease() });
    to(".star", { duration: d(1), opacity: 0, ease: ease() });
  }
}

function setTheme(dark) {
  const toggle = getToggle();
  if (toggle) {
    toggle.id = dark ? "night" : "day";
    toggle.setAttribute("aria-pressed", String(dark));
  }
  saveTheme(dark ? "night" : "day");
  blockToggleFor(1000);
  positionGraphic(dark, true);
  if (window.gsap) {
    gsap.to(dark ? "#night" : "#day", {
      duration: 1,
      background: dark ? "#224f6d" : "#9cd6ef",
      borderColor: dark ? "#cad4d8" : "#65c0e7",
      ease: ease(),
    });
    gsap.to("#background", {
      duration: 1,
      background: dark ? "#0d1f2b" : "#d3edf8",
      ease: ease(),
    });
  }
  root.classList.toggle("theme-dark", dark);
}

async function loadToggleGraphic() {
  const container = document.querySelector(".darkmode-container");
  if (!container) return;
  try {
    const res = await fetch("./assets/images/darkmode-toggle.svg");
    container.insertAdjacentHTML("beforeend", await res.text());
  } catch {
    return; // the toggle still works, just without the graphic
  }
  gsap.set(".star", { x: 35, y: -5 });
  gsap.set("#sun, #cloud, #moon", { x: 15 });
  gsap.set("#moon, .star", { opacity: 0 });
  positionGraphic(root.classList.contains("theme-dark"), false);
}

// Sync the toggle button with the theme chosen by theme-init.js
const initialToggle = getToggle();
if (initialToggle) {
  const dark = root.classList.contains("theme-dark");
  initialToggle.id = dark ? "night" : "day";
  initialToggle.setAttribute("aria-pressed", String(dark));
}

document.addEventListener("click", (e) => {
  if (e.target.id === "day") setTheme(true);
  else if (e.target.id === "night") setTheme(false);
});

loadToggleGraphic();

// Re-enable transitions once the first frame is rendered
requestAnimationFrame(() =>
  requestAnimationFrame(() => root.classList.remove("no-transition"))
);
