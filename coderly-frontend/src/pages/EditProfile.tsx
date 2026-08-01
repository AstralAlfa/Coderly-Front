import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../api/users";
import { useAuth } from "../hooks/useAuth";

export default function EditProfile() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [bio, setBio] = useState('');
    const [githubUrl, setGithubUrl] = useState('');
    const [phone, setPhone] = useState('');
    const [telegramUsername, setTelegramUsername] = useState('');
    const [error, setError] = useState('');
    
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        try {
            await updateProfile({
                bio: bio || undefined,
                githubUrl: githubUrl || undefined,
                phone: phone || undefined,
                telegramUsername: telegramUsername || undefined,
            });
            navigate(`/users/${user?.username}`);
        } catch (err) {
            const error = err as { response?: { data?: { message?: string[] } } };
            setError(error?.response?.data?.message?.[0] || 'Ошибка обновления профиля');
        }
    }

    return (
        <div className="max-w-sm mx-auto mt-12 px-4">
            <h1 className="font-display text-2xl mb-6">Редактировать профиль</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <textarea
                    placeholder="О себе"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    maxLength={300}
                    className="bg-blueprint-panel border border-blueprint-grid/50 rounded px-4 py-2 font-body outline-none focus:border-status-progress, resize-none"
                />
                <input
                    type="url"
                    placeholder="GitHub URL"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="bg-blueprint-panel border border-blueprint-grid/50 rounded px-4 py-2 font-body outline-none focus:border-status-progress"
                />
                <input
                    type="tel"
                    placeholder="Телефон"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-blueprint-panel border border-blueprint-grid/50 rounded px-4 py-2 font-body outline-none focus:border-status-progress"
                />
                <input
                    type="text"
                    placeholder="Telegram Username (без @)"
                    value={telegramUsername}
                    onChange={(e) => setTelegramUsername(e.target.value)}
                    className="bg-blueprint-panel border border-blueprint-grid/50 rounded px-4 py-2 font-body outline-none focus:border-status-progress"
                />
                {error && <p className="text-blueprint-stamp text-sm font-mono">{error}</p>}
                <button
                    type="submit"
                    className="bg-blueprint-stamp text-blueprint-text rounded px-4 py-2 font-display hover:opacity-90"
                >
                    Сохранить
                </button>
            </form>
        </div>
    );
}
