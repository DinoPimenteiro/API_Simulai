import transporter from "../config/mailConfig.js";
import { cryptoHash } from "../utils/hashUtils.js";
import crypto from "crypto";

class mailService {
  async sendEmail(userMail) {
    const code = Math.floor(1000 + Math.random() * 9000);

    const body = {
      from: process.env.CLIENT_ID,
      to: userMail,
      subject: "Recuperação de acesso- SIMULAI",
      html: `<h1> SIMULAI </h1> \n <h3> código para recuperação de acesso: ${code} </h3>`,
      text: `Código de recuperação para senha SIMULAI: ${code}`,
    };

    try {
      const sent = await transporter.sendMail(body);
      return {
        sent,
        code,
      };
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async recruitEmail(email) {
    let tk = crypto.randomBytes(40).toString("hex");
    const hashTk = cryptoHash(tk);

    const link= `http://localhost:4000/auth/admin/${tk}`;

    const body = {
      from: process.env.CLIENT_ID,
      to: email,
      subject: "Convite para a equipe de desenvolvimento SIMULAI",
      html: `Clique <a src="http://localhost:4000/auth/admin">AQUI</a> para realizar o cadastro da sua conta. 
             Não compartilhe este link com ninguém.`,
      text: `Clique em ${link} para realizar o cadastro da sua conta. 
             Não compartilhe este link com absolutamente ninguém.`
    };
  }
}

export default new mailService();
