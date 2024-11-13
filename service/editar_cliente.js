import clientes from "../data/dados.js";
export default function editar_cliente(
  nome,
  telefone_novo,
  email_novo,
  data_nova
) {
  const cliente_index = clientes.findIndex((cliente) => cliente.nome === nome);

  if (cliente_index !== -1) {
    clientes[cliente_index] = {
      ...clientes[cliente_index],
      nome: nome,
      telefone: telefone_novo,
      email: email_novo,
      data: data_nova,
    };
  } else {
    console.log("Cliente não encontrado!");
  }
}
