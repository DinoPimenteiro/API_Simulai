import authService from "../Services/AuthSV.js";

class authController {
  async login(req, res) {
    try {
      const { acessToken, rawToken } = await authService.authenticate(
        req.body,
        req.headers["user-agent"]
      );

      // Ajeitar por segurança depois
      if (rawToken) {
        res.cookie("refreshToken", rawToken, {
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
      } else {
        res.json({ Error: "Missing cookie" });
      }

      if (acessToken) {
        res.status(200).json(acessToken, acessToken );
      } else {
        res.status(400).json({ Error: "deu ruim ó doido" });
      }
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
  async refresh(req, res) {
    try {
      const { newRawToken, updatedToken, newAcessToken } = await authService.refresh(req);

      res.cookie("refreshToken", newRawToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      if (updatedToken) {
        res.status(200).json({updatedToken, newAcessToken});
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
        res.status(404).json({error: "Erro ao realizar logout."})
      }
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
}

export default new authController();
