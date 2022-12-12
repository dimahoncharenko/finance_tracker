import { Router } from "express";
import { sign } from "jsonwebtoken";
import { AES, enc } from "crypto-js";

import { Users } from "../models/users";
import {
  sendError,
  RegisterError,
  CredentialsError,
  areCredentialsProvided,
  isThereTokenAvailable,
} from "../utils";

const app = Router();

app.post(
  "/register",
  areCredentialsProvided(["username", "password"]),
  async (req, res) => {
    try {
      const { username, password } = req.body;

      const candidate = await Users.findOneBy({ username });

      if (candidate) {
        throw new RegisterError("Користувач з таким ім'ям вже існує!");
      }

      if (password.trim().length < 8) {
        throw new CredentialsError(
          "Пароль закороткий! Замініть його на інший."
        );
      }

      const hashedPassword = AES.encrypt(password, process.env.CRYPTO_KEY!);

      const newUser = Users.create({
        username,
        password: hashedPassword.toString(),
        avatar: "/avatars/guest_logo.png",
      });

      await newUser.save();

      res.json(true);
    } catch (err) {
      sendError(err, res);
    }
  }
);

app.post(
  "/login",
  areCredentialsProvided(["username", "password"]),
  async (req, res) => {
    try {
      const { username, password } = req.body;

      const candidate = await Users.findOneBy({ username });

      if (!candidate) {
        throw new RegisterError("Немає користувача з таким ім'ям!");
      }

      const decryptedPassword = AES.decrypt(
        candidate.password,
        process.env.CRYPTO_KEY!
      );

      if (decryptedPassword.toString(enc.Utf8) !== password) {
        throw new CredentialsError("Невірний пароль!");
      }

      const token = sign(
        {
          id: candidate.id,
          username: candidate.username,
          avatar: candidate.avatar,
        },
        process.env.JSON_WEB_TOKEN_SECRET!,
        {
          expiresIn: "1d",
        }
      );

      res.json({ token });
    } catch (err) {
      sendError(err, res);
    }
  }
);

app.get("/restore", isThereTokenAvailable, async (req, res) => {
  const user = await Users.findOneBy({
    id: res.locals.user.id,
  });

  return res.json(user);
});

export default app;
