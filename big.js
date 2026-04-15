/**
 * StudyNotes Extension: SmartBraces
 * * 機能:
 * 1. @q -> ◎ への置換
 * 2. text@{内容@@ -> 指定したテキストを左側に、内容を右側に配置する大きな中括弧の生成
 */

module.exports = {
  name: "Smart Braces & Symbols",
  version: "1.1.0",
  description: "◎記号と、複数行に対応した可変長中括弧を追加します。",

  /**
   * テキスト変換ロジック
   */
  transform(text) {
    // 1. @q を ◎ に置換
    let processedText = text.replace(/@q/g, '◎');

    // 2. 可変長中括弧の解析
    // 記法: 前方の文字@{中身@@
    // 改行を含む最短一致でキャプチャ
    const braceRegex = /([^\n]+?)@\{([\s\S]*?)@@/g;

    return processedText.replace(braceRegex, (match, label, content) => {
      const lines = content.trim().split('\n');
      const rowCount = lines.length;
      
      // 中括弧の高さとフォントサイズを調整（行数に応じて動的に変化）
      const fontSize = rowCount === 1 ? 1.5 : rowCount * 1.1;
      const scaleY = rowCount === 1 ? 1 : 0.9;

      // Flexboxを使用して、ラベル - 中括弧 - 複数行コンテンツ を横並びにする
      return `
        <div style="display: inline-flex; align-items: center; vertical-align: middle; margin: 10px 0; font-family: 'noto-serif', serif;">
          <div style="text-align: right; padding-right: 8px; font-weight: bold;">
            ${label}
          </div>
          <div style="
            font-size: ${fontSize}em;
            line-height: 1;
            transform: scaleY(${scaleY});
            margin: 0 4px;
            user-select: none;
            color: #1a1917;
          ">{</div>
          <div style="text-align: left; line-height: 1.6; padding-left: 4px;">
            ${lines.join('<br>')}
          </div>
        </div>
      `;
    });
  }
};
