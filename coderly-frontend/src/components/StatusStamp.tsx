import type { ProjectStatus } from '../types';

const statusConfig: Record<ProjectStatus, { label: string; color: string }> = {
    IDEA: { label: 'IDEA', color: 'text-status-idea border-status-idea' },
    IN_PROGRESS: { label: 'IN_PROGRESS', color: 'text-status-progress border-status-progress' },
    DONE: { label: 'DONE', color: 'text-status-done border-status-done' },
};

export default function StatusStamp({ status }: { status: ProjectStatus }) {
    const { label, color } = statusConfig[status];

    return (
        <span className={`font-mono text-xs px-2 py-1 border-2 rounded -rotate-3 inline-block ${color}`}>
            {label}
        </span>
    );
}
