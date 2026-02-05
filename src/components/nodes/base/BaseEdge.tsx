import React, { useState, useEffect } from 'react';
import {
    BaseEdge as ReactFlowBaseEdge,
    EdgeLabelRenderer,
    EdgeProps,
    getBezierPath,
    getSmoothStepPath,
    getStraightPath,
    useReactFlow,
} from '@xyflow/react';

// Helper to generate a path with rounded corners
const getRoundedPath = (
    sourceX: number,
    sourceY: number,
    targetX: number,
    targetY: number,
    bendPoints: { x: number; y: number }[],
    radius: number = 20
): string => {
    const points = [{ x: sourceX, y: sourceY }, ...bendPoints, { x: targetX, y: targetY }];
    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length - 1; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const next = points[i + 1];

        // Vectors
        const v1 = { x: curr.x - prev.x, y: curr.y - prev.y };
        const v2 = { x: next.x - curr.x, y: next.y - curr.y };

        const len1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
        const len2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);

        // Clamp radius to half of the shortest adjacent segment to prevent weird overlaps
        const r = Math.min(radius, len1 / 2, len2 / 2);

        // Start of curve (backing up from corner)
        const startX = curr.x - (v1.x / len1) * r;
        const startY = curr.y - (v1.y / len1) * r;

        // End of curve (moving forward from corner)
        const endX = curr.x + (v2.x / len2) * r;
        const endY = curr.y + (v2.y / len2) * r;

        path += ` L ${startX} ${startY}`;
        path += ` Q ${curr.x} ${curr.y} ${endX} ${endY}`;
    }

    path += ` L ${targetX} ${targetY}`;
    return path;
};

export const BaseEdge = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    data,
    selected,
}: EdgeProps) => {
    const { setEdges } = useReactFlow();
    const [isEditing, setIsEditing] = useState(false);
    const [label, setLabel] = useState((data?.label as string) || '');

    useEffect(() => {
        setLabel((data?.label as string) || '');
    }, [data?.label]);

    const pathType = data?.pathType || 'bezier';
    const bendPoints = data?.bendPoints as { x: number; y: number }[] | undefined;

    let edgePath = '';
    let labelX = 0;
    let labelY = 0;

    if (bendPoints && Array.isArray(bendPoints)) {
        // Use custom rounded path generation
        edgePath = getRoundedPath(sourceX, sourceY, targetX, targetY, bendPoints, 20);

        // Simple heuristic for label center - midpoint of source/target or midpoint of path
        labelX = (sourceX + targetX) / 2;
        labelY = (sourceY + targetY) / 2;
    } else if (pathType === 'smoothstep') {
        [edgePath, labelX, labelY] = getSmoothStepPath({
            sourceX,
            sourceY,
            sourcePosition,
            targetX,
            targetY,
            targetPosition,
        });
    } else if (pathType === 'step') {
        [edgePath, labelX, labelY] = getSmoothStepPath({
            sourceX,
            sourceY,
            sourcePosition,
            targetX,
            targetY,
            targetPosition,
            borderRadius: 0,
        });
    } else if (pathType === 'straight') {
        [edgePath, labelX, labelY] = getStraightPath({
            sourceX,
            sourceY,
            targetX,
            targetY,
        });
    } else {
        [edgePath, labelX, labelY] = getBezierPath({
            sourceX,
            sourceY,
            sourcePosition,
            targetX,
            targetY,
            targetPosition,
        });
    }

    const onEdgeClick = (evt: React.MouseEvent) => {
        evt.stopPropagation();
    };

    const onEdgeDoubleClick = (evt: React.MouseEvent) => {
        evt.stopPropagation();
        setIsEditing(true);
    };

    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        setLabel(evt.target.value);
    };

    const handleBlur = () => {
        setIsEditing(false);
        setEdges((edges) =>
            edges.map((edge) => {
                if (edge.id === id) {
                    return { ...edge, data: { ...edge.data, label: label }, label: label };
                }
                return edge;
            })
        );
    };

    const handleKeyDown = (evt: React.KeyboardEvent) => {
        if (evt.key === 'Enter') {
            handleBlur();
        }
    };

    // Dynamic Color Logic: White in Dark Mode, Black in Light Mode
    // We can use CSS variables or classes. Tailwind 'stroke-black dark:stroke-white' might not work directly on style object if not using class.
    // But BaseEdge accepts style.
    // Better to use a class on the path if ReactFlowBaseEdge supports className.
    // ReactFlowBaseEdge supports style and className? Yes.

    // However, React Flow BaseEdge usually takes style for stroke.
    // Let's try using className for the stroke color.

    return (
        <>
            <ReactFlowBaseEdge
                path={edgePath}
                markerEnd={markerEnd}
                style={{
                    ...style,
                    strokeWidth: 2,
                }}
                className="stroke-black dark:stroke-white" // Dynamic color
            />
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        fontSize: 12,
                        pointerEvents: 'all',
                        zIndex: 1000,
                    }}
                    className="nodrag nopan"
                >
                    {isEditing ? (
                        <input
                            value={label}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            className="bg-background border border-primary/50 outline-none text-center rounded-sm px-1 text-xs min-w-[50px]"
                        />
                    ) : (
                        <div
                            onDoubleClick={onEdgeDoubleClick}
                            className={`px-2 py-1 rounded-md border border-transparent hover:border-border transition-colors cursor-pointer text-black dark:text-white
                            ${label ? 'bg-white dark:bg-black shadow-sm' : 'bg-transparent hover:bg-white/50 dark:hover:bg-black/50'} 
                            ${selected ? 'border-primary/50' : ''}`}
                        >
                            {label || <span className="opacity-0 hover:opacity-100 transition-opacity text-[10px] italic text-muted-foreground">Add label</span>}
                        </div>
                    )}
                </div>
            </EdgeLabelRenderer>
        </>
    );
};
