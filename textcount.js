module.exports = {
  name: "WordCounter",
  version: "1.0",
  description: "文字数カウントパネルをヘッダーに追加"
};

studyNotesAPI.registerButton({
  icon: "📊",
  label: "文字数",
  title: "文字数カウント",
  onClick({ openPanel, content }) {
    // パネルを開く前にコンテンツを保存（グローバル経由）
    window._wc_content = content;
    openPanel("word-count-panel");
  }
});

studyNotesAPI.registerPanel("word-count-panel", ({ onClose }) => {
  const text = window._wc_content || '';
  const chars = text.length;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const lines = text.split('\n').length;

  const el = document.createElement('div');
  el.style.cssText = "font-family:'Noto Sans JP',sans-serif; line-height:2";
  el.innerHTML = `
    <h3 style="margin:0 0 12px; font-size:16px">📊 統計</h3>
    <table style="width:100%; border-collapse:collapse">
      <tr><td style="padding:6px 0; color:#666">文字数</td><td style="font-weight:700; font-size:20px">${chars}</td></tr>
      <tr><td style="padding:6px 0; color:#666">単語数</td><td style="font-weight:700; font-size:20px">${words}</td></tr>
      <tr><td style="padding:6px 0; color:#666">行数</td><td style="font-weight:700; font-size:20px">${lines}</td></tr>
    </table>
    <br/>
    <button onclick="this.closest('.ext-panel-body').querySelector('button').click()"
      style="padding:6px 16px;background:#1a1917;color:#fff;border:none;border-radius:6px;cursor:pointer">
      閉じる
    </button>
  `;
  // Fix close button
  el.querySelector('button').onclick = onClose;
  return el;
});
