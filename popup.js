const $ = (selector) => document.querySelector(selector);
const urlInput = $("#url");
const createButton = $("#create");
const openButton = $("#open");
const includeImagesInput = $("#include-images");
const status = $("#status");

const isXUrl = (value) => {
  try {
    const url = new URL(value);
    return ["x.com", "www.x.com", "twitter.com", "www.twitter.com"].includes(url.hostname)
      && /\/status\/\d+/.test(url.pathname);
  } catch {
    return false;
  }
};

const setStatus = (message, error = false) => {
  status.textContent = message;
  status.classList.toggle("error", error);
};

const activeTab = async () => (await chrome.tabs.query({ active: true, currentWindow: true }))[0];

const extractFrom = async (tabId, includeImages) => {
  try {
    return await chrome.tabs.sendMessage(tabId, { type: "X2PDF_EXTRACT", includeImages });
  } catch {
    await chrome.scripting.executeScript({ target: { tabId }, files: ["content.js"] });
    return chrome.tabs.sendMessage(tabId, { type: "X2PDF_EXTRACT", includeImages });
  }
};

const initialize = async () => {
  const tab = await activeTab();
  if (tab?.url && isXUrl(tab.url)) urlInput.value = tab.url;
};

openButton.addEventListener("click", async () => {
  const url = urlInput.value.trim();
  if (!isXUrl(url)) return setStatus("Enter a valid X status URL.", true);
  await chrome.tabs.create({ url });
  setStatus("Article opened. Let it load, then click the extension there.");
});

createButton.addEventListener("click", async () => {
  createButton.disabled = true;
  setStatus("Reading the article…");
  try {
    const tab = await activeTab();
    if (!tab?.id || !isXUrl(tab.url || "")) throw new Error("Open the X Article in this tab first.");
    const result = await extractFrom(tab.id, includeImagesInput.checked);
    if (!result?.ok) throw new Error(result?.error || "No article content found.");
    const key = crypto.randomUUID();
    await chrome.storage.local.set({ [key]: result.article });
    await chrome.tabs.create({ url: chrome.runtime.getURL(`print.html#${key}`) });
    window.close();
  } catch (error) {
    setStatus(error.message || "Could not read this article.", true);
    createButton.disabled = false;
  }
});

initialize();
