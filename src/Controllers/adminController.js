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
  async getCommentsHelp(req, res) {
    try {
      const comments = await adminService.getHelpComment();

      if (comments) {
        res.status(200).json(comments);
      } else {
        res.status(404).json({ error: "not possible to list comments." });
      }
    } catch (err) {
      res.status(500).json(err.message);
    }
  }

  async getCommentsEvaluation(req, res) {
    try {
      const comments = await adminService.getEvaluationComment();

      if (comments) {
        res.status(200).json(comments);
      } else {
        res.status(404).json({ error: "not possible to list comments." });
      }
    } catch (err) {
      res.status(500).json(err.message);
    }
  }

  async deleteComment(req, res){
    try{
    const deleted = await adminService.deleteComment(req.params.commentId, req.params.userId);
    
    if(deleted){
      res.status(200).json(deleted);
    } else { 
      res.status(404).json({error: "erro controller"})
    }
    } catch (err){
      res.status(500).json(err.message)
    }
  }
}

export default new adminController();
