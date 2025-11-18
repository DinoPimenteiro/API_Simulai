import AuthService from "../Services/Auth/BaseAuthService.js";
import TokenAuthService from "../Services/Auth/TokenAuthService.js";
import AdminAuthService from "../Services/Auth/AdminAuthService.js";
import MailAuthService from "../Services/Auth/MailAuthService.js";
import { sendError, errors } from "../utils/sendError.js";
import getToken from "../utils/getToken.js";
import ClientAuthService from "../Services/Auth/ClientAuthService.js";

class authController {
  async login(req, res) {
    try {
      const data = await AuthService.authenticate(
        req.body,
        req.headers["x-client-agent"]
      );

      console.log(data);
      if (data.message) {
        return res.status(200).json({ message: data.message });
      }

      if (data.rawToken) {
        res.cookie("refreshToken", data.rawToken, {
          maxAge: 7 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          path: "/", // essencial para consistência e limpeza posterior
        });
      } else {
        return sendError(res, "missing token", 400, errors.auth);
      }

      if (data.updatedToken) {
        return res.status(200).json({ success: true, data: data });
      }

      if (data.acessToken) {
        return res.status(200).json({ success: true, data: data });
      }

      return sendError(res, "invalid credentials", 401, errors.auth);
    } catch (err) {
      return sendError(res, err.message, 500, errors.unexpected);
    }
  }

  async loginAdmin(req, res) {
    try {
      const { acessToken, rawToken } = await AdminAuthService.validateAdminCode(
        req.params.id,
        req.body,
        req.headers["x-client-agent"]
      );

      if (rawToken) {
        res.cookie("refreshToken", rawToken, {
          maxAge: 7 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });
      } else {
        return sendError(res, "missing token", 400, errors.auth);
      }

      if (acessToken) {
        return res
          .status(200)
          .json({ success: true, data: { acessToken, rawToken } });
      }
      return sendError(res, "invalid admin credentials", 401, errors.auth);
    } catch (err) {
      return sendError(res, err.message, 500, errors.internal);
    }
  }

  async loginClient(req, res) {
    try {
      const { acessToken, rawToken } = await ClientAuthService.clientLogin(
        req.params.id,
        req.headers["x-client-agent"],
        req.body.password
      );

      if (rawToken) {
        res.cookie("refreshToken", rawToken, {
          maxAge: 7 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });
      } else {
        return sendError(res, "missing token", 400, errors.auth);
      }

      if (acessToken) {
        res.status(200).json({ data: { acessToken, rawToken } });
      }
    } catch (err) {
      return sendError(res, err.message, 500, errors.internal);
    }
  }

  async refresh(req, res) {
    try {
      const acessCredentials = await TokenAuthService.refresh(
        req.headers["x-client-agent"],
        getToken(req)
      );

      const { rawToken, updatedToken } = acessCredentials;

      if (rawToken) {
        res.cookie("refreshToken", rawToken, {
          maxAge: updatedToken.expiresAt,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });
        return res.status(200).json({
          success: true,
          data: acessCredentials,
        });
      }
      return sendError(res, "failed to refresh token", 400, errors.auth);
    } catch (err) {
      return sendError(res, err.message, 500, errors.unexpected);
    }
  }

  async logout(req, res) {
    try {
      const destroyedSession = await AuthService.logout(getToken(req));

      if (destroyedSession) {
        res.clearCookie("refreshToken", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });
        return res.status(200).json({
          success: true,
          message: "session successfully terminated",
          destroyedSession,
        });
      }
      return sendError(res, "failed to logout", 400, errors.auth);
    } catch (err) {
      return sendError(res, err.message, 500, errors.internal);
    }
  }

  async recoverMail(req, res) {
    try {
      const { refreshTk, rawToken } = await MailAuthService.recoveryMail(
        req.body,
        req.headers["x-client-agent"]
      );

      if (refreshTk) {
        res.cookie("refreshToken", rawToken, {
          maxAge: 8 * 60 * 1000, // 8 minutos
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          path: "/", // essencial para consistência e limpeza posterior
        });

        return res.status(200).json({
          success: true,
          data: refreshTk,
          message: `E-mail enviado de recuperação enviado para ${refreshTk.userEmail}`,
        });
      }
      return sendError(res, "failed to send recovery email", 400, errors.email);
    } catch (err) {
      return sendError(res, err.message, 500, errors.internal);
    }
  }

  async validCodeMail(req, res) {
    try {
      const token = await AuthService.verifyCode(req.body, getToken(req));

      if (token) {
        return res.status(200).json({ success: true, data: token });
      }

      return sendError(res, "access token not found", 404, errors.auth);
    } catch (err) {
      return sendError(res, err.message, 500, errors.internal);
    }
  }

  async resetPass(req, res) {
    try {
      if (req.params.id === req.user.id) {
        const newPass = await AuthService.resetPassword(req.body, req.params);
        if (newPass) {
          return res.status(200).json({ success: true, data: newPass });
        } else {
          return sendError(res, "failed to reset password", 400, errors.auth);
        }
      } else {
        return sendError(res, "unauthorized access", 401, errors.unauthorized);
      }
    } catch (err) {
      return sendError(res, err.message, 500, errors.internal);
    }
  }

  async recruitMail(req, res) {
    try {
      const { invitationaLink, id } = await MailAuthService.sendRecruitEmail(
        req.body,
        getToken(req)
      );

      if (invitationaLink) {
        return res
          .status(200)
          .json({ success: true, data: { invitationaLink, id } });
      }
      return sendError(
        res,
        "failed to send recruitment email",
        400,
        errors.email
      );
    } catch (err) {
      return sendError(res, err.message, 500, errors.internal);
    }
  }

  async registerAdmin(req, res) {
    try {
      const newManager = await AdminAuthService.authenticateAdmin(
        req.params,
        req.headers["x-client-agent"],
        req.body
      );

      if (newManager) {
        return res.status(200).json({ success: true, data: { newManager } });
      }
      return sendError(res, "failed to register admin", 400, errors.data);
    } catch (err) {
      return sendError(res, err.message, 500, errors.internal);
    }
  }

  async validateInvite(req, res) {
    try {
      const info = await AdminAuthService.validateInvite(req.params);

      if (info) {
        return res.status(200).json({ success: true, data: info });
      }
      return sendError(res, "unable to retrieve invite info", 400, errors.data);
    } catch (err) {
      return sendError(res, err.message, 500, errors.internal);
    }
  }
}

export default new authController();
