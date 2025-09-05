
    
        $(document).ready(function () {
            $("#usuarios").submit(function (e) {
                e.preventDefault();  // Evitar o envio padrão do formulário
                
                const dados = {
                    nome: $("#txtNome").val(),
                    cpf: $("#txtCPF").val(),
                    endereco: $("#txtEndereco").val(),
                    telefone: $("#txtTelefone").val(),
                    email: $("#txtEmail").val(),
                    senha: $("#txtSenha").val()
                };

                // Enviar dados via AJAX para o backend Node.js
                $.ajax({
                    url: 'http://localhost:3000/usuarios',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(dados),
                    success: function (response) {
                        alert(response.message);
                    },
                    error: function (xhr, status, error) {
                        console.log("Erro AJAX:", error);  // Log do erro da requisição AJAX
                        console.log("Resposta completa:", xhr);  // Log da resposta completa do servidor
                        alert('Erro ao enviar dados.');
                    }
                });
            });
        });

function reseta(){
    document.getElementById("txtNome").value;
    var fone = document.getElementById("txtFone").value;
    var endereco = document.getElementById("txtEndereco").value;
    document.querySelector("#errorNome").textContent = "";
    document.querySelector("#errorFone").textContent = "";
    document.querySelector("#errorEndereco").textContent = "";
    document.querySelector("#errorEstado").textContent = "";
    document.querySelector("#errorDoar").textContent = "";

}
function validacao(){

    //Declaração de variáveis
    var doar = document.getElementById("txtDoar").value;
    var estado = document.getElementById("txtEstado").value;
    var nome = document.getElementById("txtNome").value;
    var fone = document.getElementById("txtFone").value;
    var endereco = document.getElementById("txtEndereco").value;
    
    //O NOME não pode estar em branco, não pode ter mais de 50 caracteres
    //e não pode conter números.
    if(nome.length == 0 || nome.length > 50 || /\d/.test(nome)){
       document.querySelector("#errorNome").textContent = "Nome inválido*";
       event.preventDefault();
    }

    //O TELEFONE não pode estar em branco, não pode ter mais que 11 dígitos,
    //não pode ter menos de 10 dígitos e precisa ser um número.
    if(fone.length == 0 || fone.length > 11 || isNaN(fone) || fone.length < 10){
        document.querySelector("#errorFone").textContent = "Telefone inválido*";
        event.preventDefault();
    };
    
    //O ENDEREÇO não pode estar em branco e não pode ter mais de 50 caracteres.
    if(endereco.length == 0 || endereco.length > 50){
        document.querySelector("#errorEndereco").textContent = "Endereço inválido*";
        event.preventDefault();
    };

    //O campo precisa ser selecionado.
    if(estado == "selecionar"){
        document.querySelector("#errorEstado").textContent = " Campo não selecionado*";
        event.preventDefault();
    };

    //O campo precisa ser selecionado.
    if(doar == "selecionar"){
        document.querySelector("#errorDoar").textContent = " Campo não selecionado*";
        event.preventDefault();
    };
    }