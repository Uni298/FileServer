module.exports = {
  name: "LineGraph",
  version: "1.0",
  description: "@graph[1,3,2,5,4] で折れ線グラフ",
  transform(text) {
    return text.replace(/@graph\[([^\]]+)\]/g, (_, raw) => {
      const vals = raw.split(',').map(Number);
      const W = 200, H = 80, pad = 10;
      const max = Math.max(...vals), min = Math.min(...vals);
      const range = max - min || 1;
      const pts = vals.map((v, i) => {
        const x = pad + i * (W - pad*2) / (vals.length - 1);
        const y = pad + (1 - (v - min) / range) * (H - pad*2);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(' ');
      return `<svg width="${W}" height="${H}" style="vertical-align:middle">` +
        `<polyline points="${pts}" fill="none" stroke="#4a90d9" stroke-width="1.5" stroke-linejoin="round"/>` +
        vals.map((v,i) => {
          const x = pad + i*(W-pad*2)/(vals.length-1);
          const y = pad + (1-(v-min)/range)*(H-pad*2);
          return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.5" fill="#4a90d9"/>`;
        }).join('') + `</svg>`;
    });
  }
};
