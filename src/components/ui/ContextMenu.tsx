import React, { useEffect, useRef } from 'react';

interface ContextMenuProps {
    position: { x: number; y: number };
    onClose: () => void;
    actions: {
        label: string;
        onClick: () => void;
        icon?: React.ReactNode;
        danger?: boolean;
    }[];
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ position, onClose, actions }) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    return (
        <div
            ref={menuRef}
            className="fixed z-50 bg-popover border border-border shadow-md rounded-md overflow-hidden min-w-[160px] animate-in fade-in zoom-in-95 duration-100"
            style={{ top: position.y, left: position.x }}
        >
            <div className="p-1 flex flex-col gap-0.5">
                {actions.map((action, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            action.onClick();
                            onClose();
                        }}
                        className={`
                            flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm w-full text-left
                            hover:bg-accent hover:text-accent-foreground transition-colors
                            ${action.danger ? 'text-destructive hover:text-destructive' : 'text-popover-foreground'}
                        `}
                    >
                        {action.icon && <span className="w-4 h-4">{action.icon}</span>}
                        {action.label}
                    </button>
                ))}
            </div>
        </div>
    );
};
