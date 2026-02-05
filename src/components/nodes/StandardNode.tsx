import React, { memo, useState, useRef, useEffect } from 'react';
import { NodeProps, Position } from '@xyflow/react';
import { getTypeStyles } from './nodeStyles';
import { EditableLabel } from '../common/EditableLabel';
import { BigHandle } from '../common/BigHandle';
import { ResizeHandles } from './ResizeHandles';
import { getIconForNode } from '../../utils/iconMapper';
import { useIconContext } from '../../context/IconContext';

const ARCHITECTURE_TYPES = ['service', 'database', 'client', 'queue', 'external', 'group'];

const StandardNode = ({ id, data, selected }: NodeProps) => {
    const { customIcons } = useIconContext();
    const typeStr = String(data.type);
    const styles = getTypeStyles(typeStr);

    const isArchitecture = ARCHITECTURE_TYPES.includes(typeStr.toLowerCase());
    const isClient = typeStr === 'client';
    const isTopic = typeStr === 'topic';
    const isStart = typeStr === 'start';
    const isEnd = typeStr === 'end';

    const selectionClass = selected
        ? `ring-2 ring-offset-2 ring-offset-background ring-ring`
        : '';

    // Icon Rendering Logic
    let iconContent;

    if (isArchitecture) {
        // --- Architecture Mode: Big Icons, Custom Icons, Mapper ---
        if (data.customIcon && typeof data.customIcon === 'string' && data.customIcon.startsWith('custom_')) {
            const svgContent = customIcons[data.customIcon];
            if (svgContent) {
                iconContent = (
                    <div
                        className="w-12 h-12 text-black dark:text-white [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current"
                        dangerouslySetInnerHTML={{ __html: svgContent }}
                    />
                );
            } else {
                // Fallback
                const Icon = getIconForNode(typeStr, String(data.label), String(data.description), data.customIcon as string, customIcons) || styles.icon;
                iconContent = React.cloneElement(Icon as React.ReactElement<any>, { className: "w-12 h-12 text-black dark:text-white" });
            }
        } else {
            const Icon = getIconForNode(typeStr, String(data.label), String(data.description), data.customIcon as string, customIcons) || styles.icon;
            iconContent = React.cloneElement(Icon as React.ReactElement<any>, { className: "w-12 h-12 text-black dark:text-white" });
        }
    } else {
        // --- Other Diagrams (Flowchart, Mindmap): Default Small Icons ---
        // Use the icon defined in nodeStyles directly. Do NOT use the mapper.
        iconContent = styles.icon;
        // Ensure it keeps its original size/classes from nodeStyles (usually w-5 h-5)
    }

    return (
        <>
            <ResizeHandles selected={selected} />

            <div className={`
      relative group transition-shadow duration-200 
      border-2 shadow-sm hover:shadow-lg
      ${styles.borderClass} ${styles.shape}
      ${selectionClass}
      ${isClient ? 'w-full h-full min-w-[120px] min-h-[120px]' : 'w-full h-full min-w-[140px] min-h-[50px] px-4 py-3'}
      ${isTopic ? 'border-opacity-80' : ''}
    `}>
                <div className={`absolute inset-0 ${styles.shape} overflow-hidden pointer-events-none`}>
                    <div className="absolute inset-0 bg-card" />
                    <div className={`absolute inset-0 ${styles.bgClass} opacity-15`} />
                </div>

                <BigHandle type="target" position={Position.Left} />

                {isArchitecture ? (
                    // --- Architecture Layout (Big Icon, Centered) ---
                    <div className={`relative z-10 flex flex-col h-full items-center justify-center p-2`}>
                        <div className="mb-3">
                            {iconContent}
                        </div>
                        <h3 className="text-sm font-bold leading-tight text-foreground w-full break-words whitespace-normal text-center">
                            <EditableLabel id={id} label={String(data.label)} className="text-center" />
                        </h3>
                        {data.description && (
                            <p className="text-[10px] text-muted-foreground mt-1 leading-snug w-full break-words whitespace-normal text-center">
                                {String(data.description)}
                            </p>
                        )}
                    </div>
                ) : (
                    // --- Standard Layout (Flowchart/Mindmap) ---
                    <div className={`relative z-10 flex flex-col h-full ${isStart || isEnd || isTopic ? 'items-center text-center justify-center' : 'items-start'}`}>
                        <div className="flex items-center gap-2 mb-2">
                            {iconContent}
                            {/* Optional: Show type for debugging or if desired, but usually hidden for cleaner look */}
                        </div>

                        <h3 className="text-sm font-bold leading-tight text-foreground w-full break-words whitespace-normal mt-[2px]">
                            <EditableLabel id={id} label={String(data.label)} className={isStart || isEnd || isTopic ? 'text-center' : 'text-left'} />
                        </h3>

                        {!isStart && !isEnd && !isTopic && data.description && (
                            <p className="text-[10px] text-muted-foreground mt-1 leading-snug w-full break-words whitespace-normal">
                                {String(data.description)}
                            </p>
                        )}
                    </div>
                )}

                <BigHandle type="source" position={Position.Right} />
            </div>
        </>
    );
};

export default memo(StandardNode);
