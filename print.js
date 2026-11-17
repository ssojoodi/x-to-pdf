const key = location.hash.slice(1);
const documentNode = document.querySelector("#document");
const contentNode = document.querySelector("#content");
const errorNode = document.querySelector("#error");

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
};

document.querySelector("#print").addEventListener("click", () => window.print());
load().catch((error) => showError(error.message || "Could not build the print preview."));

