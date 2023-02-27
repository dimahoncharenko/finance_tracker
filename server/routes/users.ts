import { Router } from "express";
import { join } from "path";
import type { UploadedFile } from "express-fileupload";

import {
  isThereTokenAvailable,
  sendError,
  AuthorizationError,
  areCredentialsProvided,
} from "../utils";
import { Users } from "../models/users";

const app = Router();

app.get("/", isThereTokenAvailable, async (req, res) => {
  try {
    const { user } = res.locals;

    const candidate = await Users.findOneBy({
      id: user.id,
    });

    if (!candidate) {
      throw new AuthorizationError(
        "Вибачте, але скоріш всього у Вас невірний токен доступу!"
      );
    }

    const { password, id, ...rest } = candidate;

    return res.json({ ...rest });
  } catch (err) {
    return sendError(err, res);
  }
});

app.patch(
  "/",
  isThereTokenAvailable,
  areCredentialsProvided(["username"]),
  async (req, res) => {
    try {
      const { user } = res.locals;
      const { username } = req.body;

      console.log(user.username);

      const candidate = await Users.findOneBy({
        id: user.id,
      });

      if (!candidate) {
        throw new AuthorizationError(
          "Вибачте, але скоріш всього у Вас невірний токен доступу!"
        );
      }

      if (req.files != null) {
        const file = req.files.file as UploadedFile;
        file.mv(
          join(__dirname, "..", "public", "avatars", file.name),
          (err) => {
            if (err) {
              throw new Error("Аватар не був опублікований! Спробуйте знову!");
            }
          }
        );

        candidate.avatar = `/avatars/${file.name}`;
      }

      candidate.username = username;
      const updatedUser = await candidate.save();

      const { password, ...rest } = updatedUser;

      res.json(rest);
    } catch (err) {
      sendError(err, res);
    }
  }
);

export default app;
