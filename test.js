import express from "express";
import multer from "multer";
import mongoose from "mongoose";

const app = express();

// Schema
const FileSchema = new mongoose.Schema({
  filename: String,
  path: String,
  mimetype: String,
  size: Number
});
const File = mongoose.model("File", FileSchema);

// Configuração do multer (salva em disco)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// Rota de upload
app.post("/upload", upload.single("arquivo"), async (req, res) => {
  const file = new File({
    filename: req.file.filename,
    path: req.file.path,
    mimetype: req.file.mimetype,
    size: req.file.size
  });

  await file.save();

  res.json({ message: "Arquivo salvo!", file });
});