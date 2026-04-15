/**
 * StudyNotes Extension: SmartBraces v1.5
 * に基づく実装
 */
module.exports = {
  name: "Smart Braces SVG Final",
  version: "1.5.0",
  description: "@q で ◎ を表示し、@{ で可変長中括弧を生成します。",

  transform(text) {
    // 1. @q を ◎ に変換
    let processedText = text.replace(/@q/g, '◎');

    // 2. 中括弧の解析: 前方の文字@{中身@@
    const braceRegex = /([^@\n]*)@\{([\s\S]*?)@@/g;

    return processedText.replace(braceRegex, (match, label, content) => {
      // 改行で分割し、中身を整理
      const lines = content.split('\n').map(line => line.trim()).filter(line => line !== "");
      if (lines.length === 0) return match;

      const rowCount = lines.length;
      const lineHeight = 26; // 1行の高さ
      const totalHeight = rowCount * lineHeight;
      
      // SVGパスの修正版（テンプレートリテラルのエラーを修正）
      const mid = totalHeight / 2;
      const svgPath = `M12,2 C6,2 4,8 4,15 L4,${mid - 10} Q4,${mid} 0,${mid} Q4,${mid} 4,${mid + 10} L4,${totalHeight - 15} C4,${totalHeight - 8} 6,${totalHeight - 2} 12,${totalHeight - 2}`;

      const svgBrace = `
        <svg width="16" height="${totalHeight}" viewBox="0 0 16 ${totalHeight}" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block; margin: 0 4px;">
          <path d="${svgPath}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        </svg>
      `;

      // レイアウトの組み立て
      return `
        <div style="display: inline-flex; align-items: center; vertical-align: middle; margin: 8px 0; min-height: ${totalHeight}px;">
          <div style="font-weight: bold; white-space: nowrap; font-family: 'noto-serif', serif;">${label || ''}</div>
          ${svgBrace}
          <div style="text-align: left; line-height: ${lineHeight}px; padding-left: 4px; display: flex; flex-direction: column; justify-content: center; font-family: 'noto-serif', serif;">
            ${lines.join('<br>')}
          </div>
        </div>
      `;
    });
  }
};
