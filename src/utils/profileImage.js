import multer from "multer";
import path from "path";
import fs from "fs";

export async function HandleProfileImage(req) {
  return new Promise((resolve, reject) => {
   
    const storage = multer.diskStorage({

      destination: (req, file, cb) => {
        const folderPath = path.join("uploads", "profile");
        if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });
        cb(null, folderPath);
      },

      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `profile_${Date.now()}${ext}`); //dá, msa não sei como, porque aqui é um middleware, dentro da callback de uma função
      },
    });

    const upload = multer({
      storage,
      limits: { fileSize: 2 * 1024 * 1024 }, 
      fileFilter: (req, file, cb) => {
        // Se não for imagem, rejeita o arquivo e ignora (sem erro, só não aceita)
        if (!file.mimetype.startsWith("image/")) {
          return cb(null, false);
        }
        cb(null, true);
      },
    }).single("profileImage"); 
  
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

