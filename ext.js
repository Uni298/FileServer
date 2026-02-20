/**
 * LineGraph Extension for StudyNotes
 * version: 2.0
 *
 * 記法:
 *   @graph[1,3,2,5,4]              — 単一系列
 *   @graph[1,2,3:4,3,2]            — 複数系列（: で区切り）
 *   @graph[1,2,3:4,3,2]{タイトル}  — タイトル付き
 *
 * ツールバーボタン:
 *   📈 グラフ — 挿入パネルを開く（プレビュー付き）
 */

module.exports = {
  name: "LineGraph",
  version: "2.0",
  description: "@graph[1,3,2,5,4] または @graph[A系列:B系列] で折れ線グラフを描画",

  transform(text) {
    return text.replace(/@graph\[([^\]]+)\](?:\{([^}]*)\})?/g, (_, raw, title) => {
      return renderGraph(raw, title || null);
    });
  }
};

// =====================
//  グラフ描画コア
// =====================
function renderGraph(raw, title) {
  const seriesRaw = raw.split(':');
  const allSeries = seriesRaw.map(s => s.split(',').map(Number).filter(n => !isNaN(n)));
  if (allSeries.every(s => s.length === 0)) return '';

  const W = 340, H = title ? 220 : 200;
  const padLeft = 45, padRight = 15, padTop = title ? 30 : 15, padBottom = 35;
  const graphW = W - padLeft - padRight;
  const graphH = H - padTop - padBottom;

  const allVals = allSeries.flat();
  const dataMax = Math.max(...allVals);
  const dataMin = Math.min(...allVals);

  function niceScale(min, max, targetTicks = 5) {
    const range = max - min || 1;
    const roughStep = range / targetTicks;
    const mag = Math.pow(10, Math.floor(Math.log10(roughStep)));
    const candidates = [1, 2, 2.5, 5, 10];
    const step = candidates.map(c => c * mag).find(s => s >= roughStep) || mag * 10;
    const niceMin = Math.floor(min / step) * step;
    const niceMax = Math.ceil(max / step) * step;
    return { step, niceMin, niceMax };
  }

  const { step: yStep, niceMin: yMin, niceMax: yMax } = niceScale(dataMin, dataMax, 5);
  const yRange = yMax - yMin;
  const maxLen = Math.max(...allSeries.map(s => s.length));

  const toX = i => padLeft + (i / (maxLen - 1 || 1)) * graphW;
  const toY = v => padTop + (1 - (v - yMin) / yRange) * graphH;

  const colors = ['#4f8ef7', '#f7674f', '#4fcf8e', '#f7c44f', '#bf4ff7'];
  const fmt = n => parseFloat(n.toPrecision(4)).toString();

  // Y軸メモリ
  const yTicks = [];
  for (let v = yMin; v <= yMax + yStep * 0.01; v = Math.round((v + yStep) * 1e10) / 1e10) {
    if (v < yMin - yStep * 0.01 || v > yMax + yStep * 0.01) continue;
    yTicks.push(v);
  }

  // X軸メモリ（データ点数に応じて間引き）
  const xTickStep = Math.max(1, Math.ceil((maxLen - 1) / 6));
  const xTicks = [];
  for (let i = 0; i < maxLen; i += xTickStep) xTicks.push(i);
  if (xTicks[xTicks.length - 1] !== maxLen - 1) xTicks.push(maxLen - 1);

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" style="background:#1a1d27;border-radius:8px;font-family:monospace;display:block">`;

  // タイトル
  if (title) {
    svg += `<text x="${W / 2}" y="18" fill="#cdd6f4" font-size="11" text-anchor="middle" font-weight="bold">${escapeXml(title)}</text>`;
  }

  // グリッド線 (Y)
  for (const v of yTicks) {
    const y = toY(v).toFixed(1);
    svg += `<line x1="${padLeft}" y1="${y}" x2="${W - padRight}" y2="${y}" stroke="#2e3347" stroke-width="1"/>`;
    svg += `<text x="${padLeft - 4}" y="${y}" fill="#8892a4" font-size="9" text-anchor="end" dominant-baseline="middle">${fmt(v)}</text>`;
  }

  // グリッド線 (X)
  for (const i of xTicks) {
    const x = toX(i).toFixed(1);
    svg += `<line x1="${x}" y1="${padTop}" x2="${x}" y2="${H - padBottom}" stroke="#2e3347" stroke-width="1"/>`;
    svg += `<text x="${x}" y="${H - padBottom + 12}" fill="#8892a4" font-size="9" text-anchor="middle">${i}</text>`;
  }

  // 軸線
  svg += `<line x1="${padLeft}" y1="${padTop}" x2="${padLeft}" y2="${H - padBottom}" stroke="#4a5068" stroke-width="1.5"/>`;
  svg += `<line x1="${padLeft}" y1="${H - padBottom}" x2="${W - padRight}" y2="${H - padBottom}" stroke="#4a5068" stroke-width="1.5"/>`;

  // 各系列
  allSeries.forEach((vals, si) => {
    if (vals.length === 0) return;
    const color = colors[si % colors.length];
    const pts = vals.map((v, i) => `${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(' ');
    const fillPts = `${toX(0).toFixed(1)},${(H - padBottom).toFixed(1)} ${pts} ${toX(vals.length - 1).toFixed(1)},${(H - padBottom).toFixed(1)}`;

    svg += `<polygon points="${fillPts}" fill="${color}" fill-opacity="0.08"/>`;
    svg += `<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;

    vals.forEach((v, i) => {
      const x = toX(i).toFixed(1), y = toY(v).toFixed(1);
      svg += `<circle cx="${x}" cy="${y}" r="3" fill="${color}" stroke="#1a1d27" stroke-width="1.5"/>`;
    });
  });

  svg += `</svg>`;
  return svg;
}

function escapeXml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// =====================
//  StudyNotes UI 拡張
// =====================
studyNotesAPI.registerButton({
  icon: "📈",
  label: "グラフ",
  title: "折れ線グラフを挿入",
  onClick({ openPanel }) {
    openPanel("linegraph-insert-panel");
  }
});

studyNotesAPI.registerPanel("linegraph-insert-panel", ({ onClose, insertAtCursor }) => {
  const el = document.createElement('div');
  el.style.cssText = `
    font-family: 'Noto Sans JP', monospace, sans-serif;
    padding: 16px;
    width: 380px;
    background: #ffffff;
    color: #cdd6f4;
    border-radius: 8px;
    box-sizing: border-box;
  `;

  el.innerHTML = `
    <h3 style="margin:0 0 14px;font-size:15px;color:#cdd6f4;display:flex;align-items:center;gap:8px">
      📈 <span>折れ線グラフ挿入</span>
    </h3>

    <label style="font-size:11px;color:#8892a4;display:block;margin-bottom:4px">
      データ（系列は : で区切る、値は , で区切る）
    </label>
    <input id="lg-data" type="text" placeholder="例: 1,3,2,5,4  または  1,2,3:4,3,2"
      style="width:100%;box-sizing:border-box;padding:8px;background:#2e3347;border:1px solid #3e4560;border-radius:5px;color:#cdd6f4;font-size:13px;outline:none;font-family:monospace">

    <label style="font-size:11px;color:#8892a4;display:block;margin:10px 0 4px">
      タイトル（省略可）
    </label>
    <input id="lg-title" type="text" placeholder="例: 気温の推移"
      style="width:100%;box-sizing:border-box;padding:8px;background:#2e3347;border:1px solid #3e4560;border-radius:5px;color:#cdd6f4;font-size:13px;outline:none">

    <div style="margin:12px 0 8px;font-size:11px;color:#8892a4">プレビュー</div>
    <div id="lg-preview" style="min-height:80px;display:flex;align-items:center;justify-content:center;background:#12141e;border-radius:6px;padding:8px;overflow:hidden">
      <span style="color:#4a5068;font-size:12px">データを入力するとプレビューが表示されます</span>
    </div>

    <div style="margin-top:14px;font-size:11px;color:#4a5068">
      例: <code style="color:#8892a4">1,3,2,5,4</code> &nbsp;|&nbsp;
      複数系列: <code style="color:#8892a4">1,2,3:4,3,2</code>
    </div>

    <div style="display:flex;gap:8px;margin-top:14px">
      <button id="lg-insert" style="flex:1;padding:9px;background:#4f8ef7;color:#fff;border:none;border-radius:5px;cursor:pointer;font-size:13px;font-weight:bold">
        挿入
      </button>
      <button id="lg-cancel" style="flex:1;padding:9px;background:#2e3347;color:#cdd6f4;border:1px solid #3e4560;border-radius:5px;cursor:pointer;font-size:13px">
        キャンセル
      </button>
    </div>
  `;

  const dataInput = el.querySelector('#lg-data');
  const titleInput = el.querySelector('#lg-title');
  const preview = el.querySelector('#lg-preview');

  function updatePreview() {
    const raw = dataInput.value.trim();
    if (!raw) {
      preview.innerHTML = `<span style="color:#4a5068;font-size:12px">データを入力するとプレビューが表示されます</span>`;
      return;
    }
    // 簡易バリデーション
    const valid = raw.split(':').every(s => s.split(',').every(v => !isNaN(parseFloat(v.trim()))));
    if (!valid) {
      preview.innerHTML = `<span style="color:#f7674f;font-size:12px">⚠ 数値を , で区切って入力してください</span>`;
      return;
    }
    preview.innerHTML = renderGraph(raw, titleInput.value.trim() || null);
  }

  dataInput.addEventListener('input', updatePreview);
  titleInput.addEventListener('input', updatePreview);

  el.querySelector('#lg-insert').addEventListener('click', () => {
    const raw = dataInput.value.trim();
    if (!raw) return;
    const t = titleInput.value.trim();
    const syntax = t ? `@graph[${raw}]{${t}}` : `@graph[${raw}]`;
    insertAtCursor(syntax);
    onClose();
  });

  el.querySelector('#lg-cancel').addEventListener('click', onClose);

  // Enterキーで挿入
  dataInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') el.querySelector('#lg-insert').click();
  });

  return el;
});
