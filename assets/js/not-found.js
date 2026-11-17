// Re-enable transitions after the first frame (see theme-init.js)
requestAnimationFrame(() =>
  requestAnimationFrame(() =>
    document.documentElement.classList.remove("no-transition")
  )
);
