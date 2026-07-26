import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProject, updateProject } from "../api/projects";
import { getTags } from "../api/tags";
import type { Tag, ProjectStatus } from "../types";
import { useAuth } from "../hooks/useAuth";
import TagSelect from "../components/TagSelect";

export default function EditProject() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<ProjectStatus>('IDEA');
    const [githubUrl, setGithubUrl] = useState('');
    const [demoUrl, setDemoUrl] = useState('');
    const [tags, setTags] = useState<Tag[]>([]);
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        Promise.all([getProject(id), getTags()]).then(([project, allTags]) => {
            if (user && project.owner.id !== user.id) {
                navigate(`/projects/${id}`);
                return;
            }

            setTitle(project.title);
            setDescription(project.description);
            setStatus(project.status);
            setGithubUrl(project.githubUrl || '');
            setDemoUrl(project.demoUrl || '');
            setSelectedTagIds(project.tags.map((t) => t.id));
            setTags(allTags);
            setIsLoading(false);
        });
    }, [id, user, navigate]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if(!id) return;
        setError('');
        try {
            await updateProject(id, {
                title,
                description,
                status,
                githubUrl: githubUrl || undefined,
                demoUrl: demoUrl || undefined,
                tagIds: selectedTagIds,
            });
            navigate(`/projects/${id}`);
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string[] } } };
            setError(error?.response?.data?.message?.[0] || 'Ошибка обновления проекта');
        }
    }

    if (isLoading) {
        return <p className="font-mono text-sm text-blueprint-text/60 p-8">Загрузка...</p>
    }

    return (
        <div className="max-w-xl mx-auto px-4 sm:px-8 py-8">
            <h1 className="font-display text-2xl mb-6">Редактировать проект</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Название"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-blueprint-panel border border-blueprint-grid/50 rounded px-4 py-2 font-body outline-none focus:border-status-progress"
                    required
                />
                <textarea
                    placeholder="Описание"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    className="bg-blueprint-panel border border-blueprint-grid/50 rounded px-4 py-2 font-body outline-none focus:border-status-progress resize-none"
                    required
                />
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                    className="bg-blueprint-panel border border-blueprint-grid/50 rounded px-4 py-2 font-body outline-none focus:border-status-progress"
                >
                    <option value="IDEA">Идея</option>
                    <option value="IN_PROGRESS">В разработке</option>
                    <option value="DONE">Готово</option>
                </select>
                <input
                    type="url"
                    placeholder="Ссылка на GitHub"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="bg-blueprint-panel border border-blueprint-grid/50 rounded px-4 py-2 font-body outline-none focus:border-status-progress"
                />
                <input
                    type="url"
                    placeholder="Ссылка на продукт"
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    className="bg-blueprint-panel border border-blueprint-grid/50 rounded px-4 py-2 font-body outline-none focus:border-status-progress"
                />

                <div>
                    <p className="font-mono text-xs text-blueprint-text/60 mb-2">Теги (стек)</p>
                    <TagSelect tags={tags} selectedIds={selectedTagIds} onChange={setSelectedTagIds} />
                </div>

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
