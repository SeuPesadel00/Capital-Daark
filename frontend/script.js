document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const messageDiv = document.getElementById('message');

    if (loginForm) {
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            console.log('Evento de submit do formulário de login disparado.');

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            console.log('Tentando login com:', { email, password });

            try {
                // CORREÇÃO: A URL agora inclui o caminho completo para a rota de login
                const response = await fetch('https://capital-daark.onrender.com/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                console.log('Resposta bruta do Backend (login):', response);
                const data = await response.json();
                console.log('Dados do Backend (login):', data);

                if (response.ok) {
                    messageDiv.textContent = data.message;
                    messageDiv.className = 'mt-4 text-center text-sm font-semibold text-green-400';
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('username', data.username);
                    console.log('Login bem-sucedido. Redirecionando...');
                    setTimeout(() => {
                        window.location.href = 'user_home.html';
                    }, 1500);
                } else {
                    messageDiv.textContent = data.message || 'Erro no login.';
                    messageDiv.className = 'mt-4 text-center text-sm font-semibold text-red-400';
                    console.log('Erro no login, status:', response.status, 'Mensagem:', data.message);
                }
            } catch (error) {
                console.error('Erro na requisição de login:', error);
                messageDiv.textContent = 'Erro de conexão com o servidor. Verifique se o backend está rodando.';
                messageDiv.className = 'mt-4 text-center text-sm font-semibold text-red-400';
            }
        });
    }
    // ... restante do seu script.js (lógica de boas-vindas, logout, etc.)
});