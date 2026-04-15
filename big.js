module.exports = {
  name: "Smart Braces SVG Fixed",
  version: "1.4.0",
  description: "行数に合わせて伸びる中括弧（修正版）",

  transform(text) {
    // 1. @q の置換
    let processedText = text.replace(/@q/g, '◎');

    // 2. 可変長中括弧の置換
    // 改良: 前の文字がなくても動くように ([^@\n]*) に変更
    const braceRegex = /([^@\n]*)@\{([\s\S]*?)@@/g;

    return processedText.replace(braceRegex, (match, label, content) => {
      // コンテンツの整形
      const rawLines = content.split('\n');
      // 空の行を除去しつつ、最低1行は確保
      const lines = rawLines.map(l => l.trim()).filter(l => l !== "");
      if (lines.length === 0) return match; // 中身が空ならそのまま返す

      const rowCount = lines.length;
      const lineHeight = 26; // 1行あたりの高さ(px)
      const totalHeight = rowCount * lineHeight;
      
      // シンプルなSVGパス（中央に突起がある中括弧）
      // 描画が消えないよう、viewBoxとpathを最適化
      const svgBrace = `
        <svg width="16" height="${totalHeight}" viewBox="0 0 16 ${totalHeight}" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block; margin: 0 4px;">
          <path d="M12,2 C6,2 4,8 4,15 L4,${(totalHeight/2)-10} Q4,${totalHeight/2} 0,${totalHeight/2} Q4,${totalHeight/2} 4,${(totalHeight/2)+10} L4,${totalHeight-15} C4,${totalHeight-8} 6,${totalHeight-2 12,${totalHeight-2" 
            stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        </svg>
      `;

      // 1行の時と複数行の時でレイアウトを微調整
      return `
        <div style="display: inline-flex; align-items: center; vertical-align: middle; margin: 5px 0; min-height: ${totalHeight}px;">
          <div style="font-weight: bold; white-space: nowrap; line-height: 1;">${label || ''}</div>
          ${svgBrace}
          <div style="text-align: left; line-height: ${lineHeight}px; padding-left: 2px; display: flex; flex-direction: column; justify-content: center;">
            ${lines.join('<br>')}
          </div>
        </div>
      `;
    });
  }
};
