import clientes from "../data/dados.js";
export default function cadastrar_cliente(nome, telefone, email, data) {
  const novo_cliente = {
    nome: nome,
    telefone: telefone,
    email: email,
    data: data,
  };

  clientes.push(novo_cliente);
}
