// public/user_home_script.js

document.addEventListener('DOMContentLoaded', function() {
    // --- LÓGICA DE PROTEÇÃO DE ROTAS REMOVIDA DAQUI ---
    // Essa parte agora está no auth_guard.js

    console.log('user_home_script: Script da user_home.html executando.'); // Log para confirmar que o script continua

    const welcomeMessageElement = document.getElementById('welcome-message');
    const username = localStorage.getItem('username'); // O token já foi verificado pelo auth_guard

    // Atualiza a mensagem de boas-vindas com o nome do usuário
    if (welcomeMessageElement && username) {
        const welcomeTextSpan = welcomeMessageElement.querySelector('h1 .neon-text');
        if (welcomeTextSpan) {
            welcomeTextSpan.textContent = `Bem-vindo, ${username}`;
        }
    }

    // Lógica para mostrar/esconder a mensagem de boas-vindas (uma vez por sessão)
    if (welcomeMessageElement) {
        const hasVisitedHome = sessionStorage.getItem('hasVisitedHome');
        if (!hasVisitedHome) {
            welcomeMessageElement.classList.remove('hidden');
            sessionStorage.setItem('hasVisitedHome', 'true');
            setTimeout(() => {
                welcomeMessageElement.classList.add('hidden');
            }, 5000);
        } else {
            welcomeMessageElement.classList.add('hidden');
        }
    }

    // --- FUNÇÃO PARA TESTAR ROTAS PROTEGIDAS E LIDAR COM TOKENS INVÁLIDOS/EXPIRADOS ---
    async function testProtectedRoute() {
        try {
            const currentToken = localStorage.getItem('token'); // Pega o token para esta requisição

            // Embora auth_guard já verifique, uma verificação aqui é boa antes de enviar a requisição
            if (!currentToken) {
                console.log('testProtectedRoute: Nenhum token para enviar para a rota protegida. (Já deveria ter sido redirecionado)');
                // Poderia forçar redirecionamento aqui também, mas auth_guard já cuida disso.
                return;
            }

            const response = await fetch('https://capital-daark.onrender.com/api/auth/login', {
                method: 'GET',
                headers: {
                    'x-auth-token': currentToken // Envia o token no cabeçalho 'x-auth-token'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Erro ao acessar rota protegida:', response.status, errorData.message);

                if (response.status === 401 || response.status === 403) {
                    console.log('Token inválido ou expirado. Redirecionando para login.');
                    localStorage.removeItem('token');
                    localStorage.removeItem('username');
                    window.location.href = 'index.html';
                }
                return;
            }

            const data = await response.json();
            console.log('Resposta da rota protegida:', data);

        } catch (error) {
            console.error('Erro de conexão ao acessar rota protegida:', error);
        }
    }

    // Chame a função de teste da rota protegida quando a página carregar
    testProtectedRoute();

    // --- LÓGICA PARA O BOTÃO SAIR (LOGOUT) ---
    const logoutLink = document.querySelector('a[href="index.html"].text-red-400');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(event) {
            event.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            console.log('Usuário deslogado. Redirecionando para login.');
            window.location.href = 'index.html';
        });
    }
});