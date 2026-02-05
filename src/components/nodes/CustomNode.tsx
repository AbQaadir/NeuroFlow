import React, { memo } from 'react';
import { NodeProps } from '@xyflow/react';

// Architecture
import ServiceNode from './architecture/ServiceNode';
import ClientNode from './architecture/ClientNode';
import DatabaseNode from './architecture/DatabaseNode';
import QueueNode from './architecture/QueueNode';
import ExternalNode from './architecture/ExternalNode';
import GroupNode from './architecture/GroupNode';
import FrameNode from './architecture/FrameNode';

// Flowchart
import StartNode from './flowchart/StartNode';
import EndNode from './flowchart/EndNode';
import ProcessNode from './flowchart/ProcessNode';
import DecisionNode from './flowchart/DecisionNode';

// Mindmap
import CentralNode from './mindmap/CentralNode';
import TopicNode from './mindmap/TopicNode';
import SubtopicNode from './mindmap/SubtopicNode';
import NoteNode from './mindmap/NoteNode';

// Database
import EntityNode from './database/EntityNode';

// Class
import ClassNode from './class/ClassNode';

// C4
import PersonNode from './c4/PersonNode';
import C4FrameNode from './c4/C4FrameNode';

// Fallback
import StandardNode from './StandardNode'; // Keep as fallback for unknown types if any

const CustomNode = (props: NodeProps) => {
    const typeStr = String(props.data.type).toLowerCase();

    // Architecture
    if (typeStr === 'service') return <ServiceNode {...props} />;
    if (typeStr === 'client') return <ClientNode {...props} />;
    if (typeStr === 'database') return <DatabaseNode {...props} />;
    if (typeStr === 'queue') return <QueueNode {...props} />;
    if (typeStr === 'external') return <ExternalNode {...props} />;
    if (typeStr === 'group') return <GroupNode {...props} />;
    if (typeStr === 'frame') return <FrameNode {...props} />;

    // Flowchart
    if (typeStr === 'start') return <StartNode {...props} />;
    if (typeStr === 'end') return <EndNode {...props} />;
    if (typeStr === 'process') return <ProcessNode {...props} />;
    if (typeStr === 'decision') return <DecisionNode {...props} />;

    // Mindmap
    if (typeStr === 'central') return <CentralNode {...props} />;
    if (typeStr === 'topic') return <TopicNode {...props} />;
    if (typeStr === 'subtopic') return <SubtopicNode {...props} />;
    if (typeStr === 'note') return <NoteNode {...props} />;

    // Database
    if (typeStr === 'entity') return <EntityNode {...props} />;

    // Class
    if (typeStr === 'class') return <ClassNode {...props} />;

    // C4
    if (typeStr === 'person') return <PersonNode {...props} />;
    if (typeStr === 'frame') return <C4FrameNode {...props} />;

    // Fallback
    return <StandardNode {...props} />;
};

export default memo(CustomNode);
