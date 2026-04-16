module.exports = {
  name: "CustomNotation",
  version: "1.0.0",
  description: "@q → ◎ / @jr → ↳ / @{...@@  → 大括弧（複数行対応）",

  transform(text) {
    // --- 1. @q → ◎ ---
    text = text.replace(/@q/g, '◎');

    // --- 2. @jr → ↳ ---
    text = text.replace(/@jr/g, '↳');

    // --- 3. @{前文字}から@{後文字}に 大括弧（複数行対応）@@で終了 ---
    // 書式: @{ラベル前}文字列（改行可）@@
    // 出力: 左に大括弧 { が縦に伸び、右側テキスト、ラベルは中央に表示
    text = text.replace(/@\{([^}]*)\}([\s\S]*?)@@/g, (match, label, inner) => {
      const lines = inner.split('\n');
      // 空行を除いてレンダリング
      const filteredLines = lines.filter((l, i) => {
        // 最初と最後の空行だけ除去
        if (i === 0 && l.trim() === '') return false;
        if (i === lines.length - 1 && l.trim() === '') return false;
        return true;
      });
      if (filteredLines.length === 0) filteredLines.push(inner.trim());

      const rowCount = filteredLines.length;
      const midIndex = Math.floor((rowCount - 1) / 2);
      const lineHeight = 1.6; // em
      const totalEm = rowCount * lineHeight;

      // SVG で縦伸び括弧を描画
      const svgH = totalEm;
      // 括弧は縦長SVGで表現
      const bracketSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="${svgH}em" style="vertical-align:middle;overflow:visible" viewBox="0 0 18 ${rowCount * 24}">
        <path d="M14,2 Q4,2 4,${rowCount*12} Q4,${rowCount*24-2} 14,${rowCount*24-2}"
              fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
      </svg>`;

      const rowsHtml = filteredLines.map((line, i) => {
        const isMiddle = i === midIndex;
        return `<div style="display:table-row">
          <div style="display:table-cell;vertical-align:middle;padding:0 2px 0 0;line-height:${lineHeight}em">${isMiddle ? bracketSvg : ''}</div>
          <div style="display:table-cell;vertical-align:middle;padding:0 6px;line-height:${lineHeight}em;white-space:pre">${line || '&nbsp;'}</div>
          <div style="display:table-cell;vertical-align:middle;padding:0 2px;line-height:${lineHeight}em;color:#4a90d9;font-weight:bold">${isMiddle ? `<span style="font-size:0.9em">${label}</span>` : ''}</div>
        </div>`;
      }).join('');

      return `<span style="display:inline-table;border-collapse:collapse;vertical-align:middle">${rowsHtml}</span>`;
    });

    return text;
  }
};
