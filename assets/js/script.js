// Mobile menu
const menu = document.querySelector(".menu-links");
const menuButton = document.querySelector(".hamburger-icon");

function toggleMenu(open = !menu.classList.contains("open")) {
  menu.classList.toggle("open", open);
  menuButton.classList.toggle("open", open);
  menuButton.setAttribute("aria-expanded", String(open));
}

if (menu && menuButton) {
  menuButton.addEventListener("click", () => toggleMenu());
  menu.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => toggleMenu(false))
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("open")) {
      toggleMenu(false);
      menuButton.focus();
    }
  });
}

// Footer year
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// Progressive images: a tiny blurred placeholder is shown first,
// the full image is loaded in the background and fades in sharp.
function loadFullImage(img) {
  const full = new Image();
  full.src = img.dataset.src;
  full
    .decode()
    .catch(() => {})
    .then(() => {
      img.src = full.src;
      img.removeAttribute("data-src");
      requestAnimationFrame(() => img.classList.add("lqip-loaded"));
    });
}

const pendingImages = [...document.querySelectorAll("img.lqip[data-src]")];

function loadPending(img) {
  const i = pendingImages.indexOf(img);
  if (i === -1) return;
  pendingImages.splice(i, 1);
  loadFullImage(img);
}

// Images in view are loaded right away ...
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      loadPending(entry.target);
    });
  });
  pendingImages.forEach((img) => observer.observe(img));
}

// ... all others as soon as the page has finished loading.
function loadAllPending() {
  [...pendingImages].forEach(loadPending);
}
if (document.readyState === "complete") loadAllPending();
else window.addEventListener("load", loadAllPending);
