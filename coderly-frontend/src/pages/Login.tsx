import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as loginRequest } from '../api/auth';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    function isAxiosError(error: unknown): error is { response?: { status?: number } } {
        return typeof error === 'object' && error !== null && 'response' in error;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        try {
            const { access_token } = await loginRequest({ email, password });
            login(access_token);
            navigate('/');
        } catch (err: unknown) {
            if (isAxiosError(err) && err.response?.status === 403) {
                setError('Проверьте почту, прежде чем войти. Проверь письмо.');
            } else {
                setError('Неверный email или пароль');
            }
        }
    }

    return (
        <div className="max-w-sm mx-auto mt-12 sm:mt-20 px-4">
            <h1 className="font-display text-2xl mb-6">Вход</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-blueprint-panel border border-blueprint-grid/50 rounded px-4 py-2 font-body outline-none focus:border-status-progress"
                    required
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-blueprint-panel border border-blueprint-grid/50 rounded px-4 py-2 font-body outline-none focus:border-status-progress"
                    required
                />
                {error && <p className="text-blueprint-stamp text-sm font-mono">{error}</p>}
                <button
                    type="submit"
                    className="bg-blueprint-stamp text-blueprint-text rounded px-4 py-2 font-display hover:opacity-90"
                >
                    Войти
                </button>
            </form>
            <p className="font-mono text=xs text-blueprint-text/60 mt-4">
                Нет аккаунта? <Link to="/register" className="text-status-progress">Регистрация</Link>
            </p>
        </div>
    );
}
