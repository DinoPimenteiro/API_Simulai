import validator from "validator";
import ClientRepo from "../Repositories/ClientRepo.js";
import RefreshTokenRepo from "../Repositories/RfshTokenRepo.js";
import AuthSV from "./AuthSV.js";
import { ComparePass } from "../utils/hashUtils.js";
import { Capitalize } from "../utils/stringUtils.js";
import { ValidLevel, validComment } from "../utils/userValidator.js";
import GeneralValidations from "../utils/generalValidations.js";
import { HandleProfileImage } from "../utils/profileImage.js";

class clientService {
  async register(req) {
    let { name, email, password, age } = req.body;
    let passwordHash;

    age = parseInt(age, 10);
    name = validator.trim(Capitalize(name));

    try {
      const exists = await ClientRepo.findEmail(email);

      if (exists) {
        throw new Error(`The user already exists.`);
      }

      const profileImagePath = await HandleProfileImage(req);

      //Consultar docs
      passwordHash = await GeneralValidations.validatePassword(password);

      GeneralValidations.validateEmail(email);

      GeneralValidations.validateName(name);

      GeneralValidations.validateAge(age);

      const client = await ClientRepo.save({
        profileImage: profileImagePath,
        name,
        email,
        age,
        passwordHash,
      });

      const { acessToken } = await AuthSV.authenticate(
        {
          password: password,
          email: email,
        },
        req.headers["user-agent"]
      );

      return {
        id: client._id,
        profileImage: profileImagePath,
        name: client.name,
        email: client.email,
        age: client.age,
        acessToken,
      };
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async selectAll() {
    try {
      const users = await ClientRepo.findAll();

      const treatedUsers = users.map((user) => {
        let objct = {};

        for (let key in user) {
          if (key === "passwordHash") continue;
          objct[key] = user[key];
        }
        return objct;
      });

      return treatedUsers;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async selectOne(id) {
    try {
      const user = await ClientRepo.findID(id);

      GeneralValidations.validateUser(user);

      return {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        level: user.level,
        job: user.job,
        comments: user.comment,
      };
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async delete(id) {
    try {
      let user = await ClientRepo.findID(id);

      GeneralValidations.validateUser(user);

      const userSessions = await RefreshTokenRepo.destroyManyTokens(id);
      const deleted = await ClientRepo.destroy(id);

      return {
        userDeleted: deleted,
        DeletedSessions: userSessions,
      };
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async edit(id, data) {
    try {
      var { name, email, age, password, level, job } = data;

      const user = await ClientRepo.findEmail(email);

      GeneralValidations.validateUser(user);

      var pass = ComparePass(password, user.passwordHash);

      if (!pass) {
        throw new Error("Invalid password.");
      }

      var job = validator.trim(job);
      var level = validator.trim(level);
      var name = validator.trim(name);
      var age = parseInt(age, 10);

      GeneralValidations.validateName(name);

      if (job === "" || !job) {
        throw new Error("Invalid job.");
      }

      if (level === "" || !level) {
        throw new Error("Invalid level.");
      }

      if (!ValidLevel(level)) {
        throw new Error("Invalid level.");
      }

      GeneralValidations.validateAge(age);

      const passwordHash = await GeneralValidations.validatePassword(password);

      const edited = await ClientRepo.update(id, {
        name,
        age,
        passwordHash,
        job,
        level,
      });

      return {
        id: edited._id,
        name: edited.name,
        age: edited.age,
        job: edited.job,
        level: edited.level,
      };
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async comment(data, user) {
    //Precisa de autenticação de cadastro
    try {
      let { type, body, rating, title } = data;
      let id = user;

      const client = await ClientRepo.findID(id);

      if (!client) {
        throw new Error("User not found.");
      }

      if (parseInt(rating, 10) > 5) {
        throw new Error("Exceeded rating.");
      }

      if (!validator.trim(body)) {
        throw new Error("Invalid comment.");
      }

      if (!validator.trim(title)) {
        throw new Error("Invalid title.");
      }

      if (!validComment(type)) {
        throw new Error("Invalid comment type.");
      }

      const userComment = await ClientRepo.saveComment(client, {
        title,
        body,
        rating,
        type,
        createdAt: new Date().toLocaleDateString(),
      });

      if (userComment) {
        const saved = await client.save();

        return {
          id: saved._id,
          name: saved.name,
          email: saved.email,
          comments: saved.comment,
        };
      } else {
        throw new Error("Not possible to save comment.");
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async deleteComment(userId, commentId){
    try{
      const clientId = userId;
      const comment = commentId;

      const deletedComment = await ClientRepo.deleteComment(clientId, comment);

      if(deletedComment){
        return deletedComment; 
      } else {
        throw new Error("Not possible to delete.")
      }

    } catch (err){
      throw err;
    }
  }

  // Pesquisa para agregar/completar o cadastro do usuário;
  async research(data) {}
}

export default new clientService();
