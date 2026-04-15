/**
 * StudyNotes v2 拡張レンダラー
 * @param {string} text 
 */
function extendStudyNotes(text) {
  // 1. @q を ◎ に変換
  text = text.replace(/@q/g, '◎');

  // 2. 中括弧ロジック @{ ... @@
  // 正規表現で「@{」から「@@」までをキャプチャ
  // 前方の文字を後方の複数行に対して「{」でくくる
  const braceRegex = /([^\n]+?)@\{([\s\S]*?)@@/g;

  return text.replace(braceRegex, (match, before, content) => {
    // 改行数をカウントして高さを計算
    const lines = content.trim().split('\n');
    const height = lines.length;
    
    // インラインCSSを利用して、高さに応じた動的な中括弧を生成
    return `
      <div style="display: inline-flex; align-items: center; vertical-align: middle;">
        <div style="text-align: right; padding-right: 5px;">${before}</div>
        <div style="
          font-size: ${height * 1.2}em; 
          font-family: 'noto-serif'; 
          font-weight: 100;
          transform: scaleY(${height * 0.8});
          margin: 0 5px;
        ">{</div>
        <div style="text-align: left; line-height: 1.5;">
          ${lines.join('<br>')}
        </div>
      </div>
    `;
  });
}
