module.exports = {
  name: "BarChart",
  version: "1.0",
  description: "@bar[1,3,2,5,4] で棒グラフ",
  transform(text) {
    return text.replace(/@bar\[([^\]]+)\]/g, (_, raw) => {
      const vals = raw.split(',').map(Number);
      const W = 200, H = 80, pad = 10;

      const max = Math.max(...vals);
      // 棒グラフの場合、基本は0を基準にするためminは0か最小値の小さい方をとる
      const min = Math.min(0, ...vals);
      const range = max - min || 1;

      // 棒の幅と間隔の計算
      const chartWidth = W - (pad * 2);
      const barGap = 4;
      const barWidth = (chartWidth / vals.length) - barGap;

      const bars = vals.map((v, i) => {
        const x = pad + i * (barWidth + barGap);
        // 値に基づいた高さの計算
        const barHeight = ((v - min) / range) * (H - pad * 2);
        const y = H - pad - barHeight;

        return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barWidth.toFixed(1)}" height="${barHeight.toFixed(1)}" fill="#4a90d9" rx="2" />`;
      }).join('');

      return `<svg width="${W}" height="${H}" style="vertical-align:middle; display:inline-block;">` +
        // 0の基準線（任意で追加）
        `<line x1="${pad}" y1="${H - pad}" x2="${W - pad}" y2="${H - pad}" stroke="#ccc" stroke-width="1"/>` +
        bars +
        `</svg>`;
    });
  }
};