document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("consulta"); // Formulário de consulta
    const inputCPF = document.getElementById("txtCPF"); // Campo de entrada do CPF
    const tabelaPedidos = document.createElement("table"); // Criando a tabela de pedidos dinamicamente
    tabelaPedidos.classList.add("tabela-estilizada");
    tabelaPedidos.innerHTML = `
        <thead>
            <tr>
                <th>ID</th>
                <th>Produto</th>
                <th>Fornecedor</th>
                <th>Pagamento</th>
                <th>Transportadora</th>
                <th>Ação</th>
            </tr>
        </thead>
        <tbody id="tabelaBody"></tbody>
    `;
    const divResultado = document.getElementById("resultadoTabela");
divResultado.innerHTML = ""; // Limpa caso já exista uma tabela
divResultado.appendChild(tabelaPedidos); // Adiciona a tabela ao corpo da página

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Evita o recarregamento da página

        const cpf = inputCPF.value.trim(); // Obtém o CPF digitado

        if (!cpf) {
            alert("Por favor, insira um CPF válido!");
            return;
        }

        // 🚀 Faz a requisição GET para obter pedidos do CPF
        fetch(`http://localhost:3000/pedidos/${cpf}`)
            .then(response => response.json())
            .then(data => {
                const tabelaBody = document.getElementById("tabelaBody");
                tabelaBody.innerHTML = ""; // Limpa os resultados anteriores

                if (data.message) {
                    alert(data.message); // Mostra mensagem caso não tenha pedidos
                    return;
                }

                data.forEach(pedido => {
                    const row = document.createElement("tr");

                    row.innerHTML = `
                        <td>${pedido.id}</td>
                        <td>${pedido.produto}</td>
                        <td>${pedido.fornecedor}</td>
                        <td>${pedido.pagamento}</td>
                        <td>${pedido.transportadora}</td>
                        <td><button class="btnExcluir" onclick="excluirPedido(${pedido.id}, '${pedido.cpf}')">Excluir</button>
                        <button class="btnAtualizar" onclick="atualizarPedido(${pedido.id}, '${pedido.cpf}')">Atualizar</button>

                    `;

                    tabelaBody.appendChild(row);
                });
            })
            .catch(error => console.error("Erro ao buscar pedidos:", error));
    });
});

// 🚀 Função para excluir um pedido
function excluirPedido(id, cpf) {
    if (confirm("Tem certeza que deseja excluir este pedido?")) {
        fetch(`http://localhost:3000/pedidos/${id}/${cpf}`, {
            method: "DELETE",
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                location.reload(); // Recarrega a página para atualizar a lista
            })
            .catch(error => console.error("Erro ao excluir pedido:", error));
    }
}

function atualizarPedido(id, cpf) {
    console.log("Atualizando pedido ID:", id, "CPF:", cpf);

    const produto = prompt("Digite o novo produto (deixe vazio para manter):");
    const fornecedor = prompt("Digite o novo fornecedor (deixe vazio para manter):");
    const pagamento = prompt("Digite a nova forma de pagamento (deixe vazio para manter):");
    const transportadora = prompt("Digite a nova transportadora (deixe vazio para manter):");

    fetch(`http://localhost:3000/pedido/${id}`)
        .then(response => {
            if (!response.ok) throw new Error('Pedido não encontrado');
            return response.json();
        })
        .then(pedidoAtual => {
            const dadosAtualizados = {
                produto: produto || pedidoAtual.produto,
                fornecedor: fornecedor || pedidoAtual.fornecedor,
                pagamento: pagamento || pedidoAtual.pagamento,
                transportadora: transportadora || pedidoAtual.transportadora
            };

            return fetch(`http://localhost:3000/pedidos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosAtualizados)
            });
        })
        .then(response => {
            if (!response.ok) throw new Error('Erro ao atualizar pedido');
            return response.json();
        })
        .then(data => {
            alert(data.message);
            location.reload(); // Atualiza a tabela
        })
        .catch(error => {
            alert('Erro: ' + error.message);
        });
}

