// The initial theme is already set by theme-init.js (class "theme-dark" on <html>).
// This file only loads the toggle graphics and handles switching.
const root = document.documentElement;
const ease = () => Power1.easeInOut;
const reducedMotion =
  window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function isDark() {
  return root.classList.contains("theme-dark");
}

function saveTheme(theme) {
  try {
    localStorage.setItem("theme", theme);
  } catch {}
}

function getToggles() {
  return document.querySelectorAll(".theme-toggle");
}

function blockTogglesFor(ms) {
  getToggles().forEach((toggle) => {
    toggle.style.pointerEvents = "none";
    setTimeout(() => (toggle.style.pointerEvents = ""), ms);
  });
}

function syncToggleState(dark) {
  getToggles().forEach((toggle) => toggle.setAttribute("aria-pressed", String(dark)));
}

// Moves sun/moon/stars into place; animated when the user clicks,
// set instantly on page load or with reduced motion.
function positionGraphic(dark, animate) {
  if (!window.gsap || !document.querySelector(".theme-toggle-graphic")) return;
  animate = animate && !reducedMotion;
  const to = (target, vars) => (animate ? gsap.to(target, vars) : gsap.set(target, vars));
  const d = (s) => (animate ? s : 0);
  if (dark) {
    to(".theme-toggle-graphic .sun", { duration: d(1), x: -157, opacity: 0, ease: ease() });
    to(".theme-toggle-graphic .cloud", { duration: d(0.5), opacity: 0, ease: ease() });
    to(".theme-toggle-graphic .moon", { duration: d(1), x: -157, rotate: -360, transformOrigin: "center", opacity: 1, ease: ease() });
    to(".theme-toggle-graphic .star", { duration: d(0.5), opacity: 1, ease: ease() });
  } else {
    to(".theme-toggle-graphic .sun", { duration: d(1), x: 15, opacity: 1, ease: ease() });
    to(".theme-toggle-graphic .cloud", { duration: d(1), opacity: 1, ease: ease() });
    to(".theme-toggle-graphic .moon", { duration: d(1), opacity: 0, x: 35, rotate: 360, transformOrigin: "center", ease: ease() });
    to(".theme-toggle-graphic .star", { duration: d(1), opacity: 0, ease: ease() });
  }
}

function setTheme(dark) {
  saveTheme(dark ? "night" : "day");
  syncToggleState(dark);
  blockTogglesFor(reducedMotion ? 0 : 1000);
  positionGraphic(dark, true);
  if (window.gsap) {
    const duration = reducedMotion ? 0 : 1;
    gsap.to(".theme-toggle", {
      duration,
      background: dark ? "#224f6d" : "#9cd6ef",
      borderColor: dark ? "#cad4d8" : "#65c0e7",
      ease: ease(),
    });
    gsap.to("#background", {
      duration,
      background: dark ? "#0d1f2b" : "#d3edf8",
      ease: ease(),
    });
  }
  root.classList.toggle("theme-dark", dark);
}

async function loadToggleGraphics() {
  const containers = document.querySelectorAll(".darkmode-container");
  if (!containers.length) return;
  try {
    const res = await fetch("./assets/images/darkmode-toggle.svg");
    const svg = await res.text();
    containers.forEach((c) => c.insertAdjacentHTML("beforeend", svg));
  } catch {
    return; // the toggles still work, just without the graphic
  }
  if (!window.gsap) return;
  gsap.set(".theme-toggle-graphic .star", { x: 35, y: -5 });
  gsap.set(".theme-toggle-graphic .sun, .theme-toggle-graphic .cloud, .theme-toggle-graphic .moon", { x: 15 });
  gsap.set(".theme-toggle-graphic .moon, .theme-toggle-graphic .star", { opacity: 0 });
  positionGraphic(isDark(), false);
}

syncToggleState(isDark());

document.addEventListener("click", (e) => {
  if (e.target.closest(".theme-toggle")) setTheme(!isDark());
});

loadToggleGraphics();

// Re-enable transitions once the first frame is rendered
requestAnimationFrame(() =>
  requestAnimationFrame(() => root.classList.remove("no-transition"))
);
