import multer from "multer";
import path from "path";
import fs from "fs/promises"; // async fs
import { existsSync } from "fs";

const upload = multer({
  storage: multer.memoryStorage(), // tudo vai pra memória primeiro
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB por arquivo
  fileFilter: (req, file, cb) => {
    // valida por campo
    if (file.fieldname === "profileImage") {
      if (!file.mimetype.startsWith("image/")) {
        return cb(new Error("Invalid image file type"));
      }
    }

    if (file.fieldname === "resume") {
      const isPDF =
        file.mimetype.includes("pdf") ||
        file.originalname.toLowerCase().endsWith(".pdf");
      if (!isPDF) return cb(new Error("Resume must be a PDF file"));
    }

    cb(null, true);
  },
});

const saveBufferToDisk = async (buffer, folder, originalname, prefix) => {
  const folderPath = path.join("uploads", folder);
  if (!existsSync(folderPath)) {
    await fs.mkdir(folderPath, { recursive: true });
  }

  const ext = path.extname(originalname) || "";
  const filename = `${prefix}_${Date.now()}${ext}`;
  const filePath = path.join(folderPath, filename);
  await fs.writeFile(filePath, buffer);
  return filePath;
};

export const uploadUserFiles = (req, res, next) => {
  const handler = upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]);

  handler(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    req.files = req.files || {};
    const profileFile = req.files.profileImage?.[0] ?? null;
    const resumeFile = req.files.resume?.[0] ?? null;

    try {
      const saved = { profilePath: null, resumePath: null };

      if (profileFile) {
        saved.profilePath = await saveBufferToDisk(
          profileFile.buffer,
          "profile",
          profileFile.originalname,
          "profile"
        );
      }

      if (resumeFile) {
        saved.resumePath = await saveBufferToDisk(
          resumeFile.buffer,
          "resume",
          resumeFile.originalname,
          "resume"
        );
      }

      req.savedFiles = saved;

      next();
    } catch (saveErr) {
      try {
        if (req.savedFiles) {
          if (req.savedFiles.profilePath) await fs.unlink(req.savedFiles.profilePath).catch(() => {});
          if (req.savedFiles.resumePath) await fs.unlink(req.savedFiles.resumePath).catch(() => {});
        }
      } catch (_) {
      }

      return res.status(500).json({ error: "Error saving files" });
    }
  });
};
