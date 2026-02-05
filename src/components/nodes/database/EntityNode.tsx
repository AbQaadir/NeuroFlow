import React, { memo, useCallback } from 'react';
import { NodeProps, Position, useReactFlow } from '@xyflow/react';
import { BaseNode } from '../base/BaseNode';
import { getTypeStyles } from '../nodeStyles';
import { EditableLabel } from '../../common/EditableLabel';
import { EditableField } from '../../common/EditableField';
import { BigHandle } from '../../common/BigHandle';
import { EntityAttribute } from '../../../types';
import { Key, GitFork, Plus, X } from 'lucide-react';

const EntityNode = ({ id, data, selected, ...props }: NodeProps) => {
    const { setNodes } = useReactFlow();
    const styles = getTypeStyles('entity');
    const attributes = (data.attributes as EntityAttribute[]) || [];

    const updateAttributes = useCallback((newAttributes: EntityAttribute[]) => {
        setNodes((nodes) => nodes.map((n) => {
            if (n.id === id) {
                return { ...n, data: { ...n.data, attributes: newAttributes } };
            }
            return n;
        }));
    }, [id, setNodes]);

    const addAttribute = (index?: number) => {
        const newAttr = { name: 'new_attr', dataType: 'string', visibility: '+' };
        if (typeof index === 'number') {
            const newAttrs = [...attributes];
            newAttrs.splice(index + 1, 0, newAttr);
            updateAttributes(newAttrs);
        } else {
            updateAttributes([...attributes, newAttr]);
        }
    };

    const deleteAttribute = (index: number) => {
        updateAttributes(attributes.filter((_, i) => i !== index));
    };

    return (
        <BaseNode
            id={id}
            data={data}
            selected={selected}
            {...props}
            minWidth={200}
            minHeight={200} // Increased height as requested
            handles={{}} // Disable default handles
            className={`p-0 overflow-hidden bg-card ${styles.borderClass} ${styles.shape}`}
        >
            {/* Background */}
            <div className={`absolute inset-0 ${styles.shape} overflow-hidden pointer-events-none`}>
                <div className="absolute inset-0 bg-card" />
                <div className={`absolute inset-0 ${styles.bgClass} opacity-15`} />
            </div>

            {/* Content Container */}
            <div className="relative z-10 flex flex-col h-full">
                {/* Header */}
                <div className={`px-3 py-2 border-b ${styles.borderClass} ${styles.bgClass} flex items-center gap-2`}>
                    <div className={styles.colorClass}>{styles.icon}</div>
                    <div className="text-xs font-bold text-foreground truncate flex-1">
                        <EditableLabel id={id} label={String(data.label)} className="text-left" />
                    </div>
                </div>

                {/* Body (Columns) */}
                <div className="text-[10px] font-mono divide-y divide-border/50 flex-1 overflow-y-auto">
                    {attributes.length > 0 ? (
                        attributes.map((attr, idx) => (
                            <div key={idx} className="px-3 py-1.5 flex justify-between items-center hover:bg-muted/50 group/item">
                                <div className="flex items-center gap-1.5 overflow-hidden flex-1">
                                    <button
                                        onClick={() => {
                                            const newAttrs = [...attributes];
                                            newAttrs[idx] = { ...attr, isPK: !attr.isPK };
                                            updateAttributes(newAttrs);
                                        }}
                                        className={`hover:bg-muted rounded p-0.5 ${attr.isPK ? 'opacity-100' : 'opacity-30 hover:opacity-100'}`}
                                        title="Toggle PK"
                                    >
                                        <Key className={`w-3 h-3 ${attr.isPK ? 'text-yellow-500' : 'text-muted-foreground'}`} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            const newAttrs = [...attributes];
                                            newAttrs[idx] = { ...attr, isFK: !attr.isFK };
                                            updateAttributes(newAttrs);
                                        }}
                                        className={`hover:bg-muted rounded p-0.5 ${attr.isFK ? 'opacity-100' : 'opacity-30 hover:opacity-100'}`}
                                        title="Toggle FK"
                                    >
                                        <GitFork className={`w-3 h-3 rotate-90 ${attr.isFK ? 'text-blue-400' : 'text-muted-foreground'}`} />
                                    </button>

                                    <EditableField
                                        value={attr.name}
                                        onChange={(val) => {
                                            const newAttrs = [...attributes];
                                            newAttrs[idx] = { ...attr, name: val };
                                            updateAttributes(newAttrs);
                                        }}
                                        className={`font-bold w-full ${attr.isPK ? 'text-foreground' : ''}`}
                                    />
                                </div>
                                <div className="flex items-center gap-1">
                                    <EditableField
                                        value={attr.dataType}
                                        onChange={(val) => {
                                            const newAttrs = [...attributes];
                                            newAttrs[idx] = { ...attr, dataType: val };
                                            updateAttributes(newAttrs);
                                        }}
                                        className="text-muted-foreground text-right w-[60px]"
                                    />
                                    <button
                                        onClick={() => deleteAttribute(idx)}
                                        className="opacity-0 group-hover/item:opacity-100 p-0.5 hover:bg-destructive/10 text-destructive rounded transition-opacity"
                                        title="Delete Attribute"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                    <button
                                        onClick={() => addAttribute(idx)}
                                        className="opacity-0 group-hover/item:opacity-100 p-0.5 hover:bg-muted text-muted-foreground rounded transition-opacity"
                                        title="Insert Attribute Below"
                                    >
                                        <Plus className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="px-3 py-4 text-center text-muted-foreground italic">No columns defined</div>
                    )}
                </div>

                {/* Add Attribute Button (Footer) */}
                <div
                    className="px-3 py-2 bg-muted/30 hover:bg-muted/50 cursor-pointer flex justify-center opacity-0 group-hover:opacity-100 transition-opacity border-t border-border/50"
                    onClick={() => addAttribute()}
                >
                    <Plus className="w-4 h-4 text-muted-foreground" />
                </div>
            </div>

            {/* Handles - Direct children of BaseNode, positioned on border */}
            <BigHandle type="target" position={Position.Left} className="top-8" />
            <BigHandle type="source" position={Position.Right} className="top-8" />
        </BaseNode>
    );
};

export default memo(EntityNode);
