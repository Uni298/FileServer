module.exports = {
  name: "Smart Braces SVG",
  version: "1.3.0",
  description: "行数に合わせてSVGで描画される動的中括弧",

  transform(text) {
    // 1. @q の置換
    let processedText = text.replace(/@q/g, '◎');

    // 2. 可変長中括弧の置換 (SVG版)
    const braceRegex = /([^@\n]+)@\{([\s\S]*?)@@/g;

    return processedText.replace(braceRegex, (match, label, content) => {
      const lines = content.trim().split('\n');
      const rowCount = lines.length;
      
      // 1行あたりの高さを 24px と仮定して全体の高さを計算
      const lineHeight = 24;
      const totalHeight = rowCount * lineHeight;
      
      // SVGで中括弧を描画
      // パスデータの "M" は開始点、"Q" はベジェ曲線（曲がり角）
      const svgBrace = `
        <svg width="20" height="${totalHeight}" viewBox="0 0 20 ${totalHeight}" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin: 0 5px;">
          <path d="
            M 15 0 
            Q 5 0, 5 15 
            L 5 ${(totalHeight / 2) - 15} 
            Q 5 ${totalHeight / 2}, 0 ${totalHeight / 2} 
            Q 5 ${totalHeight / 2}, 5 ${(totalHeight / 2) + 15} 
            L 5 ${totalHeight - 15} 
            Q 5 ${totalHeight}, 15 ${totalHeight}
          " stroke="currentColor" stroke-width="1.5" />
        </svg>
      `;

      return `
        <div style="display: inline-flex; align-items: center; vertical-align: middle; margin: 8px 0;">
          <div style="font-weight: bold; white-space: nowrap;">${label.trim()}</div>
          ${svgBrace}
          <div style="text-align: left; line-height: ${lineHeight}px; padding-left: 2px;">
            ${lines.join('<br>')}
          </div>
        </div>
      `;
    });
  }
};
