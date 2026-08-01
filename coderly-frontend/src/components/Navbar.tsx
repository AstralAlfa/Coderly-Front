import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
    const { user, token, logout } = useAuth();
    const navigate = useNavigate();
    
    function handleLogout() {
        logout();
        navigate('/');
    }

    return (
        <nav className="flex flex-wrap items-center justify-between gap-4 px-4 sm:px-8 py-4 border-b-4 border-blueprint-grid/40">
            <div className="flex items-center gap-2">
                <img src='/coderly.png' alt='Coderly' className='w-12 h-12' />
            
                <Link to="/" className="font-display text-lg sm:text-xl text-blueprint-text tracking-tight">
                    CODERLY
                </Link>
            </div>
            <div className="flex items-center gap-4 sm:gap-6 font-mono text-xs sm:text-sm">
                <Link to="/" className="hover:text-status-progress">Проекты</Link>
                {token ? (
                    <>
                        <Link to="/create" className="hover:text-status-progress">+ новый</Link>
                        <Link to={`/users/${user?.username}`} className="hover:text-status-progress">
                            {user?.username}
                        </Link>
                        <Link to="/edit-profile" className="hover:text-status-progress">
                            Редактировать профиль
                        </Link>
                        <button onClick={handleLogout} className="text-blueprint-stamp hover:opacity-80">
                            Выйти
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="hover:text-status-progress">Войти</Link>
                        <Link to="/register" className="hover:text-status-progress">Зарегистрироваться</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
