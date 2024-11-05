import { escape } from "./utils";

/*
 * global mermaid
 */
const mermaidChart = (code) => {
  try {
    // eslint-disable-next-line
    mermaid.parse(code);
    return `<div class="mermaid">${escape(code)}</div>`;
  } catch ({ str, hash }) {
    return `<pre>${str}</pre>`;
  }
};

const VALID_MERMAID_CHART_TYPES = ["gantt", "sequenceDiagram", "erDiagram"];

const MermaidPlugin = (md) => {
  const origin = md.renderer.rules.fence.bind(md.renderer.rules);
  md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
    const token = tokens[idx];
    const code = token.content.trim();

    if (typeof token.info === "string" && token.info.trim() === "mermaid") {
      return mermaidChart(code);
    }

    const firstLine = code.split(/\n/)[0].trim();
    if (
      VALID_MERMAID_CHART_TYPES.includes(firstLine) ||
      firstLine.match(/^graph (?:TB|BT|RL|LR|TD);?$/)
    ) {
      return mermaidChart(code);
    }

    return origin(tokens, idx, options, env, slf);
  };
};

export default MermaidPlugin;
