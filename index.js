import express from "express";
import cors from "cors";
import cron from "node-cron";

import cadastrar_cliente from "./service/cadastrar_cliente.js";
import exibir_clientes from "./service/exibir_clientes.js";
import editar_cliente from "./service/editar_cliente.js";
import Deletar_Cliente from "./service/deletar_clientes.js";
import enviar_mensagem_whatsapp from "./service/enviar_mensagem.js";

import http from "http";

const app = express();
app.use(cors());
app.use(express.json());

// Agendar a execução diária às 00:00 (meia-noite)
cron.schedule("0 6 * * *", () => {
  enviar_mensagem_whatsapp();
  console.log("Mensagens verificadas e enviadas!");
});

app.post("/cadastrar_cliente", (req, res) => {
  const { nome, telefone, email, data } = req.body;
  const resultado = cadastrar_cliente(nome, telefone, email, data);
  if (resultado.success) {
    res.status(200).json({ message: resultado.message });
  } else {
    res.status(400).json({ message: resultado.message });
  }
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

app.listen(3005, () => {
  const data = new Date();
  console.log("Servidor Iniciado " + data);
});

//Pingar a si mesmo para evitar que o Render durma
setInterval(() => {
  http.get("https://back-end-rs.onrender.com");
}, 5 * 60 * 1000); // A cada 5 minutos
