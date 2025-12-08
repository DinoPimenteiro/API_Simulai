import IntervireService from "../Services/InterviewSV.js";
import { sendError, errors } from "../utils/sendError.js";

class interviewController {
  async IniateInterview(req, res) {
    try {
      const result = await IntervireService.ReadFile(
        req.params.userId,
        req.body.cargo,
        req.file
      );

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return sendError(res, error.message, 400, errors.auth);
    }
  }

  async GetPdfData(req, res) {
    try {
      const pdfData = await IntervireService.getPdfData(req.params.session_id);
      res.status(200).json({ success: true, data: pdfData });
    } catch (err) {
      return sendError(res, err.message, 500, errors.internal);
    }
  }

  async Chat(req, res) {
    try {
      const chatResponse = await IntervireService.Chat(req.body);
      res.status(200).json({ success: true, data: chatResponse });
    } catch (error) {
      return sendError(res, error.message, 400, errors.auth);
    }
  }

  async getHistory(req, res) {
    try {
      const history = await IntervireService.GetHistory(req.params.session_id);
      res.status(200).json({ success: true, data: history });
    } catch (err) {
      return sendError(res, err.message, 500, errors.internal);
    }
  }

  async GenerateReport(req, res) {
    try {
      const report = await IntervireService.GenerateReport(req.body);
      res.status(200).json({ success: true, data: report });
    } catch (err) {
      return sendError(res, err.message, 500, errors.internal);
    }
  }

  async getInterviewByUser(req, res) {
    try {
      const histories = await IntervireService.getInteviewByUser(
        req.params.userId
      );
      res.status(200).json({ success: true, data: histories });
    } catch (err) {
      return sendError(res, err.message, 500, errors.internal);
    }
  }

  async getFeedbackStats(req, res) {
    try {
      const response = await IntervireService.getInterviewMetrics(
        req.params.userId
      );
      res.status(200).json({ success: true, data: response });
    } catch (err) {
      console.error(err.message);
      return sendError(res, err.message, 500, errors.internal);
    }
  }

  async deleteOneInterview(req, res) {
    try {
      const response = await IntervireService.deleteOneInterview(
        req.params.session_id
      );

      if (response) {
        res.status(200).json({ success: true, data: response });
      }
    } catch (err) {
      console.error(err.message);
      return sendError(res, err.message, 500, errors.internal);
    }
  }

  async Transcribe(req, res) {
    try {
      const message = await IntervireService.transcribeAudio(
        req.body,
        req.file
      );
      if (message) {
        console.log(message);
        res.status(200).json({ success: true, data: message });
      }
    } catch (error) {
      return sendError(res, err.message, 500, errors.internal);
    }
  }

  async TTS(req, res) {
    try {
      const { text } = req.body;

      const { audio, base64 } = await IntervireService.textToSpeech({ text });

      if (!audio || !base64) {
        return sendError(
          res,
          "Erro ao enviar/gerar aúdio",
          500,
          errors.internal
        );
      }

      res.setHeader("Content-Type", "audio/mpeg");

      res.status(200).json({ success: true, data: { audio, base64 } });
    } catch (err) {
      console.log(err.message);
      return sendError(res, err.message, 500, errors.internal);
    }
  }
}
export default new interviewController();
