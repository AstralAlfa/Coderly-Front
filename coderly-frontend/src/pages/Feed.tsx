import { useState, useEffect } from "react";
import { getProjects } from "../api/projects";
import { getTags } from "../api/tags";
import type { Project, Tag } from "../types";
import ProjectCard from "../components/ProjectCard";
import TagFilter from "../components/TagFilter";

export default function Feed() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getTags().then(setTags);
    }, []);

    useEffect(() => {
        let isMounted = true;

        async function loadProjects() {
            setIsLoading(true);

            try {
                const projectsData = await getProjects(
                    selectedTagId ? { tagId: selectedTagId } : undefined,
                );

                if (!isMounted) return;
                setProjects(projectsData);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadProjects();

        return () => {
            isMounted = false;
        };
    }, [selectedTagId]);

    return (
        <div className='max-w-5xl mx-auto px-4 sm:px-8 py-8'>
            <h1 className="font-display text-2xl sm:text-3xl mb-6">Проекты</h1>

            <div className="mb-8 overflow-x-auto pb-2">
                <TagFilter tags={tags} selectedTagId={selectedTagId} onSelect={setSelectedTagId} />
            </div>

            {isLoading ? (
                <p className="font-mono text-sm text-blueprint-text/60">Загрузка...</p>
            ) : projects.length === 0 ? (
                <p className="font-mono text-sm text-blueprint-text/60">Проектов пока нет</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            )}
        </div>
    );
}