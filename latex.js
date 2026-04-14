module.exports = {
  name: "LatexRenderer",
  version: "1.0.0",
  description: "$...$ を数式としてレンダリングします（KaTeX使用）",

  transform(text) {
    // 1. KaTeXのスタイルシートとスクリプトをドキュメントに追加（初回のみ）
    if (!document.getElementById('katex-style')) {
      const link = document.createElement('link');
      link.id = 'katex-style';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
      document.head.appendChild(script);
    }

    // 2. テキスト内の $...$ を探して置換
    // 注: KaTeXが読み込まれるまで数秒かかる場合があります
    return text.replace(/\$(.*?)\$/g, (match, formula) => {
      if (window.katex) {
        try {
          return window.katex.renderToString(formula, { throwOnError: false });
        } catch (e) {
          return `<span style="color:red">${e}</span>`;
        }
      }
      // KaTeX準備中の場合は元のテキストを表示
      return match;
    });
  }
};