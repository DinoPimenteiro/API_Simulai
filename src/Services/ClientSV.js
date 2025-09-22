import ClientRepo from "../Repositories/ClientRepo.js";
import RefreshTokenRepo from "../Repositories/RfshTokenRepo.js";
import validator from "validator";
import { PassHash, ComparePass } from "../utils/hashUtils.js";
import { Capitalize } from "../utils/stringUtils.js";
import { ValidLevel, validComment } from "../utils/userValidator.js";
import { validateAge, validateEmail, validateName, validatePassword, validateUser } from "../utils/generalValidations.js";

class clientService {
  async register(data) {
    var { name, email, password, age } = data;
    var passwordHash;

    age = parseInt(age, 10);
    name = validator.trim(Capitalize(name));

    try {
      const exists = await ClientRepo.findEmail(email);

      if (exists) {
        throw new Error(`The user already exists.`);
      }

      //Consultar docs
      if (validator.isStrongPassword(password)) {
        passwordHash = await PassHash(password);
      } else {
        throw new Error("Weak password.");
      }

      validateEmail(email)

      validateName(name)

      validateAge(age)

      const client = await ClientRepo.save({ name, email, age, passwordHash });

      return {
        id: client._id,
        name: client.name,
        email: client.email,
        age: client.age,
      };
    } catch (err) {
      throw new Error(`error: ${err.message}`);
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

      validateUser(user)

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

      validateUser(user)

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

      validateUser(user)

      var pass = ComparePass(password, user.passwordHash);

      if (!pass) {
        throw new Error("Invalid password.");
      }

      var job = validator.trim(job);
      var level = validator.trim(level);
      var name = validator.trim(name);
      var age = parseInt(age, 10);

      validateName(name)

      if (job === "" || !job) {
        throw new Error("Invalid job.");
      }

      if (level === "" || !level) {
        throw new Error("Invalid level.");
      }

      if (!ValidLevel(level)) {
        throw new Error("Invalid level.");
      }

      validateAge(age)

      validatePassword(password)

      const passwordHash = await PassHash(password, 13);

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
      var { id } = user;
      var { type, body, rating, title } = data;

      const exists = ClientRepo.findID(id);

      if (!exists) {
        throw new Error("");
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
        throw new Error("");
      }

      const userComment = await ClientRepo.save({
        comment: { body, title, rating, type },
      });
      return {
        name: userComment.name,
        email: userComment.email,
        comments: userComment.comment,
      };
    } catch (err) {
      throw new Error(err.message);
    }
  }

  // Pesquisa para agregar/completar o cadastro do usuário;
  async research(req) { 
  }
}

export default new clientService();
