import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folderPath;

    if (file.fieldname === "profileImage") {
      folderPath = path.join("uploads", "profile");
    } else if (file.fieldname === "resume") {
      folderPath = path.join("uploads", "resume");
    } else {
      folderPath = path.join("uploads", "others");
    }

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    cb(null, folderPath);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const prefix = file.fieldname === "profileImage" ? "profile" : "resume";
    cb(null, `${prefix}_${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // limite máximo geral (10MB)
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "profileImage") {
      if (!file.mimetype.startsWith("image/")) {
        return cb(new Error("Invalid image file type"));
      }
    }

    if (file.fieldname === "resume") {
      if (
        !file.mimetype.startsWith("application/") ||
        !file.originalname.endsWith(".pdf")
      ) {
        return cb(new Error("Resume must be a PDF file"));
      }
    }

    cb(null, true);
  },
});

export const uploadUserFiles = upload.fields([
  { name: "profileImage", maxCount: 1 },
  { name: "resume", maxCount: 1 },
]);
