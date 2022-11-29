import { Router } from "express";

import { Transactions } from "../models/transactions";

const app = Router();

app.get("/", async (req, res) => {
  const response = await Transactions.find({});

  res.json(response);
});

app.get("/:id", async (req, res) => {
  const { id } = req.params;
  const result = await Transactions.findOneBy({ id: +id });

  if (!result) {
    return res.status(404).json(`There is no transaction with id: ${id}!`);
  }

  res.json(result);
});

app.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const candidate = await Transactions.findOneBy({ id: +id });

  if (candidate) {
    await candidate.remove();
    return res.json(`The transaction with id: ${id} is removed!`);
  }

  res.json(`There's no transaction with id: ${id}!`);
});

app.post("/create", async (req, res) => {
  const { title, cost } = req.body;

  const newTransaction = Transactions.create({
    title,
    cost: Number(cost),
  });

  const result = await newTransaction.save();

  res.json(result);
});

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

  res.json(`There's no transaction with id: ${id}!`);
});

export default app;
