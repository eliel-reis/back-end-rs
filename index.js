import express from "express";
import cors from "cors";
import cron from "node-cron";

import cadastrar_cliente from "./service/cadastrar_cliente.js";
import exibir_clientes from "./service/exibir_clientes.js";
import editar_cliente from "./service/editar_cliente.js";
import Deletar_Cliente from "./service/deletar_clientes.js";
import enviar_mensagem_whatsapp from "./service/enviar_mensagem.js";

const app = express();
app.use(cors());
app.use(express.json());

// Agendar a execução diária às 00:00 (meia-noite)
cron.schedule("0 6 * * *", () => {
  enviar_mensagem_whatsapp();
  console.log("Mensagens verificadas e enviadas!");
});

app.post("/cadastrar_cliente", (req, res) => {
  const nome = req.body.nome;
  const telefone = req.body.telefone;
  const email = req.body.email;
  const data = req.body.data;

  cadastrar_cliente(nome, telefone, email, data);
  res.status(204).end();
});

app.put("/editar_cliente", (req, res) => {
  const nome = req.body.nome;
  const telefone = req.body.telefone;
  const email = req.body.email;
  const data = req.body.data;

  editar_cliente(nome, telefone, email, data);
  res.status(204).end();
});

app.get("/exibir_clientes", (req, res) => {
  const resultado = exibir_clientes();

  res.json(resultado);
});

app.post("/", (req, res) => {
  const usuario = req.body.usuario;
  const senha = req.body.senha;

  const resultado = usuario == "ricardo" && senha == "123";

  res.json(resultado);
});

app.delete("/deletar_clientes", (req, res) => {
  const nome = req.body.nome;

  Deletar_Cliente(nome);
  res.status(204).end();
});

app.post("/enviar_mensagem", (req, res) => {
  enviar_mensagem_whatsapp();
  res.status(200).json({ message: "Mensagens verificadas e enviadas!" });
});

app.listen(3000, () => {
  const data = new Date();
  console.log("Servidor Iniciado " + data);
});