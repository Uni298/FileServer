const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// 保存ディレクトリ
const UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

// Multer 設定
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const id = uuidv4();
    const ext = path.extname(file.originalname);
    cb(null, id + ext);
  }
});
const upload = multer({ storage });

// 静的ファイル (HTML/CSS)
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// アップロード (Web/CUI 共通)
app.post("/upload", upload.single("file"), (req, res) => {
  const id = path.basename(req.file.filename, path.extname(req.file.filename));
  res.send(id); // ID を返す
});

// ダウンロード (Web/CUI 共通)
app.get("/download/:id", (req, res) => {
  const id = req.params.id;
  const files = fs.readdirSync(UPLOAD_DIR);
  const file = files.find(f => f.startsWith(id));
  if (!file) return res.status(404).send("Not found");
  res.download(path.join(UPLOAD_DIR, file));
});

app.listen(PORT, "0.0.0.0", () => console.log(`Server running on http://0.0.0.0:${PORT}`));
