import { Router } from "express";
import interviewController from "../Controllers/interviewController.js";
import authUser from "../Middlewares/authUser.js";
import simpleMulter from "../Middlewares/simpleMulter.js";
import uploadAudio from "../Middlewares/uploadAudio.js";
import e from "express";

const router = Router();

router.post(
  "/start/:userId",
  simpleMulter,
  authUser,
  interviewController.IniateInterview
);
router.get("/pdf_data/:session_id", authUser, interviewController.GetPdfData);
router.post("/chat", authUser, interviewController.Chat);
router.get("/history/:session_id", authUser, interviewController.getHistory);

router.get(
  "/user_interviews/:userId",
  authUser,
  interviewController.getInterviewByUser
);

router.post("/generate-report", authUser, interviewController.GenerateReport);

router.post(
  "/transcrever-audio",
  uploadAudio,
  authUser,
  interviewController.Transcribe
);

router.post(
  "/transcrever-texto",
  authUser,
  interviewController.TTS
);

router.delete(
  "/delete-interview/:session_id",
  authUser,
  interviewController.deleteOneInterview
);

router.get(
  "/user-feedback/:userId",
  authUser,
  interviewController.getFeedbackStats
);

export default router;
