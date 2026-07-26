import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createProject } from "../api/projects";
import { getTags } from "../api/tags";
import type { Tag, ProjectStatus } from "../types";
import TagSelect from "../components/TagSelect";

export default function CreateProject() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<ProjectStatus>('IDEA');
    const [githubUrl, setGithubUrl] = useState('');
    const [demoUrl, setDemoUrl] = useState('');
    const [tags, setTags] = useState<Tag[]>([]);
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        getTags().then(setTags);
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        try {
            const project = await createProject({
                title,
                description,
                status,
                githubUrl: githubUrl || undefined,
                demoUrl: demoUrl || undefined,
                tagIds: selectedTagIds,
            });
            navigate(`/projects/${project.id}`);
        } catch (err: unknown) {
            const getErrorMessage = (e: unknown): string | undefined => {
                if (typeof e === 'string') return e;
                if (typeof e === 'object' && e !== null) {
                    // common axios error shape: { response: { data: { message: [...] } } }
                    const maybe = e as { response?: { data?: { message?: unknown } } };
                    const msg = maybe.response?.data?.message;
                    if (Array.isArray(msg) && typeof msg[0] === 'string') return msg[0];
                    if (typeof msg === 'string') return msg;
                }
                return undefined;
            };

            setError(getErrorMessage(err) || 'Ошибка создания проекта');
        }
    }

    return (
        <div className="max-w-xl mx-auto px-4 sm:px-8 py-8">
            <h1 className="font-display text-2xl mb-6">Новый проект</h1>
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
                    className="bg-blueprint-panel border border-blueprint-grid/50 rounded px-4 py-2 font-mono text-sm outline-none focus:border-status-progress"
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
                    Опубликовать
                </button>
            </form>
        </div>
    );
}
