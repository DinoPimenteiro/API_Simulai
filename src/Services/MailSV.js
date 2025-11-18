import crypto from "crypto";
import transporter from "../config/mailConfig.js";
import InviteTokenRepo from "../Repositories/InviteTokenRepo.js";
import { generateTotp } from "../config/2FAConfig.js";
import generalValidations from "../utils/generalValidations.js";
import AdminRepo from "../Repositories/AdminRepo.js";

const ROUTE = "/admin/register/";

class mailService {
  async recoverEmail(userMail) {
    generalValidations.validateEmail(userMail);
    const code = crypto.randomInt(100000, 999999);

    const body = {
      from: process.env.CLIENT_ID,
      to: userMail,
      subject: "Recuperação de acesso- SIMULAI",
      html: `<h1> SIMULAI </h1> \n <h3> código para recuperação de acesso: ${code} </h3>`,
      text: `Código de recuperação para senha SIMULAI: ${code}`,
    };

    try {
      const sent = await transporter.sendMail(body);

      if (sent.response.length > 0) {
        return {
          code,
        };
      } else {
        throw new Error("email was not sent");
      }
    } catch (err) {
      throw err;
    }
  }

  async recruitEmail(email) {
    generalValidations.validateEmail(email);
    const timeLimit = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const exists = await AdminRepo.findByEmail(email);

    if (exists) throw new Error("Admin already exists");

    const { qrCodeLink, secret } = await generateTotp(email);

    const adminInfo = {
      email: email,
      role: "Manager",
      secret: secret,
      qrcode: qrCodeLink,
      expiresAt: timeLimit,
    };

    const findInvite = await InviteTokenRepo.findByUser(email);

    if (findInvite) throw new Error("Pending invite.");

    const savedInvite = await InviteTokenRepo.saveToken(adminInfo);

    if (!savedInvite) {
      throw new Error("Invite was not saved");
    }

    // http://localhost:4000/admin/register/:id
    const invitationaLink = `http://localhost:5173${ROUTE}${savedInvite._id}`;

    const body = {
      from: process.env.CLIENT_ID,
      to: email,
      subject: "Bem Vindo a SIMULAI",
      html: `Seja muito bem vindo a equipe de adminstradores da SIMULAI. Clique <a href="${invitationaLink}"> AQUI </a>`,
      text: `Link para cadastro de administrador: ${invitationaLink}`,
    };

    try {
      const sent = await transporter.sendMail(body);

      if (sent.response.length > 0) {
        return {
          invitationaLink,
          id: savedInvite._id,
        };
      }
    } catch (err) {
      throw err;
    }
  }

  async contactEmail(name, email, subject, message) {
    generalValidations.validateName(name);
    generalValidations.validateEmail(email);

    const body = {
      from: process.env.CLIENT_ID,
      to: process.env.CONTACT_ID,
      subject: subject,
      html: `${message}\nEnviado por: ${email}`,
      text: message,
    };

    try {
      const sent = await transporter.sendMail(body);

      if (sent.response.length > 0) {
        return {
          name,
          email,
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
