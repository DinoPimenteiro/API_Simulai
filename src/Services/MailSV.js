import transporter from "../config/mailConfig.js";
import { cryptoHash } from "../utils/hashUtils.js";
import crypto from "crypto";

const ROUTE = '/admin'

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
    const link= `${process.env.APP_URL}${ROUTE}`;

    const body = {
      from: process.env.CLIENT_ID,
      to: email,
      subject: "Convite para a equipe de desenvolvimento SIMULAI",
      html: `<h4> Clique neste link para realizar seu cadastro: ${link} </h4>`,
      text: `Clique neste link para realizar seu cadastro: ${link}`  
    };
  }
}

export default new mailService();
