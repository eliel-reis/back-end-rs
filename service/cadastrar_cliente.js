import clientes from "../data/dados.js";

export default function cadastrar_cliente(nome, telefone, email, data) {
  // Verifica se o nome já existe no array
  const clienteExistente = clientes.find((cliente) => cliente.nome === nome);

  if (clienteExistente) {
    return { success: false, message: `Cliente com o nome ${nome} já existe.` };
  }

  const novo_cliente = {
    nome: nome,
    telefone: telefone,
    email: email,
    data: data,
  };

  clientes.push(novo_cliente);
  return { success: true, message: `Cliente ${nome} cadastrado com sucesso.` };
}
