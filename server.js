import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import User from "./models/User.js";
import Expense from "./models/Expense.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/gestor_gastos";
mongoose.connect(MONGO_URI).then(() => {
  console.log("✅ Conectado a Mongo");
}).catch(err => {
  console.error("❌ Error Mongo:", err.message);
});

app.get("/users", async (req, res) => {
  const users = await User.find().sort({ name: 1 });
  res.json(users);
});

app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body || {};
    if (!name || !email) return res.status(400).json({ error: "Falta name o email" });
    const user = await User.create({ name, email });
    res.status(201).json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.get("/expenses", async (req, res) => {
  const expenses = await Expense.find()
    .sort({ date: -1, createdAt: -1 })
    .populate("paidBy", "name email")
    .populate("participants", "name email");
  res.json(expenses);
});

app.get("/expenses/:id", async (req, res) => {
  try {
    const exp = await Expense.findById(req.params.id)
      .populate("paidBy", "name email")
      .populate("participants", "name email");
    if (!exp) return res.status(404).json({ error: "No existe" });
    res.json(exp);
  } catch {
    res.status(400).json({ error: "ID inválido" });
  }
});

app.post("/expenses", async (req, res) => {
  try {
    const { title, amount, paidBy, participants, date, description } = req.body || {};
    if (!title || !amount || !paidBy || !participants?.length) {
      return res.status(400).json({ error: "Faltan datos" });
    }
    const exp = await Expense.create({ title, amount, paidBy, participants, date, description });
    const populated = await exp.populate([
      { path: "paidBy", select: "name email" },
      { path: "participants", select: "name email" }
    ]);
    res.status(201).json(populated);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.put("/expenses/:id", async (req, res) => {
  try {
    const { title, amount, paidBy, participants, date, description } = req.body || {};
    const updated = await Expense.findByIdAndUpdate(
      req.params.id,
      { title, amount, paidBy, participants, date, description },
      { new: true, runValidators: true }
    ).populate("paidBy", "name email").populate("participants", "name email");
    if (!updated) return res.status(404).json({ error: "No existe" });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.delete("/expenses/:id", async (req, res) => {
  try {
    const deleted = await Expense.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "No existe" });
    res.json({ ok: true });
  } catch {
    res.status(400).json({ error: "ID inválido" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Backend en http://localhost:${PORT}`));