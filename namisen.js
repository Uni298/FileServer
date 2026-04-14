module.exports = {
  name: "Wavy Underline",
  version: "1.0.0",
  description: "@n(色)テキスト@@ で波線のアンダーラインを表示します",

  /**
   * テキスト変換
   * @param {string} text 
   * @returns {string} 
   */
  transform(text) {
    // 色コードの定義（マニュアルのテーブルに基づく）
    const colors = {
      r: '#e05c5c', // 赤
      b: '#4a90d9', // 青
      g: '#4dab7e', // 緑
      o: '#e0884a', // 橙
      y: '#d4b84a', // 黄
      p: '#8b6dd4', // 紫
      k: '#1a1917', // 黒
      w: '#ffffff'  // 白
    };

    // 正規表現: @n(色コード)コンテンツ@@
    // $1: 色コード, $2: テキスト内容
    return text.replace(/@n\(([rbgoypkw])\)(.*?)@@/g, (match, colorCode, content) => {
      const color = colors[colorCode] || '#1a1917'; // 未定義時は黒

      // 波線のスタイルを適用したspanを返す
      return `<span style="text-decoration: underline wavy ${color}; text-underline-offset: 3px;">${content}</span>`;
    });
  }
};