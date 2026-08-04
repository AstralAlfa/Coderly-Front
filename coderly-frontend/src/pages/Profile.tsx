import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProfile } from "../api/users";
import { getProjects } from "../api/projects";
import { sendContactRequest, getOutgoingRequests } from "../api/contactRequests";
import type { User, Project } from "../types";
import { useAuth } from "../hooks/useAuth";
import ProjectCard from "../components/ProjectCard";

export default function Profile() {
    const { username } = useParams<{ username: string }>();
    const { user: currentUser, token } = useAuth();
    const [profile, setProfile] = useState<User | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [requestStatus, setRequestStatus] = useState<'none' | 'pending' | 'sent'>('none');

    useEffect(() => {
        if (!username) return;
        getProfile(username)
            .then(setProfile)
            .finally(() => setIsLoading(false));
    }, [username]);

    useEffect(() => {
        if (!username) return;
        getProjects().then((all) =>
            setProjects(all.filter((p) => p.owner.username === username)),
        );
    }, [username]);

    useEffect(() => {
        if (!token || !profile) return;
        getOutgoingRequests().then((requests) => {
            const existing = requests.find((r) => r.recipient.id === profile.id);
            if ( existing && existing.status === 'PENDING') {
                setRequestStatus('pending');
            }
        });
    }, [token, profile]);

    async function handleSendRequest() {
        if (!profile) return;
        try {
            await sendContactRequest(profile.id);
            setRequestStatus('pending');
        } catch {
            // 
        }
    }

    if (isLoading) {
        return <p className="font-mono text-sm text-blueprint-text/60 p-8">Загрузка...</p>;
    }

    if (!profile) {
        return <p className="font-mono text-sm text-blueprint-text/60 p-8">Пользователь не найден</p>
    }

    const isOwnProfile = currentUser?.username === profile.username;
    const hasOwnContacts = currentUser?.phone || currentUser?.telegramUsername;

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8">
            <div className="flex justify-between items-start flex-wrap gap-3">
                <div>
                    <h1 className="font-display text-2xl">{profile.username}</h1>
                    {profile.bio && <p className="font-body text-blueprint-text/80 mt-2">{profile.bio}</p>}
                    {profile.githubUrl && (
                        <a
                            href={profile.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="font-mono text-sm text-status-progress hover:underline mt-2 inline-block"
                        >
                            GitHub →
                        </a>
                    )}
                </div>

                {isOwnProfile ? (
                    <Link
                        to="/edit-profile"
                        className="font-mono text-xs px-3 py-2 border border-blueprint-grid/50 rounded hover:border-status-progress"
                    >
                        Редактировать
                    </Link>
                ) : token ? (
                    hasOwnContacts ? (
                        <button onClick={handleSendRequest} disabled={requestStatus !== 'none'} className="font-mono text-xs px-3 py-2 border border-ststus-progress text-status-progress rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-status-progress/10">
                            {requestStatus === 'pending' ? 'Запрос отправлен' : 'Запросить контакты'}
                        </button>
                    ) : (
                        <Link to="/edit-profile" className="font-mono text-xs text-blueprint-text/60 underline">
                            Запролните свои контакты, чтобы запрашивать чужие
                        </Link>
                    )
                ) : null}
            </div>

            <h2 className="font-display text-lg mt-8 mb-4">Проекты</h2>
            {projects.length === 0 ? (
                <p className="font-mono text-sm text-blueprint-text/60">Пока нет проектов</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            )}
        </div>
    );
}
