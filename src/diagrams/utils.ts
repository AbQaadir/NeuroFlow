
export const calculateDimensions = (
    label: string = '',
    description: string = '',
    baseWidth: number = 180,
    baseHeight: number = 80,
    padding: number = 30
) => {
    // Approximate char width/height
    const charWidth = 8;
    const lineHeight = 20;
    const labelCharCount = label.length;
    const descCharCount = description.length;

    // Estimate label lines (wrapping at ~20 chars for standard nodes)
    // We want the node to grow in width if text is long, but also wrap.
    // Let's try a dynamic approach:
    // If text is short, keep base width.
    // If text is long, increase width up to a max, then wrap.

    const maxLineWidth = 40; // chars
    const targetWidth = Math.min(Math.max(labelCharCount, 20), maxLineWidth) * charWidth + padding;

    const labelLines = Math.ceil(labelCharCount / maxLineWidth);
    const descLines = Math.ceil(descCharCount / maxLineWidth);

    const totalLines = labelLines + descLines;
    const targetHeight = (totalLines * lineHeight) + baseHeight; // Add base height for padding/icons

    return {
        width: Math.max(baseWidth, targetWidth),
        height: Math.max(baseHeight, targetHeight)
    };
};

export const calculateWidth = (labels: string[], baseWidth: number = 200) => {
    const charWidth = 8;
    const padding = 30;
    const maxLen = Math.max(...labels.map(l => l.length), 0);
    return Math.max(baseWidth, (maxLen * charWidth) + padding);
};
