import validator from "validator";
import ClientRepo from "../Repositories/ClientRepo.js";
import RefreshTokenRepo from "../Repositories/RfshTokenRepo.js";
import ClientAuthService from "./Auth/ClientAuthService.js";
import { Capitalize } from "../utils/stringUtils.js";
import { ValidLevel, validComment } from "../utils/userValidator.js";
import GeneralValidations from "../utils/generalValidations.js";
import fs from "fs";

class clientService {
  async register(data, profileFile, curriculumFile, headers) {
    const profileImagePath = profileFile;
    const curriculumPath = curriculumFile;

    let { name, email, password, age } = data;
    let passwordHash;

    age = parseInt(age, 10);
    name = validator.trim(Capitalize(name));
    email = email.trim();

    try {
      const exists = await ClientRepo.findEmail(email);

      if (exists) throw new Error(`The user already exists.`);

      //Consultar docs
      passwordHash = await GeneralValidations.validatePassword(password);
      GeneralValidations.validateEmail(email);
      GeneralValidations.validateName(name);
      GeneralValidations.validateAge(age);

      const client = await ClientRepo.save({
        profileImage: profileImagePath,
        resume: curriculumPath,
        name,
        email,
        age,
        passwordHash,
      });

      console.log(client); // veja o objeto inteiro
      console.log(client._id); // deve existir
      console.log(client.id);

      const acessCredentials = await ClientAuthService.clientLogin(
        client._id,
        headers
      );

      return {
        profileImage: profileImagePath,
        resume: curriculumPath,
        id: client._id,
        name: client.name,
        email: client.email,
        age: client.age,
        acessCredentials,
      };
    } catch (err) {
      if (profileImagePath && fs.existsSync(profileImagePath)) {
        await fs.promises.unlink(profileImagePath);
      }

      if (curriculumPath && fs.existsSync(curriculumPath)) {
        await fs.promises.unlink(curriculumPath);
      }
      throw err;
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
      throw err;
    }
  }

  async selectOne(id) {
    try {
      const user = await ClientRepo.findID(id);

      GeneralValidations.validateUser(user);

      return {
        id: user._id,
        profileImage: user.profileImage,
        curriculum: user.resume,
        name: user.name,
        email: user.email,
        age: user.age,
        level: user.level,
        job: user.job,
        comments: user.comment,
      };
    } catch (err) {
      throw err;
    }
  }

  async delete(id) {
    let user = await ClientRepo.findID(id);
    GeneralValidations.validateUser(user);

    try {
      if (fs.existsSync(user.profileImage)) {
        await fs.promises.unlink(user.profileImage);
      }

      if (fs.existsSync(user.resume)) {
        await fs.promises.unlink(user.resume);
      }

      const userSessions = await RefreshTokenRepo.destroyManyTokens(id);
      const deleted = await ClientRepo.destroy(id);

      if (deleted) {
        return {
          userDeleted: deleted,
          DeletedSessions: userSessions,
        };
      }
    } catch (err) {
      throw err;
    }
  }

  async edit(id, data, profileFile, curriculumFile) {
    let profileImagePath = profileFile;
    let curriculumPath = curriculumFile;
    const client = await ClientRepo.findID(id);

    let invalidName;
    let invalidAge;

    GeneralValidations.validateUser(client);

    try {
      if (!profileImagePath) {
        profileImagePath = client.profileImage;
      } else {
        await fs.promises.unlink(profileFile);
      }

      if (!curriculumPath) {
        curriculumPath = client.resume;
      } else {
        await fs.promises.unlink(curriculumFile);
      }

      var { name, age, level, job } = data;

      var job = validator.trim(job);
      var level = validator.trim(level);
      var name = validator.trim(name);
      var age = parseInt(age, 10);

      invalidName = typeof name === "string" || age === "";
      invalidAge = typeof age === "number";

      if (!invalidName) {
        name = client.name.toString();
      }

      if (!invalidAge) {
        age = parseInt(client.age);
      }

      GeneralValidations.validateName(job, "Invalid job");

      if (!ValidLevel(level)) throw new Error("Invalid level.");

      const edited = await ClientRepo.update(id, {
        profileImage: profileImagePath,
        resume: curriculumPath,
        name,
        age,
        job,
        level,
      });

      await edited.save();

      return {
        profileImagePath: edited.profileImage,
        resume: edited.resume,
        id: edited._id,
        name: edited.name,
        age: edited.age,
        job: edited.job,
        level: edited.level,
      };

    } catch (err) {
      if (profileFile && fs.existsSync(profileFile)) {
        await fs.promises.unlink(profileFile);
      }
      if (curriculumFile && fs.existsSync(curriculumFile)) {
        await fs.promises.unlink(curriculumFile);
      }
      throw err;
    }
  }

  async comment(data, user) {
    //Precisa de autenticação de cadastro
    try {
      let { type, body, rating, title } = data;
      let id = user;

      if (!id) throw new Error("Invalid id");

      const client = await ClientRepo.findID(id);

      GeneralValidations.validateUser(client);

      if (parseInt(rating, 10) > 5) {
        throw new Error("Exceeded rating.");
      }

      GeneralValidations.validateName(body, "Invalid comment");
      GeneralValidations.validateName(title, "Invalid title");

      if (!validComment(type)) {
        throw new Error("Invalid comment type.");
      }

      const userComment = await ClientRepo.saveComment(client, {
        title,
        body,
        rating,
        type,
        createdAt: Date.now()
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
      throw err;
    }
  }

  async deleteComment(userId, commentId) {
    try {
      const clientId = userId;
      const comment = commentId;

      if (!clientId || !comment) {
        throw new Error("Invalid parameters");
      }

      const deletedComment = await ClientRepo.deleteComment(clientId, comment);

      if (deletedComment) {
        return deletedComment;
      } else {
        throw new Error("Not possible to delete.");
      }
    } catch (err) {
      throw err;
    }
  }

  async clientsStatistics() {
    try {
      const avgRate = await ClientRepo.averageRating();
      const avgAge = await ClientRepo.averageAge();
      const juvenil = await ClientRepo.ageFilter(14, 18);
      const adults = await ClientRepo.ageFilter(18, 24);
      const seniors = await ClientRepo.ageFilter(24, 30);

      return {
        media: {
          rate: avgRate,
          age: avgAge,
        },
        age_distribution: {
          juvenil: juvenil,
          adults: adults,
          seniors: seniors,
        },
      };
    } catch (err) {
      throw err;
    }
  }
}

export default new clientService();
