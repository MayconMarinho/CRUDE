document.addEventListener("DOMContentLoaded", () => {
    const userInfo = document.getElementById("user-info");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        window.location.href = "index.html";  // Redireciona para login se não estiver logado
    } else {
        userInfo.textContent = `Olá, ${user.nome}!`;  // Exibe o nome do usuário
    }
});

const logoutButton = document.getElementById("logout");
if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "index.html";  // Redireciona para o login
    });
}
