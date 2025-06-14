// Adiciona um ouvinte de evento para o envio do formulário de login
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Previne o envio padrão do formulário, que recarregaria a página

    // Obtém os valores do e-mail e senha inseridos pelo usuário
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    // Obtém o elemento onde as mensagens de status serão exibidas
    const messageDiv = document.getElementById('message');

    // Simulação de credenciais de login para o frontend
    // Em um ambiente de produção com backend, você faria uma requisição HTTP (fetch ou XMLHttpRequest)
    // para o seu servidor aqui, enviando as credenciais para validação.
    if (email === 'teste@exemplo.com' && password === 'senha123') {
        // Se as credenciais simuladas estiverem corretas
        messageDiv.textContent = 'Redirecionando...';
        messageDiv.className = 'mt-4 text-center text-sm font-semibold text-green-400'; // Estilo para sucesso
        // Redireciona para a página inicial do usuário após um pequeno atraso
        setTimeout(() => {
            window.location.href = 'user_home.html'; // Altera a URL da janela para a página do usuário
        }, 1500); // Atraso de 1.5 segundos para a mensagem ser lida
    } else {
        // Se as credenciais simuladas estiverem incorretas
        messageDiv.textContent = 'E-mail ou senha incorretos.';
        messageDiv.className = 'mt-4 text-center text-sm font-semibold text-red-400'; // Estilo para erro
    }
});