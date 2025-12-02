import validator from "validator";
import { api } from "../config/axiosConfig.js";
import InterviewRepo from "../Repositories/InterviewRepo.js";
import ClientRepo from "../Repositories/ClientRepo.js";
import FormData from "form-data";
import { Readable } from "stream";

class InterviewService {
  async ReadFile(id, cargo, file) {
    if (
      !id ||
      typeof id !== "string" ||
      validator.isHexadecimal(id) === false
    ) {
      throw new Error("ID de usuário inválido.");
    }

    if (
      !cargo ||
      cargo.toLowerCase() === "indefinido" ||
      typeof cargo !== "string"
    ) {
      throw new Error("Cargo inválido.");
    }

    if (!file || !file.buffer) {
      throw new Error("Arquivo não fornecido.");
    }

    const formData = new FormData();

    const filestream = Readable.from(file.buffer);

    formData.append("cargo", cargo);
    formData.append("file", filestream, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    try {
      const res = await api.post(`/analisar_pdf`, formData, {
        headers: formData.getHeaders(),
      });

      if (res.data.session_id) {
        const pdfData = await this.getPdfData(res.data.session_id);

        await InterviewRepo.createInterview({
          session_id: res.data.session_id,
          user: id,
          cargo: cargo,
          pdf_data: pdfData,
        });

        return res.data;
      } else {
        throw new Error("RESPOSTA inválida do servidor.");
      }
    } catch (err) {
      throw err;
    }
  }

  async getPdfData(session_id) {
    if (!session_id || typeof session_id !== "string") {
      throw new Error("ID de sessão inválido.");
    }

    try {
      const res = await api.get(`/pdf_data/${session_id}`);
      if (res.data) {
        return res.data;
      } else {
        throw new Error("RESPOSTA inválida do servidor.");
      }
    } catch (err) {
      throw err;
    }
  }

  async Chat(chat_message) {
    if (!chat_message?.session_id || !chat_message?.message) {
      throw new Error("Parâmetros inválidos para o chat.");
    }

    if (
      typeof chat_message.message !== "string" ||
      chat_message.message.trim() === ""
    ) {
      throw new Error("Mensagem inválida.");
    }

    try {
      const res = await api.post("/chat", chat_message);

      if (res.data.reply) {
        return res.data; // retorna apenas o texto do assistente
      } else {
        throw new Error("Resposta inválida do servidor.");
      }
    } catch (err) {
      console.error(err.message);
      throw err;
    }
  }

  async GetHistory(session_id) {
    if (!session_id || typeof session_id !== "string") {
      throw new Error("ID de sessão inválido.");
    }
    try {
      const interview = await InterviewRepo.findBySessionId(session_id);

      if (!interview) throw new Error("Entrevista não encontrada.");

      const res = await api.get(`/historico/${session_id}`);
      if (res.data.messages) {
        interview.messages = res.data.messages;
        await interview.save();
        return res.data;
      } else {
        throw new Error("Resposta inválida do servidor.");
      }
    } catch (error) {
      console.error("AISLDKBSJLK", error.message);
      throw error;
    }
  }

  async GenerateReport(reportRequest) {
    if (
      reportRequest == null ||
      !reportRequest.session_id ||
      typeof reportRequest.session_id !== "string"
    ) {
      throw new Error("ID de sessão inválido para gerar relatório.");
    }

    try {
      const interview = await InterviewRepo.findBySessionId(
        reportRequest.session_id
      );
      if (!interview) throw new Error("Entrevista não encontrada.");

      const res = await api.post(`/gerar_relatorio`, reportRequest);
      if (res.data.report) {
        interview.report = res.data.report;
        interview.feedback = res.data.competencias;
        await interview.save();
        return res.data;
      } else {
        throw new Error("Resposta inválida do servidor.");
      }
    } catch (err) {
      console.error(err.message);
      throw err;
    }
  }

  // ======================== COISAS COMUNS ===========================

  async getInteviewByUser(userId) {
    if (
      !userId ||
      typeof userId !== "string" ||
      validator.isHexadecimal(userId) === false
    ) {
      throw new Error("ID de usuário inválido.");
    }

    try {
      const client = await ClientRepo.findID(userId);
      if (!client) {
        throw new Error("Cliente não encontrado para o usuário fornecido.");
      }
      const interviews = await InterviewRepo.findByUserId(client._id);
      const parsed = interviews.map((interview) => ({
        session_id: interview.session_id,
        cargo: interview.cargo,
        createdAt: interview.createdAt,
        feedback: interview.feedback,
        report: interview.report,
      }));
      return parsed;
    } catch (error) {
      throw error;
    }
  }
}
export default new InterviewService();
