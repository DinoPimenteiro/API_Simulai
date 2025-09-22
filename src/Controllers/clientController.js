import clientService from "../Services/ClientSV.js";

class clientController {
  async newClient(req, res) {
    try {
      const newUser = await clientService.register(req.body, req.headers['user-agent']);
      if (newUser) {
        res.status(200).json(newUser);
      } else {
        res.status(404).json({ Error: newUser });
      }
    } catch (err) {
      res.status(404).json(err.message);
    }
  }
  async getAll(req, res) {
    try {
      const users = await clientService.selectAll();

      res.status(200).json(users);
    } catch (err) {
      res.status(404).json(err.message);
    }
  }

  async getOne(req, res){
    try{
      const user = await clientService.selectOne(req.params.id);
      res.status(200).json(user);

    } catch(err){
      res.status(404).json(err.message);
    }
  }
  async deleteUser(req, res) {
    try {
      const userDeleted = await clientService.delete(req.params.id);
      res.status(200).json(userDeleted);
    } catch (err) {
      res.status(404).json(err.message);
    }
  }
  async updateUser(req, res) {
    try {
      const userUp = await clientService.edit(req.params.id, req.body);

      if (userUp) {
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
      const comment = await clientService.comment(req.body, req.user);

      if (comment) {
        res.status(200).json(comment);
      }
    } catch (err) {
      res.status(418).json(err.message);
    }
  }

  async getComments(req, res){
    try{
      const comment = await clientService.getAllComments();

      if(comment){
        res.status(200).json(comment);
      } else {
        res.status(400).json({error: "not possible to show comments."})
      }
    } catch(err){
      res.status(500).json(err.message)
    }

    
  }
}

export default new clientController();
