# C4 Model Implementation Guide

This document details the implementation of the **C4 Model** support in NeuroFlow Architect. The C4 model is an "abstraction-first" approach to diagramming software architecture, based on **Context**, **Containers**, **Components**, and **Code**.

## 1. Overview

The C4 Agent (`agentType: 'c4'`) is designed to generate hierarchical diagrams that show software systems at different levels of abstraction.

### Key Features
-   **Specialized Nodes**: dedicated `Person` and `System/Container` nodes.
-   **Hierarchical Layout**: Grouping of components within containers/systems.
-   **Visual Distinction**: Distinct color palettes (Blue for primary systems, Grey for external) and shapes.

## 2. Node Types

### 2.1 Person Node (`type: 'person'`)
Represents users, actors, or roles interacting with the system.
-   **Visuals**: Rounded "Head & Shoulders" shape (or pill shape with icon).
-   **Styling**: Dark blue background (`bg-slate-900` / `bg-slate-700`) with white text.
-   **Behavior**: Can connect to systems or containers.

### 2.2 System / Container Node (`type: 'frame'`)
Represents a specific Software System, Container (Web App, DB), or Component.
-   **Visuals**: Rectangular box with specific C4 labeling (Name + Type + Description).
-   **Styling**:
    -   **System**: Bold Blue.
    -   **External System**: Grey/Muted.
    -   **Component**: Lighter Blue.

## 3. Interaction & Toolbar

When the **C4 Agent** is active, the Editor Panel (`EditorPanel.tsx`) provides a specialized palette:

-   **👤 Person**: Draggable node for adding new actors.
-   **🟦 System**: Draggable node for adding new software systems.
-   **⬜ Container**: Draggable node for containers.
-   **📦 Component**: Draggable node for internal components.

## 4. Technical Implementation

-   **Agent ID**: `c4`
-   **Layout**: Uses ELK with a custom configuration to ensure proper nesting of containers vs. external actors.
-   **File Structure**:
    -   `src/components/nodes/c4/PersonNode.tsx`: React component for the Person shape.
    -   `src/components/nodes/c4/C4FrameNode.tsx`: React component for Systems/Containers.
    -   `src/diagrams/c4/index.ts`: Definition of default styles and dimensions.

## 5. Usage Example

**Prompt**:
> "Create a C4 Context diagram for an Internet Banking System. The user uses the Internet Banking System which sends emails via an E-mail System and uses the Mainframe Banking System."

**Result**:
-   **Person**: "User" (Customer)
-   **System**: "Internet Banking System" (Central)
-   **External System**: "E-mail System"
-   **External System**: "Mainframe Banking System"
