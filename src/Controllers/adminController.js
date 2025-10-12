import adminService from "../Services/AdminSV.js";
import { sendError, errors } from "../utils/sendError.js";

class adminController {
  async register(req, res) {
    try {
      const newAdmin = await adminService.register(req.body);
      if (newAdmin) {
        return res.status(200).json({
          success: true,
          data: newAdmin,
        });
      }
      return sendError(
        res,
        "failed to register new admin",
        500,
        errors.internal
      );
    } catch (err) {
      return sendError(res, err.message, 500, errors.unexpected);
    }
  }

  async getAllAdmin(req, res) {
    try {
      if (req.admin.role !== "Boss") {
        return sendError(res, "invalid role", 403, errors.unauthorized);
      }

      const admins = await adminService.getAllAdmins();

      if (admins) {
        return res.status(200).json({ success: true, data: admins });
      }
      return sendError(
        res,
        "was not possible to list admins",
        500,
        errors.internal
      );
    } catch (err) {
      return sendError(res, err.message, 500, errors.unexpected);
    }
  }

  async getAllComments(req, res) {
    try {
      const comments = await adminService.getComment(["Help", "Evaluation"]);

      if (comments) {
        return res.status(200).json({ success: true, data: comments });
      }
      return sendError(res, "failed to list comments", 500, errors.internal);
    } catch (err) {
      return sendError(res, err.message, 500, errors.unexpected);
    }
  }

  async getHelpComments(req, res) {
    try {
      const comments = await adminService.getComment("Help");

      if (comments) {
        return res.status(200).json({ success: true, data: comments });
      }
      return sendError(
        res,
        "failed to list help comments",
        500,
        errors.internal
      );
    } catch (err) {
      return sendError(res, err.message, 500, errors.unexpected);
    }
  }

  async getEvaluationComments(req, res) {
    try {
      const comments = await adminService.getComment("Evaluation");

      if (comments) {
        return res.status(200).json({ success: true, data: comments });
      }
      return sendError(res, "not possible to list comments", 404, errors.data);
    } catch (err) {
      return sendError(res, err.message, 500, errors.internal);
    }
  }

  async deleteComment(req, res) {
    try {
      const deleted = await adminService.deleteComment(
        req.params.commentId,
        req.params.userId
      );

      if (deleted) {
        return res.status(200).json({ success: true, data: deleted });
      }
      return sendError(res, "comment not found", 404, errors.data);
    } catch (err) {
      return sendError(res, err.message, 500, errors.internal);
    }
  }

  async commentStatus(req, res) {
    try {
      const comment = await adminService.updateCommentStatus(
        req.params,
        req.body
      );

      if (comment) {
        return res.status(200).json({ success: true, data: comment });
      }
      return sendError(
        res,
        "failed to update comment status",
        400,
        errors.data
      );
    } catch (err) {
      return sendError(res, err.message, 500, errors.internal);
    }
  }

  async deleteAdmin(req, res) {
    try {
      if (req.admin.role !== "Boss") {
        return sendError(res, "unauthorized role", 403, errors.unauthorized);
      }

      const deleted = await adminService.deleteAdmin(req.params.id);

      if (deleted) {
        return res.status(200).json({ success: true, data: deleted });
      }
      return sendError(res, "not possible to delete admin", 404, errors.data);
    } catch (err) {
      return sendError(res, err.message, 500, errors.internal);
    }
  }
}

export default new adminController();
