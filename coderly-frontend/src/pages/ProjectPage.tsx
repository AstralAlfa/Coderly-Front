import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProject, deleteProject } from "../api/projects";
import type { Project } from "../types";
import { useAuth } from "../hooks/useAuth";
import StatusStamp from "../components/StatusStamp";

export default function ProjectPage() {
    const { id } = useParams<{ id: string }>();
    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!id) return;
        getProject(id)
            .then(setProject)
            .finally(() => setIsLoading(false));
    }, [id]);

    async function handleDelete() {
        if (!id) return;
        if (!confirm('Удалить проект?')) return;
        await deleteProject(id);
        navigate('/');
    }

    if (isLoading) {
        return <p className="font-mono text-sm text-blueprint-text/60 p-8">Загрузка...</p>;
    }

    if (!project) {
        return <p className="font-mono text-sm text-blueprint-text/60 p-8">Проект не найден</p>;
    }

    const isOwner = user?.id === project.owner.id;

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8">
            <div className="flex justify-between items-start gap-4 flex-wrap">
                <h1 className="font-display text-2xl sm:text-3xl">{project.title}</h1>
                <StatusStamp status={project.status} />
            </div>

            <p className="font-mono text-xs text-blueprint-text/50 mt-2">
                by {project.owner.username}
            </p>

            <p className="font-body text-blueprint-text/80 mt-6 whitespace-pre-wrap">
                {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mt-6">
                {project.tags.map((tag) => (
                    <span key={tag.id} className="font-mono text-xs text-blueprint-grid">
                        #{tag.name}
                    </span>
                ))}
            </div>

            <div className="flex flex-wrap gap-4 mt-6 font-mono text-sm">
                {project.githubUrl && (
                    <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-status-progress hover:underline"
                    >
                        GitHub →
                    </a>
                )}
                {project.demoUrl && (
                    <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-status-progress hover:underline"
                    >
                        Demo →
                    </a>
                )}
            </div>

            {isOwner && (
                <div className="flex gap-3 mt-8">
                    <button
                        onClick={() => navigate(`/projects/${project.id}/edit`)}
                        className="bg-blueprint-panel border border-blueprint-grid/50 rounded px-4 py-2 font-mono text-sm hover:border-status-progress"
                    >
                        Редактировать
                    </button>
                    <button
                        onClick={handleDelete}
                        className="bg-blueprint-stamp text-blueprint-text rounded px-4 py-2 font-mono text-sm hover:opacity-90"
                    >
                        Удалить
                    </button>
                </div>
            )}
        </div>
    );
}
