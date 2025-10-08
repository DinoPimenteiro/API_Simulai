import transporter from "../config/mailConfig.js";
import InviteTokenRepo from "../Repositories/InviteTokenRepo.js";
import { generateTotp } from "../config/2FAConfig.js";
import generalValidations from "../utils/generalValidations.js";

const ROUTE = "/admin/register/";

class mailService {
  async recoverEmail(userMail) {
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
    const timeLimit = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const { qrCodeLink, secret } = await generateTotp(email);

    const adminInfo = {
      email: email,
      role: "Manager",
      secret: secret,
      qrcode: qrCodeLink,
      expiresAt: timeLimit,
    };

    const findInvite = await InviteTokenRepo.findByUser(email);

    if (findInvite) {
      throw new Error("Pending invite.");
    }

    const savedInvite = await InviteTokenRepo.saveToken(adminInfo);

    if (!savedInvite) {
      throw new Error("Não salvou o invite.");
    }

    // http://localhost:4000/admin/register/:id
    const invitationaLink = `${process.env.APP_URL}${ROUTE}${savedInvite._id}`;

    const body = {
      from: process.env.CLIENT_ID,
      to: email,
      subject: "Bem Vindo a SIMULAI",
      html: `Seja muito bem vindo a equipe de adminstradores da SIMULAI. Clique <a href="${invitationaLink}"> AQUI </a>`,
      text: `Link para cadastro de administrador: ${invitationaLink}`,
    };

    try {
      const sent = await transporter.sendMail(body);

      return {
        sent,
        invitationaLink,
      };
    } catch (err) {
      throw new Error(err.message);
    }
  }
  async contactEmail(name, email, subject, message) {
    generalValidations.validateName(name);
    generalValidations.validateEmail(email);

    const body = {
      from: email,
      to: process.env.CLIENT_ID,
      subject: subject,
      html: message,
      text: message,
    };

    try {
      const sent = await transporter.sendMail(body);

      if (sent.accepted) {
        return {
          sent,
          name,
        };
      } else {
        sent.response;
      }
    } catch (err) {
      throw err;
    }
  }
}

export default new mailService();
