import multer from "multer";
import path from "path";
import fs from "fs";

export async function Resume(req) {
  return new Promise((resolve, reject) => {
   
    const storage = multer.diskStorage({

      destination: (req, file, cb) => {
        const folderPath = path.join("uploads", "resume");
        if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });
        cb(null, folderPath);
      },

      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `resume_${Date.now()}${ext}`); 
      },
    });

    const upload = multer({
      storage,
      limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB, 
      fileFilter: (req, file, cb) => {
        // Se não for arquivo, rejeita o arquivo e ignora (sem erro, só não aceita)
        if (!file.mimetype.startsWith("application/")) {
          return cb(null, false);
        }
        cb(null, true);
      },
    }).single("Resume"); 
  
    upload(req, null, (err) => {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") return reject(new Error("Arquivo muito grande"));
        return reject(err);
      }

      // Se não houve arquivo enviado, resolve null
      if (!req.file) return resolve(null);

      // Caso contrário, retorna o caminho do arquivo salvo
      resolve(req.file.path);
    });
  });
}

