// public/auth_guard.js

document.addEventListener('DOMContentLoaded', async function() { // Adicionado 'async' aqui
    const token = localStorage.getItem('token'); // Tenta pegar o token do localStorage

    if (!token) {
        // Se NÃO houver token, redireciona o usuário para a página de login IMEDIATAMENTE
        console.log('auth_guard: Nenhum token encontrado. Redirecionando para a página de login.');
        window.location.href = 'index.html'; // Redireciona para a sua página de login
        return; // Importante: Interrompe a execução
    }

    // --- Se houver um token, tentamos validá-lo com o backend ---
    try {
        console.log('auth_guard: Token encontrado. Validando com o backend...');
        const response = await fetch('http://localhost:3000/api/protected', { // Usamos a rota /api/protected para validação
            method: 'GET',
            headers: {
                'x-auth-token': token // Envia o token no cabeçalho
            }
        });

        if (!response.ok) { // Se o backend responder com um erro (ex: 401 Unauthorized, 403 Forbidden)
            const errorData = await response.json(); // Tenta ler a mensagem de erro do backend
            console.error('auth_guard: Falha na validação do token com o backend:', response.status, errorData.message);

            // Se o token for inválido/expirado, desloga o usuário
            if (response.status === 401 || response.status === 403) {
                console.log('auth_guard: Token inválido ou expirado. Deslogando e redirecionando para login.');
                localStorage.removeItem('token');    // Remove o token inválido
                localStorage.removeItem('username'); // Remove o username
                window.location.href = 'index.html'; // Redireciona para a página de login
                return; // Interrompe a execução
            }
            // Para outros erros (ex: 500 Internal Server Error), podemos mostrar um erro genérico
            console.log('auth_guard: Erro inesperado do servidor durante a validação do token.');
            // Opcional: redirecionar para uma página de erro ou login aqui também
            // window.location.href = 'index.html';
            // return;
        }

        // Se a resposta for OK (2xx), o token é válido
        console.log('auth_guard: Token validado com sucesso pelo backend. Usuário autorizado.');
        // Continua a execução do script e o restante do HTML será carregado.

    } catch (error) {
        // Este bloco captura erros de rede (ex: backend está offline)
        console.error('auth_guard: Erro de conexão ao validar token com o backend:', error);
        // Em caso de erro de conexão, você pode querer deslogar ou mostrar uma mensagem de erro ao usuário
        console.log('auth_guard: Não foi possível conectar ao backend. Redirecionando para login (ou mostrando erro de conexão).');
        localStorage.removeItem('token'); // Assumimos que, sem conexão, a sessão é inválida
        localStorage.removeItem('username');
        window.location.href = 'index.html'; // Redireciona para a página de login
        return; // Interrompe a execução
    }
});