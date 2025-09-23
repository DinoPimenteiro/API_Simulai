import transporter from "../config/mailConfig.js";
import { cryptoHash } from "../utils/hashUtils.js";
import crypto from "crypto";

const ROUTE = '/admin/invite/';

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
    const tk = crypto.randomUUID();
    const timeLimit = new Date(Date.now() + 24 * 60 * 1000)

    // http://localhost:4000/admin/invite/{tokenUUID}
    const invitationaLink = `${process.env.APP_URL}${ROUTE}${tk}`

    const body = {
      from: process.env.CLIENT_ID,
      to: email,
      subject: "Bem Vindo a SIMULAI",
      html: `Seja muito bem vindo a equipe de adminstradores da SIMULAI. Clique <a href="${invitationaLink}"> AQUI </a>`,
      text: `Link para cadastro de administrador: ${invitationaLink}`
    }

    try{
      const sent = await transporter.sendMail(body);

      return {
        sent,
        tk,
        timeLimit
      }
    } catch(err){
      throw new Error(err.message)
    }
  }
}

export default new mailService();
