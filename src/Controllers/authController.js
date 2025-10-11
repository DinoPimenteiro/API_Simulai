import authService from "../Services/AuthSV.js";

class authController {
  async login(req, res) {
    try {
      const { acessToken, rawToken, message } = await authService.login(
        req.body,
        req.headers["user-agent"]
      );

      if (message) {
        res.status(300).json(message);
      }
      // Ajeitar por segurança depois
      if (rawToken && !message) {
        res.cookie("refreshToken", rawToken, {
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
      } else {
        res.json({ Error: "Missing token" });
      }

      if (acessToken) {
        res.status(200).json(acessToken, acessToken);
      } else {
        res.status(400).json({ Error: "deu ruim ó doido" });
      }
    } catch (err) {
      res.status(400).json({message: err.message});
    }
  }
  
  async loginAdmin(req, res) {
    try {
      const { acessToken, rawToken } = await authService.validateAdminCode(
        req.params.id,
        req.body,
        req.headers["user-agent"]
      );

      if (rawToken) {
        res.cookie("refreshToken", rawToken, {
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
      } else {
        res.json({ Error: "Missing token" });
      }

      if (acessToken) {
        res.status(200).json(acessToken, rawToken);
      } else {
        res.status(404).json({ error: "Invalid Data." });
      }
    } catch (err) {
      res.status(500).json({error: err.message});
    }
  }
  async refresh(req, res) {
    try {
      const { newRawToken, updatedToken, newAcessToken } =
        await authService.refresh(req);

      res.cookie("refreshToken", newRawToken, {
        maxAge: updatedToken.expiresAt
      });

      if (updatedToken) {
        res.status(200).json({ updatedToken, newAcessToken });
      } else {
        res.status(418).json({ error: "deu ruim no refresh" });
      }
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
  async logout(req, res) {
    try {
      const destroyedSession = authService.logout(req);

      if (destroyedSession) {
        res.status(200).json({ success: "Sucesso ao encerrar sessão." });
      } else {
        res.status(404).json({ error: "Erro ao realizar logout." });
      }
    } catch (err) {
      res.status(400).json(err.message);
    }
  }

  async recoverMail(req, res) {
    try {
      const { refreshTk, newRawToken } = await authService.recoveryMail(req);

      if (refreshTk) {
        res.cookie("refreshToken", newRawToken, {
          maxAge: 8 * 60 * 1000,
        });

        res.status(200).json(refreshTk);
      } else {
        //Alterar para um mensagem genérica
        res.status(400).json({ error: "failed to send email" });
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async validCodeMail(req, res) {
    try {
      const acessTk = await authService.verifyCode(req);

      if (acessTk) {
        res.status(200).json(acessTk);
      } else {
        res.status(418).json({ error: "acess token was not found." });
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async resetPass(req, res) {
    try {
      const confirm = await authService.resetPassword(req);

      if (confirm) {
        res.status(200).json(confirm);
      } else {
        res.status(500).json({ error: "fudeu" });
      }
    } catch (err) {
      res.status(410).json(err.message);
    }
  }
  async recruitMail(req, res) {
    try {
      const { invitationaLink } = await authService.sendRecruitEmail(req);

      if (invitationaLink) {
        res.status(200).json(invitationaLink);
      } else {
        res.status(418).json({ error: "DESGRAÇA" });
      }
    } catch (err) {
      res.status(500).json(err.message);
    }
  }

  async registerAdmin(req, res) {
    try {
      const newManager = await authService.authenticateAdmin(req);

      if (newManager) {
        res.status(200).json(newManager);
      } else {
        res.status(400).json({ error: "Erro no registro" });
      }
    } catch (err) {
      res.status(500).json(err.message);
    }
  }

  async validateInvite(req, res) {
    try {
      const info = await authService.validateInvite(req);

      if (info) {
        res.status(200).json(info);
      } else {
        res
          .status(400)
          .json({ error: "Não foi possível requisitar as informações." });
      }
    } catch (err) {
      res.status(500).json(err.message);
    }
  }
}

export default new authController();
