import { Router } from "express";

import { Transactions } from "../models/transactions";
import { isThereTokenAvailable, areCredentialsProvided } from "../utils";

const app = Router();

app.get("/", isThereTokenAvailable, async (req, res) => {
  const { user } = res.locals;

  console.log(user);

  const response = await Transactions.findBy({
    userId: user.id,
  });

  res.json(response);
});

app.get("/:id", async (req, res) => {
  const { id } = req.params;
  const result = await Transactions.findOneBy({ id: +id });

  if (!result) {
    return res.status(404).json(`Немає транзакції з таким id: ${id}!`);
  }

  res.json(result);
});

app.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const candidate = await Transactions.findOneBy({ id: +id });

  if (candidate) {
    await candidate.remove();
    return res.json(`Транзакцію з id: ${id} видалено!`);
  }

  res.json(`Немає транзакції з таким id: ${id}!`);
});

app.post(
  "/create",
  isThereTokenAvailable,
  areCredentialsProvided(["title", "cost"]),
  async (req, res) => {
    const { user } = res.locals;
    const { title, cost } = req.body;

    const newTransaction = Transactions.create({
      title,
      userId: user.id,
      cost: Number(cost),
    });

    const result = await newTransaction.save();

    res.json(result);
  }
);

app.patch("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { cost, title } = req.body;
  const candidate = await Transactions.findOneBy({ id: +id });

  if (candidate) {
    candidate.title = title;
    candidate.cost = Number(cost);
    const updated = await candidate.save();

    return res.json(updated);
  }

  res.json(`Немає транзакції з таким id: ${id}!`);
});

export default app;
