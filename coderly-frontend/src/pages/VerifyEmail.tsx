import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { verifyEmail } from "../api/auth";

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>(token ? 'loading' : 'error');
    const [message, setMessage] = useState(token ? '' : 'Токен отсутствует в ссылке');
    const hasRun = useRef(false);
    
    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        if (!token) return;

        verifyEmail(token)
            .then((res) => {
                setStatus('success');
                setMessage(res.message);
            })
            .catch((err) => {
                setStatus('error');
                setMessage(err?.response?.data?.message || 'Ссылка недействительна или истекла');
            });
    }, [token]);

    return (
        <div className="max-w-sm mx-auto mt-12 sm:mt-20 px-4 text-center">
            {status === 'loading' && <p className="font-mono text-sm text-blueprint-text/60">Проверяем...</p>}
            {status === 'success' && (
                <>
                    <h1 className="font-display text-2xl mb-4 text-status-done">Почта подтверждена</h1>
                    <p className="font-body text-blueprint-text/80 mb-6">{message}</p>
                    <Link to="/login" className="bg-blueprint-stamp text-blueprint-text rounded px-4 py-2 font-display inline-block">
                        Войти
                    </Link>
                </>
            )}
            {status === 'error' && (
                <>
                    <h1 className="font-display text-2xl mb-4 text-blueprint-stamp">Ошибка</h1>
                    <p className="font-body text-blueprint-text/80">{message}</p>
                </>
            )}
        </div>
    );
}