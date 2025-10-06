import adminService from "../Services/AdminSV.js";

class adminController {
  async register(req, res) {
    try {
      const newAdmin = await adminService.register(req);
      if (newAdmin) {
        res.status(200).json(newAdmin);
      } else {
        res.status(404).json({ error: "Was not possible to register." });
      }
    } catch (err) {
      res.status(500).json(err.message);
    }
  }

  async getAllAdmin(req, res) {
    try {
      if (req.admin.role !== "Boss") {
        res.status(400).json({ message: "Unauthorized." });
      }

      const admins = await adminService.getAllAdmins();

      if (admins) {
        res.status(200).json(admins);
      } else {
        res.status(400).json({error: "Something it's not right"});
      }
    } catch (err) {
      res.status(500).json(err.message);
    }
  }

  async getAllComments(req, res) {
    try {
      const comments = await adminService.getComment(["Help", "Evaluation"]);

      if (comments) {
        res.status(200).json(comments);
      } else {
        res.status(404).json({ error: "not possible to list comments." });
      }
    } catch (err) {
      res.status(500).json(err.message);
    }
  }

  async getHelpComments(req, res) {
    try {
      const comments = await adminService.getComment("Help");

      if (comments) {
        res.status(200).json(comments);
      } else {
        res.status(404).json({ error: "not possible to list comments." });
      }
    } catch (err) {
      res.status(500).json(err.message);
    }
  }

  async getEvaluationComments(req, res) {
    try {
      const comments = await adminService.getComment("Evaluation");

      if (comments) {
        res.status(200).json(comments);
      } else {
        res.status(404).json({ error: "not possible to list comments." });
      }
    } catch (err) {
      res.status(500).json(err.message);
    }
  }

  async deleteComment(req, res) {
    try {
      const deleted = await adminService.deleteComment(
        req.params.commentId,
        req.params.userId
      );

      if (deleted) {
        res.status(200).json(deleted);
      } else {
        res.status(404).json({ error: "erro controller" });
      }
    } catch (err) {
      res.status(500).json(err.message);
    }
  }

  async commentStatus(req, res) {
    try {
      const comment = await adminService.updateCommentStatus(
        req.params,
        req.body
      );

      if (comment) {
        res.status(200).json(comment);
      } else {
        res.status(418).json({ error: "Algo deu Errado!" });
      }
    } catch (err) {
      res.status(500).json(err.message);
    }
  }

  async deleteAdmin(req, res) {
    try {
      if (req.admin.role !== "Boss") {
        res.status(400).json({ message: "Unauthorized." });
      }

      const deleted = await adminService.deleteAdmin(req.params.id);

      if (deleted) {
        res.status(200).json(deleted);
      } else {
        res.status(404).json({ error: "Not possible to delete." });
      }
    } catch (err) {
      res.status(500).json(err.message);
    }
  }
}

export default new adminController();
