import "reflect-metadata";
import express from "express";
import fileUpload from "express-fileupload";
import { config } from "dotenv";
import cors from "cors";
import { DataSource } from "typeorm";

import transactionAPI from "./routes/transaction";
import authAPI from "./routes/auth";
import userAPI from "./routes/users";

import { Transactions } from "./models/transactions";
import { Users } from "./models/users";

// Configures environmental variables
config();

const PORT = process.env.PORT || 5000;
const app = express();

(async () => {
  try {
    const db = new DataSource({
      type: "postgres",
      host: process.env.AMAZON_DB_HOST,
      port: Number(process.env.AMAZON_DB_PORT),
      database: process.env.AMAZON_DB_NAME,
      password: process.env.AMAZON_DB_PASS,
      username: process.env.AMAZON_DB_USERNAME,
      entities: [Transactions, Users],
      logging: false,
      synchronize: true,
    });

    await db.initialize();

    console.log(`Connected to DB! (${db})`);

    app.use(cors());
    app.use(fileUpload());
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.use(express.static("public"));
    app.use("/api/transaction", transactionAPI);
    app.use("/api/auth", authAPI);
    app.use("/api/user", userAPI);

    app.listen(PORT, () => console.log(`Server has rushed on port: ${PORT}.`));
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      process.exit(1);
    }
  }
})();
