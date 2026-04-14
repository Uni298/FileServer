module.exports = {
  name: "One Stroke Geometry",
  version: "1.1.0",
  description: "一筆書きで図形を描画し、@t記法を挿入します"
};

studyNotesAPI.registerButton({
  icon: "📐",
  label: "一筆図形",
  onClick({ openPanel }) {
    openPanel("geometry-editor-panel");
  }
});

studyNotesAPI.registerPanel("geometry-editor-panel", ({ onClose, insertAtCursor, focusEditor }) => {
  const container = document.createElement('div');
  container.style.cssText = "padding:15px; font-family:sans-serif; width:320px; background:#fff;";
  
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 250;
  canvas.style.cssText = "border:1px solid #ccc; background:#fafafa; cursor:crosshair; margin-bottom:10px;";
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let points = []; // Canvas座標保持 {x, y}

  // 再描画: StudyNotesの描画イメージを再現
  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (points.length === 0) return;

    ctx.beginPath();
    ctx.strokeStyle = "#4a90d9"; // StudyNotes標準の青色
    ctx.lineWidth = 2;
    
    points.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
      
      // 頂点に小さなポインタを表示
      ctx.fillStyle = "#e05c5c";
      ctx.fillRect(p.x-2, p.y-2, 4, 4);
    });
    ctx.stroke();

    // 完了時に閉じる線を点線でガイド表示
    if (points.length > 2) {
      ctx.setLineDash([5, 5]);
      ctx.lineTo(points[0].x, points[0].y);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  };

  canvas.onclick = (e) => {
    const rect = canvas.getBoundingClientRect();
    points.push({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    draw();
  };

  const btnContainer = document.createElement('div');
  btnContainer.style.display = "flex";
  btnContainer.style.gap = "5px";

  const clearBtn = document.createElement('button');
  clearBtn.textContent = "クリア";
  clearBtn.style.flex = "1";
  clearBtn.onclick = () => { points = []; draw(); };

  const insertBtn = document.createElement('button');
  insertBtn.textContent = "図形を挿入";
  insertBtn.style.cssText = "flex:2; background:#1a1917; color:#fff; border:none; padding:8px; border-radius:4px; cursor:pointer;";
  
  insertBtn.onclick = () => {
    if (points.length < 2) return;

    // 1. 最初の点を (0,0) とした相対座標に変換
    const start = points[0];
    const notationParts = points.map((p, i) => {
      const rx = Math.round(p.x - start.x);
      const ry = Math.round(start.y - p.y); // Y軸を反転（上方向を正にする）
      const label = String.fromCharCode(65 + i); // A, B, C...
      return `(${rx},${ry}){${label}}`;
    });

    // 2. @t 記法として組み立て
    const result = `@t ${notationParts.join("-")};`;

    // 3. エディタに挿入
    insertAtCursor(result);
    focusEditor();
    onClose();
  };

  btnContainer.appendChild(clearBtn);
  btnContainer.appendChild(insertBtn);
  container.appendChild(btnContainer);

  return container;
});