studyNotesAPI.registerButton({
  icon: "🌐",
  label: "ブラウザ",
  onClick({ openPanel }) {
    openPanel("web-browser-panel");
  }
});

studyNotesAPI.registerPanel("web-browser-panel", ({ onClose }) => {
  const container = document.createElement('div');
  container.style.width = "100%";
  container.style.height = "400px";

  // iframeを作成してブラウザのように見せる
  container.innerHTML = `
    <div style="display:flex; gap:5px; margin-bottom:10px;">
      <input type="text" id="url-input" style="flex:1" placeholder="https://...">
      <button id="go-btn">移動</button>
    </div>
    <iframe id="browser-frame" src="https://www.wikipedia.org" 
            style="width:100%; height:350px; border:1px solid #ccc;"></iframe>
  `;

  container.querySelector('#go-btn').onclick = () => {
    const url = container.querySelector('#url-input').value;
    container.querySelector('#browser-frame').src = url;
  };

  return container;
});