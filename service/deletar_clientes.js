import clientes from "../data/dados.js";
export default function Deletar_Cliente(nome) {
  const cliente_index = clientes.findIndex((cliente) => cliente.nome === nome);
  if (cliente_index !== -1) {
    clientes.splice(cliente_index, 1);
    console.log("Cliente deletado com sucesso!");
  } else {
    console.log("Cliente não encontrado!");
  }
}
