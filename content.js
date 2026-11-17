(() => {
  "use strict";

  const ARTICLE_SELECTORS = [
    '[data-testid="twitterArticleReadView"]',
    '[data-testid="twitterArticleRichText"]',
    '[data-testid="articleNoteTweet"]',
    'article [data-testid="longformRichTextComponent"]'
  ];

  const cleanText = (value) => value.replace(/\u00a0/g, " ").replace(/[ \t]+/g, " ").trim();

  const articleRoot = () => {
    for (const selector of ARTICLE_SELECTORS) {
      const node = document.querySelector(selector);
      if (node) return node;
    }
    const block = document.querySelector('[data-block="true"]');
    return block?.closest("article") || null;
  };

  const inlineHtml = (source) => {
    const allowed = new Set(["B", "STRONG", "I", "EM", "S", "CODE", "SUP", "SUB", "BR", "A"]);
    const render = (node) => {
      if (node.nodeType === Node.TEXT_NODE) return escapeHtml(node.textContent || "");
      if (node.nodeType !== Node.ELEMENT_NODE) return "";
      const content = [...node.childNodes].map(render).join("");
      if (!allowed.has(node.tagName)) return content;
      const tag = ({ B: "strong", I: "em", S: "s" })[node.tagName] || node.tagName.toLowerCase();
      if (tag === "br") return "<br>";
      if (tag === "a") {
        const href = node.href || "";
        return /^https?:\/\//i.test(href) ? `<a href="${escapeAttr(href)}">${content}</a>` : content;
      }
      return `<${tag}>${content}</${tag}>`;
    };
    return cleanText([...source.childNodes].map(render).join(""));
  };

  const escapeHtml = (value) => value.replace(/[&<>]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[char]);
  const escapeAttr = (value) => value.replace(/[&"<>]/g, (char) => ({ "&": "&amp;", '"': "&quot;", "<": "&lt;", ">": "&gt;" })[char]);

  const extract = () => {
    const root = articleRoot();
    if (!root) throw new Error("This page does not appear to contain an X Article.");

    const title = cleanText(root.querySelector("h1")?.textContent || document.title.replace(/\s+(on|\/)\s*X.*$/i, ""));
    const user = document.querySelector('[data-testid="User-Name"]');
    const byline = cleanText(user?.innerText || "").split("\n").filter(Boolean).slice(0, 2).join(" ");
    const blocks = [...root.querySelectorAll('[data-block="true"]')];
    if (blocks.length < 2) throw new Error("The article is not fully loaded yet. Wait a moment and try again.");

    const seen = new Set();
    const content = [];
    for (const block of blocks) {
      if (block.closest('[data-testid="markdown-code-block"]')) continue;
      const tag = block.tagName.toLowerCase();
      const html = inlineHtml(block);
      const text = cleanText(block.textContent || "");
      if (!text || (tag === "h1" && text === title)) continue;

      const kind = /^h[1-6]$/.test(tag) ? "heading"
        : tag === "li" ? "list-item"
        : tag === "blockquote" ? "quote"
        : "paragraph";
      const signature = `${kind}:${text}`;
      if (seen.has(signature)) continue;
      seen.add(signature);
      content.push({ kind, html, level: kind === "heading" ? Number(tag[1]) : undefined });
    }

    root.querySelectorAll('[data-testid="markdown-code-block"]').forEach((node) => {
      const text = (node.querySelector("pre")?.textContent || "").trimEnd();
      if (text) content.push({ kind: "code", text });
    });

    if (!content.length) throw new Error("No readable article content was found.");
    return { title: title || "X Article", byline, source: location.href, content };
  };

  chrome.runtime.onMessage.addListener((message, _sender, respond) => {
    if (message?.type !== "X2PDF_EXTRACT") return;
    try { respond({ ok: true, article: extract() }); }
    catch (error) { respond({ ok: false, error: error.message }); }
  });
})();

