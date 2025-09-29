import adminService from "../Services/AdminSV.js";

class adminController {
  async register(req, res) {
    try {
      const newAdmin = await adminService.register(req);
      if (newAdmin) {
        res.status(200).json(newAdmin);
      } else {
        res.status(404).json({error: "Was not possible to register."});
      }
    } catch (err) {
      res.status(500).json(err.message);
    }
  }
}

export default new adminController();