import React, { memo } from 'react';
import { NodeResizer, NodeResizeControl, ResizeControlVariant } from '@xyflow/react';

interface ResizeHandlesProps {
    selected: boolean;
    minWidth?: number;
    minHeight?: number;
    keepAspectRatio?: boolean;
}

export const ResizeHandles = memo(({ selected, minWidth = 100, minHeight = 50, keepAspectRatio = false }: ResizeHandlesProps) => {
    return (
        <>
            <NodeResizer
                isVisible={selected}
                minWidth={minWidth}
                minHeight={minHeight}
                keepAspectRatio={keepAspectRatio}
                lineStyle={{ border: '1px solid #3b82f6' }}
                handleStyle={{ width: 8, height: 8, borderRadius: 2, border: '1px solid #3b82f6', background: 'white' }}
            />

            {/* Invisible Hit Areas for Easier Resizing */}
            {selected && (
                <>
                    <NodeResizeControl
                        variant={"line" as ResizeControlVariant}
                        position="top"
                        style={{
                            height: 20,
                            width: '100%',
                            top: -10,
                            left: 0,
                            position: 'absolute',
                            cursor: 'ns-resize',
                            background: 'transparent',
                            border: 'none',
                            zIndex: 10
                        }}
                    />
                    <NodeResizeControl
                        variant={"line" as ResizeControlVariant}
                        position="bottom"
                        style={{
                            height: 20,
                            width: '100%',
                            bottom: -10,
                            left: 0,
                            position: 'absolute',
                            cursor: 'ns-resize',
                            background: 'transparent',
                            border: 'none',
                            zIndex: 10
                        }}
                    />
                    <NodeResizeControl
                        variant={"line" as ResizeControlVariant}
                        position="left"
                        style={{
                            width: 20,
                            height: '100%',
                            left: -10,
                            top: 0,
                            position: 'absolute',
                            cursor: 'ew-resize',
                            background: 'transparent',
                            border: 'none',
                            zIndex: 10
                        }}
                    />
                    <NodeResizeControl
                        variant={"line" as ResizeControlVariant}
                        position="right"
                        style={{
                            width: 20,
                            height: '100%',
                            right: -10,
                            top: 0,
                            position: 'absolute',
                            cursor: 'ew-resize',
                            background: 'transparent',
                            border: 'none',
                            zIndex: 10
                        }}
                    />
                </>
            )}
        </>
    );
});
