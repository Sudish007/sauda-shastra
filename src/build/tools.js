// Registry of the client-side calculators (design §6.9, pack L). Empty until the tools step fills it; the build already
// emits tools/index.html from it, validates `tools:` front matter against its ids, lists `factIds` on the facts page
// and indexes each entry for search. Shape per entry:
//   { id, title, summary, factIds: [fact ids the tool reads], fields: [...], examples: [two worked examples], formula() }
// Keep this module free of imports from content.js or pages.js (content.js imports it to validate `tools:`).
export const TOOLS = [];

export const byTool = (id) => TOOLS.find((t) => t.id === id);
