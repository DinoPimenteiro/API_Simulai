import clientService from "../Services/ClientSV.js";
import mailService from "../Services/MailSV.js";
import { sendError, errors } from "../utils/sendError.js";
import fs from "fs";

class clientController {
  async newClient(req, res) {
    try {
      const { profilePath, resumePath } = req.savedFiles || {
        profilePath: null,
        resumePath: null,
      };

      const newUser = await clientService.register(
        req.body,
        profilePath,
        resumePath,
        req.headers["x-client-agent"]
      );

      const rawToken = newUser.acessCredentials;

      if (rawToken) {
        res.cookie("refreshToken", rawToken.rawToken, {
          maxAge: 7 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });
      } else {
        return sendError(res, "missing token", 400, errors.auth);
      }

      if (newUser) {
        res.status(200).json({ success: true, data: newUser });
      } else {
        sendError(res, "failed to create user", 400, errors.data);
      }
    } catch (err) {
      console.log(err.message);
      sendError(res, err.message, 500, errors.internal);
    }
  }

  async getAll(req, res) {
    try {
      const users = await clientService.selectAll();

      if (users) {
        res.status(200).json({ success: true, data: users });
      } else {
        sendError(res, "no users found", 404);
      }
    } catch (err) {
      sendError(res, err.message, 500, errors.internal);
    }
  }

  async getOne(req, res) {
    try {
      if (req.user.id === req.params.id) {
        const user = await clientService.selectOne(req.params.id);
        res.status(200).json({ success: true, data: user });
      } else {
        return sendError(res, "unauthorized access", 401, errors.unauthorized);
      }
    } catch (err) {
      return sendError(res, err.message, 500, errors.internal);
    }
  }

  async deleteUser(req, res) {
    try {
      if (req.user.id === req.params.id) {
        const userDeleted = await clientService.delete(req.params.id);
        res.status(200).json({ success: true, data: userDeleted });
      } else {
        sendError(res, "unauthorized request", 401, errors.unauthorized);
      }
    } catch (err) {
      sendError(res, err.message, 500, errors.internal);
    }
  }

  async updateUser(req, res) {
    try {
      const { profilePath, resumePath } = req.savedFiles;

      if (req.user.id === req.params.id) {
        const userUpdated = await clientService.edit(
          req.params.id,
          req.body,
          profilePath,
          resumePath
        );
        res.status(200).json({ success: true, data: userUpdated });
      } else {
        if (fs.existsSync(profilePath)) {
          await fs.promises.unlink(profilePath);
        }

        if (fs.existsSync(resumePath)) {
          await fs.promises.unlink(resumePath);
        }

        sendError(
          res,
          "not allowed to edit this user",
          401,
          errors.unauthorized
        );
      }
    } catch (err) {
      console.error(err.message);
      sendError(res, err.message, 500, errors.internal);
    }
  }

  async comment(req, res) {
    try {
      if (req.user.id === req.params.id) {
        const comment = await clientService.comment(req.body, req.params.id);

        if (comment) {
          res.status(200).json({ success: true, data: comment });
        } else {
          sendError(res, "failed to create comment", 400, errors.data);
        }
      } else {
        sendError(
          res,
          "unauthorized comment request",
          401,
          errors.unauthorized
        );
      }
    } catch (err) {
      sendError(res, err.message, 500, errors.internal);
    }
  }

  async deleteComment(req, res) {
    try {
      if (req.params.userId === req.user.id) {
        const excludedComment = await clientService.deleteComment(
          req.params.userId,
          req.params.commentId
        );

        if (excludedComment) {
          res.status(200).json({ success: true, data: excludedComment });
        } else {
          sendError(res, "failed to delete comment", 400, errors.data);
        }
      } else {
        sendError(
          res,
          "unauthorized deletion request",
          401,
          errors.unauthorized
        );
      }
    } catch (err) {
      sendError(res, err.message, 500, errors.internal);
    }
  }

  async contactMail(req, res) {
    try {
      const { completeName, subject, message, email } = req.body;
      const { name } = await mailService.contactEmail(
        completeName,
        email,
        subject,
        message
      );

      res.status(200).json({
        success: true,
        message: `thank you for your feedback, ${name}!`,
        email,
      });
    } catch (err) {
      sendError(res, err.message, 500, errors.email);
    }
  }

  async clientsMetrics(req, res) {
    try {
      const data = await clientService.clientsStatistics();

      if (data) {
        res.status(200).json({ success: true, data: data });
      } else {
        sendError(res, "no metrics found", 404);
      }
    } catch (err) {
      sendError(res, err.message);
    }
  }
}

export default new clientController();
