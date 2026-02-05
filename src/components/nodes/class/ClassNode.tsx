import React, { memo, useCallback } from 'react';
import { NodeProps, Position, useReactFlow } from '@xyflow/react';
import { BaseNode } from '../base/BaseNode';
import { getTypeStyles } from '../nodeStyles';
import { EditableLabel } from '../../common/EditableLabel';
import { EditableField } from '../../common/EditableField';
import { BigHandle } from '../../common/BigHandle';
import { VisibilityIcon } from '../../common/VisibilityIcon';
import { EntityAttribute, ClassMethod } from '../../../types';
import { Plus, X } from 'lucide-react';

const ClassNode = ({ id, data, selected, ...props }: NodeProps) => {
    const { setNodes } = useReactFlow();
    const styles = getTypeStyles('class');
    const attributes = (data.attributes as EntityAttribute[]) || [];
    const methods = (data.methods as ClassMethod[]) || [];

    const updateAttributes = useCallback((newAttributes: EntityAttribute[]) => {
        setNodes((nodes) => nodes.map((n) => {
            if (n.id === id) {
                return { ...n, data: { ...n.data, attributes: newAttributes } };
            }
            return n;
        }));
    }, [id, setNodes]);

    const updateMethods = useCallback((newMethods: ClassMethod[]) => {
        setNodes((nodes) => nodes.map((n) => {
            if (n.id === id) {
                return { ...n, data: { ...n.data, methods: newMethods } };
            }
            return n;
        }));
    }, [id, setNodes]);

    const addAttribute = () => {
        updateAttributes([...attributes, { name: 'new_attr', dataType: 'string', visibility: '+' }]);
    };

    const addMethod = () => {
        updateMethods([...methods, { name: 'newMethod', returnType: 'void', visibility: '+' }]);
    };

    const deleteAttribute = (index: number) => {
        updateAttributes(attributes.filter((_, i) => i !== index));
    };

    const deleteMethod = (index: number) => {
        updateMethods(methods.filter((_, i) => i !== index));
    };

    return (
        <BaseNode
            id={id}
            data={data}
            selected={selected}
            {...props}
            minWidth={220}
            minHeight={200} // Increased height
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
                {/* Header: Class Name */}
                <div className={`px-3 py-2 border-b-2 ${styles.borderClass} ${styles.bgClass} flex flex-col items-center justify-center text-center`}>
                    {data.type === 'interface' && <span className="text-[9px] italic text-muted-foreground">&lt;&lt;interface&gt;&gt;</span>}
                    <div className="text-xs font-bold text-foreground truncate w-full">
                        <EditableLabel id={id} label={String(data.label)} />
                    </div>
                </div>

                {/* Attributes Compartment */}
                <div className={`border-b ${styles.borderClass} text-[10px] font-mono flex flex-col`}>
                    {attributes.length > 0 ? (
                        attributes.map((attr, idx) => (
                            <div key={idx} className="px-2 py-1 flex items-center gap-1.5 hover:bg-muted/50 group/item">
                                <div className="cursor-pointer" onClick={() => {
                                    const newAttrs = [...attributes];
                                    const vis = attr.visibility === '+' ? '-' : attr.visibility === '-' ? '#' : '+';
                                    newAttrs[idx] = { ...attr, visibility: vis };
                                    updateAttributes(newAttrs);
                                }}>
                                    <VisibilityIcon vis={attr.visibility} />
                                </div>
                                <div className="flex-1 flex items-center gap-1">
                                    <EditableField
                                        value={attr.name}
                                        onChange={(val) => {
                                            const newAttrs = [...attributes];
                                            newAttrs[idx] = { ...attr, name: val };
                                            updateAttributes(newAttrs);
                                        }}
                                        className="font-semibold flex-1"
                                    />
                                    <span className="text-muted-foreground">:</span>
                                    <EditableField
                                        value={attr.dataType}
                                        onChange={(val) => {
                                            const newAttrs = [...attributes];
                                            newAttrs[idx] = { ...attr, dataType: val };
                                            updateAttributes(newAttrs);
                                        }}
                                        className="text-muted-foreground w-[50px]"
                                    />
                                </div>
                                <button
                                    onClick={() => deleteAttribute(idx)}
                                    className="opacity-0 group-hover/item:opacity-100 p-0.5 hover:bg-destructive/10 text-destructive rounded transition-opacity"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="px-2 py-2 text-center text-muted-foreground italic opacity-50">--</div>
                    )}
                    <div
                        className="px-2 py-1 bg-muted/30 hover:bg-muted/50 cursor-pointer flex justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={addAttribute}
                        title="Add Attribute"
                    >
                        <Plus className="w-3 h-3 text-muted-foreground" />
                    </div>
                </div>

                {/* Methods Compartment */}
                <div className="text-[10px] font-mono pb-1 flex-1 flex flex-col">
                    {methods.length > 0 ? (
                        methods.map((method, idx) => (
                            <div key={idx} className="px-2 py-1 flex items-center gap-1.5 hover:bg-muted/50 group/item">
                                <div className="cursor-pointer" onClick={() => {
                                    const newMethods = [...methods];
                                    const vis = method.visibility === '+' ? '-' : method.visibility === '-' ? '#' : '+';
                                    newMethods[idx] = { ...method, visibility: vis };
                                    updateMethods(newMethods);
                                }}>
                                    <VisibilityIcon vis={method.visibility} />
                                </div>
                                <div className="flex-1 flex items-center gap-1">
                                    <EditableField
                                        value={method.name}
                                        onChange={(val) => {
                                            const newMethods = [...methods];
                                            newMethods[idx] = { ...method, name: val };
                                            updateMethods(newMethods);
                                        }}
                                        className="font-semibold italic flex-1"
                                    />
                                    <span className="text-muted-foreground">():</span>
                                    <EditableField
                                        value={method.returnType}
                                        onChange={(val) => {
                                            const newMethods = [...methods];
                                            newMethods[idx] = { ...method, returnType: val };
                                            updateMethods(newMethods);
                                        }}
                                        className="text-muted-foreground w-[50px]"
                                    />
                                </div>
                                <button
                                    onClick={() => deleteMethod(idx)}
                                    className="opacity-0 group-hover/item:opacity-100 p-0.5 hover:bg-destructive/10 text-destructive rounded transition-opacity"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="px-2 py-2 text-center text-muted-foreground italic opacity-50">--</div>
                    )}
                    <div
                        className="px-2 py-1 bg-muted/30 hover:bg-muted/50 cursor-pointer flex justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={addMethod}
                        title="Add Method"
                    >
                        <Plus className="w-3 h-3 text-muted-foreground" />
                    </div>
                </div>
            </div>

            {/* Handles - Direct children of BaseNode, positioned on border */}
            <BigHandle type="target" position={Position.Left} className="top-8" />
            <BigHandle type="source" position={Position.Right} className="top-8" />
        </BaseNode>
    );
};

export default memo(ClassNode);
