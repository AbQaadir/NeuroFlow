import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { MainLayout } from './components/layout/MainLayout';
import Sidebar from './components/panels/Sidebar';
import DiagramCanvas from './components/canvas/DiagramCanvas';
import { useDiagramState } from './hooks/useDiagramState';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { IconPanel } from './components/panels/IconPanel';
import { IconProvider } from './context/IconContext';
import { FeedbackRating } from './components/overlay/FeedbackRating';

const NeuroFlowApp = () => {
    const {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        onNodeClick,
        onEdgeClick,
        onPaneClick,
        onDragOver,
        onDrop,
        isLoading,
        error,
        activeAgent,
        messages,
        isDark,
        isSidebarOpen,
        isRightSidebarOpen,
        toggleSidebar,
        toggleRightSidebar,
        closeRightSidebar,
        handleIconSelect,
        toggleTheme,
        handleAgentChange,
        handleSendMessage,
        addUserMessage,
        handleClear,
        handleExport,
        handleExportSvg,
        handleUndo,
        handleRedo,
        handleSelectAll,
        handleDeleteSelected,
        takeSnapshot,
        selectedNodeId,
        handleSendToBack,
        handleBringToFront,
        handleDownloadLogs,
        showFeedback,
        handleFeedbackSubmit,
        handleFeedbackDismiss,
        selectedImage,
        setSelectedImage,
        loadingText
    } = useDiagramState();

    useKeyboardShortcuts({
        undo: handleUndo,
        redo: handleRedo,
        selectAll: handleSelectAll,
        deleteSelected: handleDeleteSelected
    });

    // Find current icon of selected node
    const selectedNode = nodes.find(n => n.id === selectedNodeId);
    const currentIcon = selectedNode?.data?.customIcon as string;

    return (
        <>
            <MainLayout
                sidebar={
                    <Sidebar
                        isOpen={isSidebarOpen}
                        messages={messages}
                        onSendMessage={handleSendMessage}
                        addUserMessage={addUserMessage}
                        onClear={handleClear}
                        onExport={handleExport}
                        onExportSvg={handleExportSvg}
                        isLoading={isLoading}
                        toggleTheme={toggleTheme}
                        isDark={isDark}
                        hasNodes={nodes.length > 0}
                        activeAgent={activeAgent}
                        onAgentChange={handleAgentChange}
                        onDownloadLogs={handleDownloadLogs}
                        selectedImage={selectedImage}
                        onImageSelect={setSelectedImage}
                        loadingText={loadingText}
                    />
                }
                canvas={
                    <DiagramCanvas
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onNodeClick={onNodeClick}
                        onEdgeClick={onEdgeClick}
                        onPaneClick={onPaneClick}
                        onNodeDragStart={() => takeSnapshot({ nodes, edges })}
                        onDragOver={onDragOver}
                        onDrop={onDrop}
                        isSidebarOpen={isSidebarOpen}
                        toggleSidebar={toggleSidebar}
                        isRightSidebarOpen={isRightSidebarOpen}
                        toggleRightSidebar={toggleRightSidebar}
                        error={error}
                        activeAgent={activeAgent}
                        isDark={isDark}
                        onSendToBack={handleSendToBack}
                        onBringToFront={handleBringToFront}
                    />
                }
                rightPanel={
                    <IconPanel
                        isOpen={isRightSidebarOpen}
                        onClose={closeRightSidebar}
                        onSelectIcon={handleIconSelect}
                        currentIcon={currentIcon}
                    />
                }
            />
            <FeedbackRating
                isVisible={showFeedback}
                onSubmit={handleFeedbackSubmit}
                onDismiss={handleFeedbackDismiss}
            />
        </>
    );
};

const App = () => (
    <ReactFlowProvider>
        <IconProvider>
            <NeuroFlowApp />
        </IconProvider>
    </ReactFlowProvider>
);

export default App;
