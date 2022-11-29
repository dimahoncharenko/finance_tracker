import "reflect-metadata";
import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { DataSource } from "typeorm";

import transactionAPI from "./routes/transaction";
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
      port: Number(process.env.PG_PORT),
      database: process.env.PG_DB,
      password: process.env.PG_PASS,
      username: process.env.PG_USER,
      entities: [Transactions, Users],
      logging: false,
      synchronize: true,
    });

    await db.initialize();
    console.log("Connected to DB!");

    app.use(cors());
    app.use(express.json());
    app.use("/api/transaction", transactionAPI);

    app.get("/connect", (req, res) => {
      res.json("Everything is fine!");
    });

    app.listen(PORT, () => console.log(`Server has rushed on port: ${PORT}.`));
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      process.exit(1);
    }
  }
})();
