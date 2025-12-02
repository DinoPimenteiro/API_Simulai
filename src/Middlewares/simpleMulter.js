import multer from "multer";

const storage = multer.memoryStorage(); // guarda o arquivo em buffer

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // limite: 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Apenas arquivos PDF são permitidos."));
    }
    cb(null, true);
  },
});

export default upload.single("file");
