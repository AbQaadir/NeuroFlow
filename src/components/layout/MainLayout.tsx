import React, { ReactNode } from 'react';

interface MainLayoutProps {
    sidebar: ReactNode;
    canvas: ReactNode;
    rightPanel?: ReactNode;
}

export const MainLayout = ({ sidebar, canvas, rightPanel }: MainLayoutProps) => {
    return (
        <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground transition-colors duration-300">
            {sidebar}
            {canvas}
            {rightPanel}
        </div>
    );
};
