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
        <nav className="flex flex-wrap items-center justify-between gap-4 px-4 sm:px-8 py-4 border-b border-blueprint-grid/40">
            <Link to="/" className="font-display text-lg sm:text-xl text-blueprint-text tracking-tight">
                CODERLY
            </Link>
            <div className="flex items-center gap-4 sm:gap-6 font-mono text-xs sm:text-sm">
                <Link to="/" className="hover:text-status-progress">projects</Link>
                {token ? (
                    <>
                        <Link to="/create" className="hover:text-status-progress">+ new</Link>
                        <Link to={`/users/${user?.username}`} className="hover:text-status-progress">
                            {user?.username}
                        </Link>
                        <button onClick={handleLogout} className="text-blueprint-stamp hover:opacity-80">
                            logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="hover:text-status-progress">login</Link>
                        <Link to="/register" className="hover:text-status-progress">register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
