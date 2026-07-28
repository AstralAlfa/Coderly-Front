import { useState } from 'react';
import { Link } from 'react-router-dom';
import { register as registerRequest } from '../api/auth';

export default function Register() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        try {
            await registerRequest({ email, username, password });
            setIsRegistered(true);
        } catch (err: unknown) {
            if (typeof err === 'object' && err !== null) {
                const response = (err as {
                    response?: {
                        data?: {
                            message?: string;
                        };
                    };
                }).response;
                setError(response?.data?.message || 'Ошибка регистрации');
            } else {
                setError('Ошибка регистрации');
            }
        }
    }

    if (isRegistered) {
        return (
            <div className='max-w-sm mx-auto mt-12 sm:mt-20 px-4 text-center'>
                <h1 className='font-display text-2xl mb-4'>Почти готово</h1>
                <p className='font-body text-blueprint-text/80'>
                    Мы отправили письмо на <span className='text-status-progress'>{email}</span>.
                    Перейдите по ссылке в письме, чтобы подтвердить почту и войти. 
                </p>
            </div>
        );
    }

    return (
        <div className='max-w-sm mx-auto mt-12 sm:mt-20 px-4'>
            <h1 className='font-display text-2xl mb-6'>Регистрация</h1>
            <form onSubmit={handleSubmit} className='flex flex-col hap-4'>
                <input
                    type='email'
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='bg-blueprint-panel border border-blueprint-grid/50 rounded px-4 py-2 font-body outline-none focus:border-status-progress'
                    required
                />
                <input
                    type='text'
                    placeholder='Username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className='bg-blueprint-panel border border-blueprint-grid/50 rounded px-4 py-2 font-body outline-none focus:border-status-progress'
                    required
                />
                <input
                    type='password'
                    placeholder='Пароль'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='bg-blueprint-panel border border-blueprint-grid/50 rounded px-4 py-2 font-body outline-none focus:border-status-progress'
                    required
                />
                {error && <p className='text-blueprint-stamp text-sm font-mono'>error</p>}
                <button
                    type='submit'
                    className='bg-blueprint-stamp text-blueprint-text rounded px-4 py-2 font-display hover:opacity-90'
                >
                    Создать аккаунт
                </button>
            </form>
            <p className='font-mono text-xs text-blueprint-text/60 mt-4'>
                Уже есть аккаунт? <Link to='/login' className='text-status-progress'>Войти</Link>
            </p>
        </div>
    );
}
