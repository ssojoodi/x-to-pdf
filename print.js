const key = location.hash.slice(1);
const documentNode = document.querySelector("#document");
const contentNode = document.querySelector("#content");
const errorNode = document.querySelector("#error");
const printButton = document.querySelector("#print");
const imageLoads = [];
printButton.disabled = true;

const appendImage = (item) => {
  // Validate again at the rendering boundary, without injecting image HTML.
  try {
    const url = new URL(item.src);
    if (url.protocol !== "https:" || url.hostname !== "pbs.twimg.com"
      || !url.pathname.startsWith("/media/") || url.username || url.password) return;
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    image.alt = item.alt || "Article image";
    image.referrerPolicy = "no-referrer";
    imageLoads.push(new Promise((resolve) => {
      let settled = false;
      const finish = (failed) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        image.onload = null;
        image.onerror = null;
        if (failed) {
          image.removeAttribute("src");
          const caption = document.createElement("figcaption");
          caption.textContent = item.alt ? `Image unavailable: ${item.alt}` : "Image unavailable";
          figure.replaceChildren(caption);
        }
        resolve(failed);
      };
      const timeout = setTimeout(() => finish(true), 15000);
      image.onload = () => finish(false);
      image.onerror = () => finish(true);
      image.src = url.href;
    }));
    figure.appendChild(image);
    contentNode.appendChild(figure);
  } catch {
    // Ignore unsupported image sources.
  }
};

const showError = (message) => {
  errorNode.textContent = message;
  errorNode.hidden = false;
};

const appendContent = (items) => {
  let list = null;
  const flushList = () => { list = null; };
  for (const item of items) {
    if (item.kind === "list-item") {
      list ||= contentNode.appendChild(document.createElement("ul"));
      const node = document.createElement("li");
      node.innerHTML = item.html;
      list.appendChild(node);
      continue;
    }
    flushList();
    if (item.kind === "image") {
      appendImage(item);
      continue;
    }
    const tag = item.kind === "heading" ? `h${Math.min(6, Math.max(2, item.level || 2))}`
      : item.kind === "quote" ? "blockquote"
      : item.kind === "code" ? "pre"
      : "p";
    const node = document.createElement(tag);
    if (item.kind === "code") node.textContent = item.text;
    else node.innerHTML = item.html;
    contentNode.appendChild(node);
  }
};

const load = async () => {
  if (!key) return showError("Missing article data. Create the PDF again from the extension popup.");
  const stored = await chrome.storage.local.get(key);
  const article = stored[key];
  await chrome.storage.local.remove(key);
  if (!article) return showError("This print preview expired. Create it again from the extension popup.");

  document.title = `${article.title} - PDF`;
  document.querySelector("#title").textContent = article.title;
  document.querySelector("#byline").textContent = article.byline;
  const source = document.querySelector("#source");
  source.href = article.source;
  source.textContent = article.source;
  appendContent(article.content);
  documentNode.hidden = false;
  if (imageLoads.length) {
    const hint = document.querySelector(".toolbar span");
    hint.textContent = "Loading article images…";
    const results = await Promise.all(imageLoads);
    hint.textContent = results.some(Boolean)
      ? "Some images could not load. You can still print the article."
      : "Choose “Save to PDF” in Chrome’s print dialog.";
  }
  printButton.disabled = false;
};

printButton.addEventListener("click", () => window.print());
load().catch((error) => showError(error.message || "Could not build the print preview."));

