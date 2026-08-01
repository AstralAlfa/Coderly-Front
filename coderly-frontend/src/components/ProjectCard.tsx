import { Link } from 'react-router-dom';
import type { Project } from '../types';
import StatusStamp from './StatusStamp';

export default function ProjectCard({ project }: { project: Project }) {
    return (
        <Link to={`/projects/${project.id}`} className="block bg-blueprint-panel border border-blueprint-grid/50 rounded-lg p5 hover:border-status-progress transition-colors">
            <div className="flex justify-between items-start gap-3">
                <h3 className="font-display text-lg text-blueprint-text">{project.title}</h3>
                <StatusStamp status={project.status} />
            </div>
            <p className="font-body text-sm text-blueprint-text/70 mt-2 line-clamp-2">
                {project.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
                {project.tags.map((tag) => (
                    <span key={tag.id} className="font-mono text-xs text-blueprint-grid">
                        #{tag.name}
                    </span>
                ))}
            </div>
            <div className="font-mono text-xs text-blueprint-text/50 mt-3">
                Автор: {project.owner.username}
            </div>
        </Link>
    );
}
