import type { Tag } from '../types';

interface Props {
    tags: Tag[],
    selectedTagId: string | null;
    onSelect: (tagId: string | null) => void;
}

export default function TagFilter({ tags, selectedTagId, onSelect }: Props) {
    return (
        <div className="flex flex-wrap gap-2">
            <button
                onClick={() => onSelect(null)}
                className={`font-mono text-xs px-3 py-1 rounded border ${
                    selectedTagId === null
                        ? 'border-status-progress text-status-progress'
                        : 'border-blueprint-grid/50 text-blueprint-text/60'
                }`}
            >
                all
            </button>
            {tags.map((tag) => (
                <button
                    key={tag.id}
                    onClick={() => onSelect(tag.id)}
                    className={`font-mono text-xs px-3 py-1 rounded border ${
                        selectedTagId === null
                            ? 'border-status-progress text-status-progress'
                            : 'border-blueprint-grid/50 text-blueprint-text/60'
                    }`}
                >
                    #{tag.name}
                </button>
            ))}
        </div>
    );
}
