module.exports = {
  name: "AdvancedLineGraph",
  version: "1.1",
  description: "@graph[1,3,2,5,4]; で目盛りとグリッド付きのグラフを表示",

  transform(text) {
    // セミコロンがあるかどうかを判定する正規表現に変更
    return text.replace(/@graph\[([^\]]+)\](;?)/g, (_, raw, gridFlag) => {
      const vals = raw.split(',').map(Number);
      const hasGrid = gridFlag === ';';
      
      // レイアウト設定（目盛りスペースのためにパディングを確保）
      const W = 240, H = 120;
      const padL = 35, padR = 15, padT = 15, padB = 25;
      const innerW = W - padL - padR;
      const innerH = H - padT - padB;

      const max = Math.max(...vals);
      const min = Math.min(...vals);
      const range = max - min || 1;

      // 座標変換関数
      const getX = (i) => padL + i * (innerW / (vals.length - 1));
      const getY = (v) => padT + (1 - (v - min) / range) * innerH;

      // 1. グリッドと目盛りの生成
      let gridHtml = '';
      let labelsHtml = '';

      // Y軸目盛り（4分割程度）
      const yTicks = 4;
      for (let i = 0; i <= yTicks; i++) {
        const val = min + (range * i / yTicks);
        const y = getY(val);
        
        // グリッド線（hasGridが真の場合）
        if (hasGrid) {
          gridHtml += `<line x1="${padL}" y1="${y}" x2="${W - padR}" y2="${y}" stroke="#eee" stroke-width="1"/>`;
        }
        // Y軸ラベル
        labelsHtml += `<text x="${padL - 5}" y="${y}" font-size="10" fill="#888" text-anchor="end" dominant-baseline="central">${val.toFixed(1)}</text>`;
      }

      // X軸目盛り（全データ点または間引き）
      vals.forEach((_, i) => {
        const x = getX(i);
        if (hasGrid) {
          gridHtml += `<line x1="${x}" y1="${padT}" x2="${x}" y2="${H - padB}" stroke="#eee" stroke-width="1"/>`;
        }
        // X軸ラベル（データ量が多い場合は適宜間引くロジックを入れるとさらに綺麗です）
        labelsHtml += `<text x="${x}" y="${H - padB + 12}" font-size="10" fill="#888" text-anchor="middle">${i + 1}</text>`;
      });

      // 2. グラフ本体（ポリラインと点）
      const pts = vals.map((v, i) => `${getX(i).toFixed(1)},${getY(v).toFixed(1)}`).join(' ');
      const color = "#4a90d9"; // StudyNotes標準の青色

      const graphHtml = `
        <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round"/>
        ${vals.map((v, i) => `<circle cx="${getX(i).toFixed(1)}" cy="${getY(v).toFixed(1)}" r="3" fill="${color}"/>`).join('')}
      `;

      // SVG組み立て
      return `
        <div style="display:inline-block; background:#fff; border:1px solid #ddd; border-radius:4px; padding:5px; margin:5px;">
          <svg width="${W}" height="${H}" style="vertical-align:middle; font-family:sans-serif;">
            ${gridHtml}
            <line x1="${padL}" y1="${padT}" x2="${padL}" y2="${H - padB}" stroke="#888" stroke-width="1"/> <line x1="${padL}" y1="${H - padB}" x2="${W - padR}" y2="${H - padB}" stroke="#888" stroke-width="1"/> ${labelsHtml}
            ${graphHtml}
          </svg>
        </div>
      `;
    });
  }
};
