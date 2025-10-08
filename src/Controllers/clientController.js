import clientService from "../Services/ClientSV.js";

class clientController {
  async newClient(req, res) {
    try {
      const newUser = await clientService.register(req);
      if (newUser) {
        res.status(200).json(newUser);
      } else {
        res.status(404).json({ Error: newUser });
      }
    } catch (err) {
      res.status(404).json(err.message);
    }
  }

  // Rota para testes
  async getAll(req, res) {
    try {
      const users = await clientService.selectAll();

      res.status(200).json(users);
    } catch (err) {
      res.status(404).json(err.message);
    }
  }

  async getOne(req, res) {
    try {
      if (req.user.id === req.params.id) {
        const user = await clientService.selectOne(req.params.id);
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: "Bad request." });
      }
    } catch (err) {
      res.status(404).json(err.message);
    }
  }
  async deleteUser(req, res) {
    try {
      if (req.user.id === req.params.id) {
        const userDeleted = await clientService.delete(req.params.id);
        res.status(200).json(userDeleted);
      } else {
        res.status(404).json({ error: "Bad request." });
      }
    } catch (err) {
      res.status(404).json(err.message);
    }
  }
  async updateUser(req, res) {
    try {
      if (req.user.id === req.params.id) {
        const userUp = await clientService.edit(req.params.id, req.body);
        res.status(200).json(userUp);
      } else {
        res.status(404).json({ error: "not possible to edit." });
      }
    } catch (err) {
      res.status(404).json(err.message);
    }
  }
  async comment(req, res) {
    try {
      if (req.user.id === req.params.id) {
        const comment = await clientService.comment(req.body, req.params.id);

        if (comment) {
          res.status(200).json(comment);
        }
      } else {
        res.status(404).json({ error: "aaaaaa" });
      }
    } catch (err) {
      res.status(418).json(err.message);
    }
  }
  async deleteComment(req, res) {
    try {
      if (req.params.userId === req.user.id) {
        const excludedComment = await clientService.deleteComment(
          req.params.userId,
          req.params.commentId
        );
        res.status(200).json(excludedComment);
      } else {
        res.status(418).json({ error: "deu ruim" });
      }
    } catch (err) {
      res.status(500).json(err.message);
    }
  }
}

export default new clientController();
