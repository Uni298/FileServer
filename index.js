const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

// ランダムな5文字英数字IDを生成
function generateId(length = 5) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < length; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

// ID と元ファイル名の対応を保存するためのマップ
const fileMap = {}; // { id: { filename, storedPath } }

// Multer 設定
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const id = generateId();
    const storedName = id + path.extname(file.originalname);
    fileMap[id] = {
      filename: file.originalname,
      storedPath: path.join(UPLOAD_DIR, storedName)
    };
    cb(null, storedName);
  }
});
const upload = multer({ storage });

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// アップロード
app.post("/upload", upload.single("file"), (req, res) => {
  // fileMap に保存済み
  const id = Object.keys(fileMap).find(k => fileMap[k].storedPath.endsWith(req.file.filename));
  res.send(id); // 5文字のIDを返す
});

// ダウンロード
app.get("/download/:id", (req, res) => {
  const id = req.params.id;
  const entry = fileMap[id];
  if (!entry) return res.status(404).send("Not found");
  res.download(entry.storedPath, entry.filename); // 元のファイル名で返す
});

app.listen(PORT, "0.0.0.0", () => console.log(`Server running on http://0.0.0.0:${PORT}`));
