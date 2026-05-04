/**
 * Minimal markdown to HTML converter.
 *
 * Supports a small subset sufficient for the legal pages saved from the
 * /admin/settings/legal form: headings (#, ##, ###), unordered lists (- or *),
 * ordered lists (1.), paragraphs, bold (**text**), italic (*text*),
 * inline code (`code`), and links ([text](url)). All HTML in the input
 * is escaped before transformation to prevent XSS.
 *
 * This is intentionally simple and zero-dependency. If we ever need richer
 * formatting we should pull in a real markdown library.
 */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function inlineMarkdown(line: string): string {
  let s = escapeHtml(line);
  // Links: [text](url)
  s = s.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_m, text: string, url: string) =>
      `<a href="${url}" class="underline hover:text-primary transition-colors">${text}</a>`,
  );
  // Bold: **text**
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // Italic: *text* (avoid eating bold)
  s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  // Inline code: `code`
  s = s.replace(
    /`([^`]+)`/g,
    '<code class="font-mono text-[0.9em]" style="color: var(--color-copper)">$1</code>',
  );
  return s;
}

export function markdownToHtml(md: string): string {
  if (!md) return "";
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];

  let listType: "ul" | "ol" | null = null;
  let paragraph: string[] = [];

  const closeList = () => {
    if (listType) {
      out.push(`</${listType}>`);
      listType = null;
    }
  };
  const flushParagraph = () => {
    if (paragraph.length > 0) {
      out.push(`<p>${inlineMarkdown(paragraph.join(" "))}</p>`);
      paragraph = [];
    }
  };

  for (const raw of lines) {
    const line = raw.replace(/\s+$/, "");
    if (!line.trim()) {
      flushParagraph();
      closeList();
      continue;
    }

    const h3 = /^###\s+(.*)$/.exec(line);
    const h2 = /^##\s+(.*)$/.exec(line);
    const h1 = /^#\s+(.*)$/.exec(line);
    const ul = /^[-*]\s+(.*)$/.exec(line);
    const ol = /^\d+\.\s+(.*)$/.exec(line);

    if (h3) {
      flushParagraph();
      closeList();
      out.push(
        `<h3 class="font-display font-semibold text-base mt-6 mb-2" style="color: var(--text)">${inlineMarkdown(h3[1])}</h3>`,
      );
    } else if (h2) {
      flushParagraph();
      closeList();
      out.push(
        `<h2 class="font-display text-lg font-semibold mt-8 mb-3" style="color: var(--text)">${inlineMarkdown(h2[1])}</h2>`,
      );
    } else if (h1) {
      flushParagraph();
      closeList();
      out.push(
        `<h1 class="font-display text-2xl font-bold mt-8 mb-4" style="color: var(--text)">${inlineMarkdown(h1[1])}</h1>`,
      );
    } else if (ul) {
      flushParagraph();
      if (listType !== "ul") {
        closeList();
        out.push('<ul class="list-disc pl-5 space-y-1">');
        listType = "ul";
      }
      out.push(`<li>${inlineMarkdown(ul[1])}</li>`);
    } else if (ol) {
      flushParagraph();
      if (listType !== "ol") {
        closeList();
        out.push('<ol class="list-decimal pl-5 space-y-1">');
        listType = "ol";
      }
      out.push(`<li>${inlineMarkdown(ol[1])}</li>`);
    } else {
      closeList();
      paragraph.push(line);
    }
  }
  flushParagraph();
  closeList();

  return out.join("\n");
}
