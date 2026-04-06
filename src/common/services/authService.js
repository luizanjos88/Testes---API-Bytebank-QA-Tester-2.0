import api from './api';

export async function login(email, senha) {
    const response = await api.get('/users', {
        params: { email },
    });

    if (!response.data || response.data.length === 0) {
        throw new Error('E-mail ou senha inválidos');
    }

    const user = response.data[0];

    if (user.senha !== senha) {
        throw new Error('E-mail ou senha inválidos');
    }

    const tokenFake = btoa(`${user.id}:${user.email}`);
    sessionStorage.setItem('token', tokenFake);
    sessionStorage.setItem('user', JSON.stringify(user));

    return user;
}

export function logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
}

export function getUsuarioLogado() {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}