module.exports = {
  name: "MultiLineGraphWithGrid",
  version: "1.2",
  description: "@graph[1,2:3,4] で2本の折れ線と常時グリッド表示",

  transform(text) {
    return text.replace(/@graph\[([^\]]+)\]/g, (_, raw) => {
      // コロンでデータを分割
      const dataSets = raw.split(':').map(group => group.split(',').map(Number));
      
      const W = 280, H = 160;
      const padL = 40, padR = 20, padT = 20, padB = 30;
      const innerW = W - padL - padR;
      const innerH = H - padT - padB;

      // 全データセットを含めた最大・最小値を計算
      const allVals = dataSets.flat();
      const max = Math.max(...allVals);
      const min = Math.min(...allVals);
      const range = max - min || 1;
      const maxLen = Math.max(...dataSets.map(d => d.length));

      // 座標変換関数
      const getX = (i, len) => padL + i * (innerW / (len - 1 || 1));
      const getY = (v) => padT + (1 - (v - min) / range) * innerH;

      let gridHtml = '';
      let labelsHtml = '';

      // 1. グリッドとY軸目盛り（常時表示）
      const yTicks = 5;
      for (let i = 0; i <= yTicks; i++) {
        const val = min + (range * i / yTicks);
        const y = getY(val);
        gridHtml += `<line x1="${padL}" y1="${y}" x2="${W - padR}" y2="${y}" stroke="#f0f0f0" stroke-width="1"/>`;
        labelsHtml += `<text x="${padL - 8}" y="${y}" font-size="11" fill="#666" text-anchor="end" dominant-baseline="central">${val.toFixed(1)}</text>`;
      }

      // 2. X軸目盛り（最大のデータ数に合わせる）
      for (let i = 0; i < maxLen; i++) {
        const x = padL + i * (innerW / (maxLen - 1 || 1));
        gridHtml += `<line x1="${x}" y1="${padT}" x2="${x}" y2="${H - padB}" stroke="#f0f0f0" stroke-width="1"/>`;
        labelsHtml += `<text x="${x}" y="${H - padB + 15}" font-size="11" fill="#666" text-anchor="middle">${i + 1}</text>`;
      }

      // 3. 各データセットの描画
      const colors = ["#4a90d9", "#e05c5c"]; // 1本目: 青, 2本目: 赤
      const graphHtml = dataSets.map((vals, dIdx) => {
        const color = colors[dIdx % colors.length];
        const pts = vals.map((v, i) => `${getX(i, vals.length).toFixed(1)},${getY(v).toFixed(1)}`).join(' ');
        
        return `
          <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" />
          ${vals.map((v, i) => `<circle cx="${getX(i, vals.length).toFixed(1)}" cy="${getY(v).toFixed(1)}" r="3.5" fill="${color}" stroke="#fff" stroke-width="1"/>`).join('')}
        `;
      }).join('');

      return `
        <div style="display:inline-block; background:#fff; border:1px solid #eee; border-radius:8px; padding:10px; margin:5px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
          <svg width="${W}" height="${H}" style="vertical-align:middle; font-family:'Noto Sans JP', sans-serif;">
            ${gridHtml}
            <line x1="${padL}" y1="${padT}" x2="${padL}" y2="${H - padB}" stroke="#ccc" stroke-width="1.5"/>
            <line x1="${padL}" y1="${H - padB}" x2="${W - padR}" y2="${H - padB}" stroke="#ccc" stroke-width="1.5"/>
            ${labelsHtml}
            ${graphHtml}
          </svg>
        </div>
      `;
    });
  }
};
