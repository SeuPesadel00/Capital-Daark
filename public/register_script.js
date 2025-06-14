// public/register_script.js

document.addEventListener('DOMContentLoaded', function() {
    console.log('register_script.js carregado. DOMContentLoaded disparado.');
    const registerForm = document.getElementById('registerForm');
    const messageDiv = document.getElementById('message');

    if (registerForm) {
        console.log('Formulário de registro encontrado.');
        registerForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            console.log('Evento de submit do formulário disparado.');

            const username = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            console.log('Dados do formulário:', { username, email, password, confirmPassword });

            if (password !== confirmPassword) {
                messageDiv.textContent = 'As senhas não coincidem!';
                messageDiv.className = 'mt-4 text-center text-sm font-semibold text-red-400';
                console.log('Senhas não coincidem.');
                return;
            }

            try {
                console.log('Tentando fazer fetch para:', 'http://localhost:3000/api/auth/register');
                const response = await fetch('http://localhost:3000/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, email, password })
                });

                const data = await response.json();
                console.log('Resposta do Backend:', data);

                if (response.ok) {
                    messageDiv.textContent = data.message + ' Redirecionando para login...'; // Mensagem mais clara
                    messageDiv.className = 'mt-4 text-center text-sm font-semibold text-green-400';
                    registerForm.reset();

                    // REMOVER: As linhas que salvam o token e username no localStorage
                    // if (data.token) {
                    //     localStorage.setItem('token', data.token);
                    //     localStorage.setItem('username', data.username);
                    // }

                    console.log('Registro bem-sucedido. Redirecionando para login...');
                    setTimeout(() => {
                        // ALTERAR: Para a página de login (index.html ou login.html)
                        window.location.href = 'index.html'; // Ou 'index.html' se for sua página de login
                    }, 2000);
                } else {
                    messageDiv.textContent = data.message || 'Erro no registro.';
                    messageDiv.className = 'mt-4 text-center text-sm font-semibold text-red-400';
                    console.log('Erro no registro, status:', response.status, 'Mensagem:', data.message);
                }
            } catch (error) {
                console.error('Erro na requisição de registro:', error);
                messageDiv.textContent = 'Erro de conexão com o servidor. Tente novamente.';
                messageDiv.className = 'mt-4 text-center text-sm font-semibold text-red-400';
            }
        });
    } else {
        console.log('Erro: Formulário de registro (ID "registerForm") não encontrado.');
    }
});