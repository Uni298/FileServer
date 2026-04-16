module.exports = {
  name: "CustomNotation",
  version: "1.0.1",
  description: "@q → ◎ / @jr → ↳ / @{ラベル}〜@@ → 縦伸び大括弧",

  transform(text) {
    // --- 1. @q → ◎ ---
    text = text.replace(/@q/g, '◎');

    // --- 2. @jr → ↳ ---
    text = text.replace(/@jr/g, '↳');

    // --- 3. @{ラベル}内容@@ → 縦伸び大括弧 ---
    text = text.replace(/@\{([^}]*)\}([\s\S]*?)@@/g, (match, label, inner) => {
      // 前後の空行を除去
      const lines = inner.split('\n').filter((l, i, arr) => {
        if (i === 0 && l.trim() === '') return false;
        if (i === arr.length - 1 && l.trim() === '') return false;
        return true;
      });
      if (lines.length === 0) lines.push(inner.trim());

      const rowCount = lines.length;
      const lineH = 24; // px per row
      const totalH = rowCount * lineH;
      const midIndex = Math.floor((rowCount - 1) / 2);
      const svgW = 16;

      // インラインSVGを文字列で組み立て（属性値にemを使わない）
      const bracketPath = `M${svgW - 2},2 Q${svgW / 2},2 ${svgW / 2},${totalH / 2} Q${svgW / 2},${totalH - 2} ${svgW - 2},${totalH - 2}`;
      const bracketSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgW}" height="${totalH}" viewBox="0 0 ${svgW} ${totalH}" style="display:block;overflow:visible"><path d="${bracketPath}" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

      // rowspanを使ったテーブル構造:
      // midIndex行: [bracket td rowspan=rowCount] [text td] [label td]
      // 他の行:                                   [text td] [empty td]
      const rows = lines.map((line, i) => {
        const textTd = `<td style="height:${lineH}px;padding:0 10px 0 6px;white-space:pre;vertical-align:middle;font-size:1em">${line.replace(/</g, '&lt;').replace(/>/g, '&gt;') || '&nbsp;'}</td>`;
        if (i === midIndex) {
          const bracketTd = `<td rowspan="${rowCount}" style="vertical-align:middle;padding:0;width:${svgW}px">${bracketSvg}</td>`;
          const labelTd = `<td style="height:${lineH}px;padding:0 4px;vertical-align:middle;color:#4a90d9;font-weight:bold;white-space:nowrap;font-size:0.88em">${label || ''}</td>`;
          return `<tr>${bracketTd}${textTd}${labelTd}</tr>`;
        } else {
          const emptyTd = `<td style="height:${lineH}px;padding:0;vertical-align:middle"></td>`;
          return `<tr>${textTd}${emptyTd}</tr>`;
        }
      }).join('');

      return `<table style="display:inline-table;border-collapse:collapse;vertical-align:middle;line-height:1">${rows}</table>`;
    });

    return text;
  }
};
