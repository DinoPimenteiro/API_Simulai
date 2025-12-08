// middleware/multerAudio.js
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOAD_DIR = path.join(__dirname, "../uploads/audio");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname) || ".wav";
    const name = `audio_${Date.now()}${Math.round(Math.random() * 1e6)}${ext}`;
    cb(null, name);
  },
});

function fileFilter(req, file, cb) {
  const allowed = [
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/x-wav",
    "audio/m4a",
    "audio/x-m4a",
    "audio/ogg"
  ];

  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Formato não suportado. Envie um arquivo de áudio."), false);
  }

  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }
});

export default upload.single('file');
