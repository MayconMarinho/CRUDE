
// Evento 'DOMContentLoaded' garante que o código seja executado depois que o HTML estiver totalmente carregado.
document.addEventListener("DOMContentLoaded", () => {

    // Obtém o formulário de login pela ID 'login'
    const loginForm = document.getElementById("login");

    // Adiciona um 'listener' para o evento de envio do formulário
    loginForm.addEventListener("submit", async (e) => {
        // Impede que o formulário seja enviado de forma tradicional (com recarregamento da página)
        e.preventDefault();

        // Obtém o valor do campo de e-mail preenchido pelo usuário no formulário
        const email = document.getElementById("txtEmail").value;

        // Obtém o valor do campo de senha preenchido pelo usuário no formulário
        const senha = document.getElementById("txtSenha").value;

        // Realiza uma requisição HTTP do tipo POST para o servidor, enviando o e-mail e a senha como JSON
        const response = await fetch("http://localhost:3000/login", {
            method: "POST", // Define que a requisição é do tipo POST
            headers: { "Content-Type": "application/json" }, // Define o cabeçalho como JSON
            body: JSON.stringify({ email, senha }) // Converte o corpo da requisição para JSON com os dados do e-mail e senha
        });

        // Espera a resposta do servidor e converte os dados recebidos para um objeto JSON
        const data = await response.json();

        // Verifica se a resposta do servidor foi bem-sucedida (login realizado com sucesso)
        if (data.success) {
            // Se o login foi bem-sucedido, salva o token e as informações do usuário no localStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            // Redireciona o usuário para a página principal (principal.html)
            window.location.href = "../produtos/nossos_trabalhos.html";  
        } else {
            // Caso o login não seja bem-sucedido, exibe uma mensagem de erro
            alert(data.message);  
        }
    });
});

/*
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
    } */