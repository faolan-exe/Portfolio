// Contact details on the legal pages are stored encoded (reversed + base64)
// so simple scrapers cannot read them from the HTML source.
function decode(value) {
  const bytes = Uint8Array.from(atob(value), (c) => c.charCodeAt(0));
  return [...new TextDecoder().decode(bytes)].reverse().join("");
}

document.querySelectorAll("[data-obf]").forEach((el) => {
  el.textContent = decode(el.dataset.obf);
});

document.querySelectorAll("[data-obf-mail]").forEach((el) => {
  const address = decode(el.dataset.obfMail);
  const link = document.createElement("a");
  link.href = "mailto:" + address;
  link.textContent = address;
  el.replaceChildren(link);
});
