import pkg from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import clientes from "../data/dados.js";
import fs from "fs";
import path from "path";

const { Client, LocalAuth } = pkg;

async function initializeClient() {
  const client = new Client({
    authStrategy: new LocalAuth({
      clientId: "client-one", // Adicione um ID único ao cliente para evitar conflitos
    }),
    puppeteer: {
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
        "--single-process",
        "--disable-extensions",
      ],
    },
  });

  client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
  });

  client.on("ready", () => {
    console.log("Cliente WhatsApp está pronto!");
  });

  client.on("disconnected", (reason) => {
    console.log("Cliente WhatsApp desconectado:", reason);
    handleClientDisconnection(); // Handle client disconnection
  });

  client.on("auth_failure", (message) => {
    console.error("Falha na autenticação:", message);
    handleClientDisconnection(); // Handle client disconnection on auth failure
  });

  try {
    await client.initialize();
  } catch (error) {
    await handleInitializationError(error);
  }

  return client;
}

async function handleInitializationError(error) {
  if (
    error.message.includes("EBUSY: resource busy or locked") ||
    error.message.includes("Execution context was destroyed")
  ) {
    console.log(
      "Erro de recurso ocupado detectado, tentando limpar o diretório de sessão..."
    );
    const authPath = path.resolve(".wwebjs_auth");
    fs.rmSync(authPath, { recursive: true, force: true });
    console.log(
      "Diretório de sessão limpo. Tentando reinicializar o cliente..."
    );
    return await initializeClient();
  } else {
    throw error;
  }
}

async function handleClientDisconnection() {
  const client = await initializeClient();
  return client;
}

let clientPromise = initializeClient().catch(async (error) => {
  clientPromise = handleInitializationError(error);
});

export default function enviar_mensagem_whatsapp() {
  clientPromise
    .then((client) => {
      const hoje = new Date();
      const dia = hoje.getDate();
      const mes = hoje.getMonth() + 1; // Janeiro é 0
      const ano = hoje.getFullYear();
      const hora = hoje.getHours();

      clientes.forEach((cliente) => {
        const [clienteAno, clienteMes, clienteDia] = cliente.data
          .split("-")
          .map(Number);

        // Cria uma data com a data do cliente
        const dataCliente = new Date(clienteAno, clienteMes - 1, clienteDia);
        // Subtrai um dia da data do cliente
        dataCliente.setDate(dataCliente.getDate() - 1);

        if (
          dataCliente.getDate() === dia &&
          dataCliente.getMonth() + 1 === mes &&
          dataCliente.getFullYear() === ano &&
          hora >= 6
        ) {
          const { nome, telefone } = cliente;
          const mensagem = `Olá ${nome},\n\nEsta é uma mensagem automática apenas para lembrar que o pagamento referente ao serviço realizado está agendado para amanhã. \n\nCaso já tenha realizado o pagamento, por favor, desconsidere esta mensagem. \n\nAgradecemos pela sua atenção e cooperação.\n\nAtenciosamente,\nRicardo Sevirino`;
          client
            .sendMessage(`55${telefone}@c.us`, mensagem)
            .then((response) =>
              console.log("Mensagem enviada com sucesso!", response)
            )
            .catch((error) => console.error("Erro ao enviar mensagem:", error));
        }
      });
    })
    .catch((error) => {
      console.error("Erro ao inicializar o cliente WhatsApp:", error);
    });
}
