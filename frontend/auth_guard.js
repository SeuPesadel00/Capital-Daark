// public/auth_guard.js

document.addEventListener('DOMContentLoaded', async function() {
    const token = localStorage.getItem('token');

    if (!token) {
        console.log('auth_guard: Nenhum token encontrado. Redirecionando para a página de login.');
        window.location.href = 'index.html';
        return;
    }

    try {
        console.log('auth_guard: Token encontrado. Validando com o backend...');
        
        // CORREÇÃO: URL do backend no Render
        const response = await fetch('https://capital-daark.onrender.com/api/protected', { 
            method: 'GET',
            headers: {
                'x-auth-token': token
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('auth_guard: Falha na validação do token com o backend:', response.status, errorData.message);

            if (response.status === 401 || response.status === 403) {
                console.log('auth_guard: Token inválido ou expirado. Deslogando e redirecionando para login.');
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                window.location.href = 'index.html';
                return;
            }
            console.log('auth_guard: Erro inesperado do servidor durante a validação do token.');
        }

        console.log('auth_guard: Token validado com sucesso pelo backend. Usuário autorizado.');

    } catch (error) {
        console.error('auth_guard: Erro de conexão ao validar token com o backend:', error);
        console.log('auth_guard: Não foi possível conectar ao backend. Redirecionando para login (ou mostrando erro de conexão).');
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location.href = 'index.html';
        return;
    }
});