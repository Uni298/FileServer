module.exports = {
  name: "Latin Input Helper",
  version: "1.2.0",
  description: "UIからギリシャ文字を選択して挿入・変換します",

  // 1. エディタ上の表記を実際の文字に変換する処理
  transform(text) {
    const map = {
      ":alpha": "α", ":beta": "β", ":gamma": "γ", ":delta": "δ", ":epsilon": "ε",
      ":zeta": "ζ", ":eta": "η", ":theta": "θ", ":iota": "ι", ":kappa": "κ",
      ":lambda": "λ", ":mu": "μ", ":nu": "ν", ":xi": "ξ", ":pi": "π",
      ":rho": "ρ", ":sigma": "σ", ":tau": "τ", ":phi": "φ", ":chi": "χ",
      ":psi": "ψ", ":omega": "ω", ":Delta": "Δ", ":Omega": "Ω", ":infty": "∞"
    };
    let result = text;
    for (const [key, val] of Object.entries(map)) {
      result = result.split(key).join(val);
    }
    return result;
  }
};

// 2. UIの登録
studyNotesAPI.registerButton({
  icon: "α",
  label: "ラテン文字",
  title: "ギリシャ文字入力を開く",
  onClick({ openPanel }) {
    openPanel("latin-selector-panel");
  }
});

studyNotesAPI.registerPanel("latin-selector-panel", ({ onClose, insertAtCursor, focusEditor }) => {
  const el = document.createElement('div');
  el.style.cssText = "padding:15px; font-family:'Noto Sans JP',sans-serif; width:250px;";
  el.innerHTML = `<h4 style="margin:0 0 10px">文字を選択して挿入</h4>`;

  // 挿入したいリスト（表示文字と挿入する記法のペア）
  const characters = [
    { display: "α", code: ":alpha" }, { display: "β", code: ":beta" },
    { display: "γ", code: ":gamma" }, { display: "δ", code: ":delta" },
    { display: "ε", code: ":epsilon" }, { display: "θ", code: ":theta" },
    { display: "λ", code: ":lambda" }, { display: "μ", code: ":mu" },
    { display: "π", code: ":pi" }, { display: "σ", code: ":sigma" },
    { display: "ω", code: ":omega" }, { display: "Δ", code: ":Delta" },
    { display: "Ω", code: ":Omega" }, { display: "∞", code: ":infty" }
  ];

  const grid = document.createElement('div');
  grid.style.cssText = "display:grid; grid-template-columns: repeat(4, 1fr); gap:5px;";

  characters.forEach(item => {
    const btn = document.createElement('button');
    btn.innerHTML = `<span style="font-size:1.2em">${item.display}</span><br><small style="font-size:0.6em;color:#666">${item.code}</small>`;
    btn.style.cssText = "padding:8px 4px; cursor:pointer; background:#fff; border:1px solid #ddd; border-radius:4px; text-align:center; line-height:1.2";

    btn.onclick = () => {
      // 記法を挿入
      insertAtCursor(item.code);
      // エディタにフォーカスを戻す
      focusEditor();
      // パネルを閉じる（連続入力したい場合は onClose を外してください）
      onClose();
    };
    grid.appendChild(btn);
  });

  el.appendChild(grid);

  const closeBtn = document.createElement('button');
  closeBtn.textContent = "閉じる";
  closeBtn.style.cssText = "width:100%; margin-top:15px; padding:8px; background:#1a1917; color:#fff; border:none; border-radius:4px; cursor:pointer";
  closeBtn.onclick = onClose;
  el.appendChild(closeBtn);

  return el;
});