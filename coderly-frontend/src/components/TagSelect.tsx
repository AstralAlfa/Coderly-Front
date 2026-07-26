import type { Tag } from '../types';

interface Props {
    tags: Tag[],
    selectedIds: string[];
    onChange: (ids: string[]) => void;
}

export default function TagSelect({ tags, selectedIds, onChange }: Props) {
    function toggle(id: string) {
        if (selectedIds.includes(id)) {
            onChange(selectedIds.filter((tagId) => tagId !== id));
        } else {
            onChange([...selectedIds, id]);
        }
    }

    return (
        <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
                <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggle(tag.id)}
                    className={`font-mono text-xs px-3 py-1 rounded border ${
                        selectedIds.includes(tag.id)
                            ? 'border-status-progress text-status-progress bg-status-progress/10'
                            : 'border-blueprint-grid/50 text-blueprint-text/60'
                    }`}
                >
                    #{tag.name}
                </button>
            ))}
        </div>
    );
}
