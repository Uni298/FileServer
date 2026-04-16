/**
 * StudyNotes Extension: SmartBraces & Symbols v1.6
 */
module.exports = {
  name: "Smart Braces & Symbols",
  version: "1.6.0",
  description: "@q(◎), @jr(↳), @{ (伸びる中括弧) を追加します。",

  transform(text) {
    // 1. 記号の置換
    let processedText = text
      .replace(/@q/g, '◎')
      .replace(/@jr/g, '↳'); // 新機能: @jr で ↳ を入力

    // 2. 中括弧の解析
    const braceRegex = /([^@\n]*)@\{([\s\S]*?)@@/g;

    return processedText.replace(braceRegex, (match, label, content) => {
      const rawLines = content.split('\n');
      const lines = rawLines.map(l => l.trim()).filter(l => l !== "");
      if (lines.length === 0) return match;

      const rowCount = lines.length;
      const lineHeight = 28; // 行の高さを少し広めに設定
      const totalHeight = rowCount * lineHeight;
      
      const mid = totalHeight / 2;
      // 行数に関わらず崩れないように曲線のサイズを動的に計算
      const curve = Math.min(12, totalHeight / 3); 

      // 確実に表示されるSVGパス
      // M:開始, C:ベジェ曲線(角), L:直線, Q:ベジェ曲線(中央の突起)
      const svgPath = `
        M 12,2 
        C 6,2 4,${curve} 4,${curve * 2} 
        L 4,${mid - curve} 
        Q 4,${mid} 0,${mid} 
        Q 4,${mid} 4,${mid + curve} 
        L 4,${totalHeight - (curve * 2)} 
        C 4,${totalHeight - curve} 6,${totalHeight - 2} 12,${totalHeight - 2}
      `.replace(/\s+/g, ' ');

      // SVG自体が表示されない問題を防ぐため、色(stroke)を明示的に指定
      const svgBrace = `
        <svg width="16" height="${totalHeight}" viewBox="0 0 16 ${totalHeight}" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block; margin: 0 6px;">
          <path d="${svgPath}" stroke="#1a1917" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      `;

      return `
        <div style="display: inline-flex; align-items: center; vertical-align: middle; margin: 12px 0; min-height: ${totalHeight}px; font-family: 'noto-serif', serif;">
          <div style="font-weight: bold; white-space: nowrap; padding-right: 2px;">${label || ''}</div>
          ${svgBrace}
          <div style="text-align: left; line-height: ${lineHeight}px; display: flex; flex-direction: column; justify-content: center;">
            ${lines.map(line => `<span style="display:block;">${line}</span>`).join('')}
          </div>
        </div>
      `;
    });
  }
};
