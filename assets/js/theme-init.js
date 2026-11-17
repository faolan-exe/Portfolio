// Loaded blocking in <head>: sets the theme before the first paint,
// so the page never flashes light and nothing fades in on load.
(function () {
  var theme = null;
  try {
    theme = localStorage.getItem("theme");
  } catch (e) {}
  var dark =
    theme === "night" ||
    (theme !== "day" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  var root = document.documentElement;
  root.classList.add("no-transition");
  if (dark) root.classList.add("theme-dark");
})();
