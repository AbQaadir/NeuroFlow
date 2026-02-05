import React, { useState, useMemo, useRef } from 'react';
import { Search, X, Cloud, Code, Box, Grid, ChevronDown, ChevronRight, Upload, Trash2 } from 'lucide-react';
import * as SiIcons from 'react-icons/si';
import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';
import { VscAzure } from "react-icons/vsc";
import { useIconContext } from '../../context/IconContext';

interface IconPanelProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectIcon: (iconKey: string) => void;
    currentIcon?: string;
}

// Combine all icons into a searchable map
const ALL_ICONS: Record<string, React.ComponentType> = {
    ...SiIcons,
    ...FaIcons,
    ...MdIcons,
    VscAzure
};

const CATEGORIES = [
    { id: 'custom', label: 'Custom Icons', icon: Upload },
    { id: 'cloud', label: 'Cloud Providers', icon: Cloud },
    { id: 'tech', label: 'Technology & Tools', icon: Code },
    { id: 'general', label: 'General & Shapes', icon: Box },
];

export const IconPanel = ({ isOpen, onClose, onSelectIcon, currentIcon }: IconPanelProps) => {
    const { customIcons, addCustomIcon, removeCustomIcon } = useIconContext();
    const [search, setSearch] = useState('');
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
        'custom': false,
        'cloud': false,
        'tech': false,
        'general': false
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const toggleCategory = (id: string) => {
        setExpandedCategories(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        Array.from(files).forEach(file => {
            if (file.type === 'image/svg+xml') {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const content = e.target?.result as string;
                    // Use filename as key (sanitize it)
                    const key = `custom_${file.name.replace(/[^a-zA-Z0-9]/g, '_')}`;
                    addCustomIcon(key, content);
                };
                reader.readAsText(file);
            }
        });

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const getIconsForCategory = (categoryId: string) => {
        if (categoryId === 'custom') {
            return Object.keys(customIcons);
        }
        return Object.keys(ALL_ICONS).filter(key => {
            if (categoryId === 'cloud') {
                return key.startsWith('SiAmazon') || key.startsWith('SiGoogle') || key.startsWith('Vsc') || key.startsWith('FaCloud');
            }
            if (categoryId === 'tech') {
                return key.startsWith('Si') && !key.startsWith('SiAmazon') && !key.startsWith('SiGoogle');
            }
            if (categoryId === 'general') {
                return key.startsWith('Fa') || key.startsWith('Md');
            }
            return false;
        });
    };

    const filteredIcons = useMemo(() => {
        const lowerSearch = search.toLowerCase();

        const result: Record<string, string[]> = {};

        CATEGORIES.forEach(cat => {
            const icons = getIconsForCategory(cat.id);
            const filtered = icons.filter(key => {
                if (!lowerSearch) return true;
                return key.toLowerCase().includes(lowerSearch);
            });
            result[cat.id] = filtered;
        });

        return result;
    }, [search, customIcons]); // Add customIcons dependency

    return (
        <aside
            className={`
                ${isOpen ? 'w-80 border-l' : 'w-0 border-none'} 
                bg-sidebar text-sidebar-foreground border-sidebar-border 
                h-full shadow-xl transition-all duration-300 ease-in-out z-50 overflow-hidden
            `}
        >
            <div className="w-80 h-full flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-sidebar-border flex items-center justify-between shrink-0">
                    <h2 className="font-semibold text-lg">Select Icon</h2>
                    <button onClick={onClose} className="p-1 hover:bg-sidebar-accent rounded-md text-muted-foreground hover:text-sidebar-foreground transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Search */}
                <div className="p-4 pb-2 shrink-0">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search icons..."
                            className="w-full pl-9 pr-4 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Accordion List */}
                <div className="flex-1 overflow-y-auto p-2">
                    {CATEGORIES.map(cat => {
                        const icons = filteredIcons[cat.id] || [];
                        const isExpanded = expandedCategories[cat.id];

                        // Hide category if searching and no matches (except custom if we want to show upload button always? let's hide if no matches for consistency)
                        if (search && icons.length === 0 && cat.id !== 'custom') return null;
                        if (search && icons.length === 0 && cat.id === 'custom') return null; // Also hide custom if searching and no match

                        return (
                            <div key={cat.id} className="mb-1">
                                <button
                                    onClick={() => toggleCategory(cat.id)}
                                    className="w-full flex items-center justify-between p-2 rounded-md hover:bg-sidebar-accent text-sm font-medium transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        {isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                                        <cat.icon className="w-4 h-4 text-muted-foreground" />
                                        <span>{cat.label}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">{icons.length}</span>
                                </button>

                                {isExpanded && (
                                    <div className="p-2 pl-4 animate-in slide-in-from-top-2 duration-200">


                                        <div className="grid grid-cols-4 gap-2">
                                            {icons.slice(0, 100).map(key => {
                                                // Check if it's a custom icon
                                                const isCustom = key.startsWith('custom_');
                                                const IconComponent = isCustom ? null : ALL_ICONS[key] as React.ElementType;
                                                const customSvgContent = isCustom ? customIcons[key] : null;

                                                return (
                                                    <div key={key} className="relative group">
                                                        <button
                                                            onClick={() => onSelectIcon(key)}
                                                            className={`w-full aspect-square flex flex-col items-center justify-center p-2 rounded-md border transition-all hover:bg-sidebar-accent hover:border-primary
                                                                ${currentIcon === key ? 'border-primary bg-sidebar-accent ring-2 ring-primary ring-offset-1' : 'border-sidebar-border bg-card text-sidebar-foreground'}`}
                                                            title={key}
                                                        >
                                                            {isCustom && customSvgContent ? (
                                                                <div
                                                                    className="w-6 h-6 mb-1 [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current"
                                                                    dangerouslySetInnerHTML={{ __html: customSvgContent }}
                                                                />
                                                            ) : (
                                                                IconComponent && <IconComponent className="w-6 h-6 mb-1" />
                                                            )}
                                                            <span className="text-[8px] text-muted-foreground truncate w-full text-center">
                                                                {key.replace(/^(Si|Fa|Md|custom_)/, '')}
                                                            </span>
                                                        </button>
                                                        {isCustom && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    removeCustomIcon(key);
                                                                }}
                                                                className="absolute -top-1 -right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                                                title="Delete Icon"
                                                            >
                                                                <Trash2 className="w-3 h-3" />
                                                            </button>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                            {icons.length > 100 && (
                                                <div className="col-span-4 text-center text-xs text-muted-foreground py-2">
                                                    +{icons.length - 100} more...
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {Object.values(filteredIcons).every(list => list.length === 0) && (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                            No icons found.
                        </div>
                    )}
                </div>


                {/* Footer: Import SVG Button */}
                <div className="p-4 border-t border-sidebar-border shrink-0">
                    <input
                        type="file"
                        accept=".svg"
                        multiple
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm font-medium transition-colors"
                    >
                        <Upload className="w-4 h-4" />
                        Import SVG
                    </button>
                </div>
            </div>
        </aside >
    );
};
