import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProfile } from "../api/users";
import { getProjects } from "../api/projects";
import type { User, Project } from "../types";
import ProjectCard from "../components/ProjectCard";

export default function Profile() {
    const { username } = useParams<{ username: string }>();
    const [profile, setProfile] = useState<User | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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

    if (isLoading) {
        return <p className="font-mono text-sm text-blueprint-text/60 p-8">Загрузка...</p>;
    }

    if (!profile) {
        return <p className="font-mono text-sm text-blueprint-text/60 p-8">Пользователь не найден</p>
    }

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8">
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
