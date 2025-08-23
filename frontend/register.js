// Este código deve estar em um arquivo JavaScript que é carregado pelo seu register.html
// Ex: public/js/register_script.js

document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const messageDiv = document.getElementById('message'); // Certifique-se que você tem um <div id="message"> no seu HTML

    if (registerForm) {
        registerForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // Previne o envio padrão do formulário

            const name = document.getElementById('name').value; // 'name' é o id do campo nome de usuário no seu HTML
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value; // Certifique-se que o id é 'confirm-password'

            if (password !== confirmPassword) {
                messageDiv.textContent = 'As senhas não coincidem!';
                messageDiv.className = 'mt-4 text-center text-sm font-semibold text-red-400';
                return;
            }

            try {
                // Envia os dados para a API de registro no seu backend
                const response = await fetch('https://capital-daark.onrender.com', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username: name, email, password }) // ATENÇÃO: 'username' é o nome do campo no seu Schema do Mongoose
                });

                const data = await response.json(); // Pega a resposta JSON do backend

                if (response.ok) { // Se a resposta for 2xx (sucesso)
                    messageDiv.textContent = data.message;
                    messageDiv.className = 'mt-4 text-center text-sm font-semibold text-green-400';
                    registerForm.reset(); // Limpa o formulário após o registro
                    // Opcional: Redirecionar para a página de login após alguns segundos
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000); // Redireciona após 2 segundos
                } else { // Se a resposta for um erro (4xx, 5xx)
                    messageDiv.textContent = data.message || 'Erro ao registrar usuário. Tente novamente.';
                    messageDiv.className = 'mt-4 text-center text-sm font-semibold text-red-400';
                }
            } catch (error) {
                console.error('Erro na requisição de registro:', error);
                messageDiv.textContent = 'Erro de conexão com o servidor. Verifique se o backend está rodando.';
                messageDiv.className = 'mt-4 text-center text-sm font-semibold text-red-400';
            }
        });
    }
});