# Flowchart Generator Flow

This document outlines the data flow for the Process Analyst Agent, from the initial LLM generation to the final layout calculation.

## 1. LLM Generation (Gemini)

The system uses Google's Gemini model to generate the logical flow of a process or algorithm.

### Context Management (Optimized)
To handle complex diagrams without exceeding token limits, the system uses a **Context Injection** strategy:
1.  **Current State Injection**: The *current* state of the diagram (nodes and edges) is injected as a system message at the start of every prompt.
2.  **Incremental Updates**: The LLM is instructed to return *only* the changes (deltas) needed based on the user's latest request, rather than regenerating the entire diagram.
3.  **History Pruning**: The chat history stores only the text explanations, not the massive JSON state, keeping the context window efficient.

### Memory Management & Context Optimization
To prevent "context window overloaded" errors and reduce token usage, the system strictly separates **Logical State** from **Visual Layout**.

#### 1. Logical Schema (Sent to LLM)
When communicating with the Gemini API, the system strips all layout-related data (`position`, `width`, `height`) from the context. The LLM receives a lightweight "Logical Schema" containing only the structural information needed for reasoning:
*   **Nodes**: `id`, `label`, `type`, `description`, `attributes`, `methods`.
*   **Edges**: `source`, `target`, `label`.

**Why?**
*   **Token Efficiency**: Coordinate numbers (e.g., `x: 1245.43, y: 300.21`) consume significant tokens but provide little value to the LLM's reasoning process.
*   **Focus**: The LLM focuses on *what* to connect, not *where* to place it.

**Example: Logical Schema (Sent to LLM)**
```json
{
  "nodes": [
    {
      "id": "node_1",
      "label": "Start Process",
      "type": "start",
      "description": "Initiates the workflow"
      // NO position, width, or height
    }
  ],
  "edges": []
}
```

#### 2. Visual Layout (Client-Side)
The layout is handled entirely on the client side by the **ELK (Eclipse Layout Kernel)** engine.
1.  The app receives the logical updates from the LLM.
2.  It merges these updates with the existing state.
3.  The full schema (including new nodes without coordinates) is passed to the ELK engine.
4.  ELK calculates the optimal `x`, `y` coordinates for all nodes.

**Example: Visual Schema (Used by ELK/Renderer)**
```json
{
  "nodes": [
    {
      "id": "node_1",
      "label": "Start Process",
      "type": "start",
      "description": "Initiates the workflow",
      "position": { "x": 50, "y": 100 }, // Calculated by ELK
      "width": 140,
      "height": 60
    }
  ],
  "edges": []
}
```

### System Instruction
The agent is initialized with the `ANALYST_INSTRUCTION`:
> "You are a Senior Business Process Analyst... Focus on the sequence of steps and decision points... Output strictly conforming JSON."

### Node Types & Visuals
The following node types are supported, with specific visual cues:

| Type | Shape | Color | Icon | Description |
| :--- | :--- | :--- | :--- | :--- |
| `start` | Circle | Emerald (Green) | Play Circle | Start point of the process. |
| `end` | Circle | Rose (Red) | Stop Circle | End point of the process. |
| `process` | Rounded Rect | Blue | Settings | Standard action or step. |
| `decision` | Diamond | Amber (Orange) | Git Fork | Branching logic (Yes/No). |
| `group` | Dashed Rect | Gray | Box Select | Swimlanes or logical grouping. |

### LLM Response Structure
The LLM returns a JSON object conforming to the `ArchitectureSchema`.

**Example LLM Response (Delta):**
```json
{
  "nodes": [
    {
      "id": "check_condition",
      "label": "Is Valid?",
      "type": "decision",
      "description": "Validation check"
    }
  ],
  "edges": [
    {
      "source": "start_node",
      "target": "check_condition",
      "label": "next"
    }
  ],
  "explanation": "Added a validation decision point."
}
  "explanation": "Added a validation decision point."
}
```

### Real-World Examples (From Logs)

**1. Incremental Update (Adding Logic)**
When the user asks to add an "ELIF" condition, the LLM returns only the new nodes and edges, plus any modifications to existing edges (re-routing).

```json
{
  "nodes": [
    {
      "id": "check_elif_condition",
      "label": "Is ELIF Condition True?",
      "type": "decision",
      "description": "Evaluates the second condition (ELIF)."
    },
    {
      "id": "execute_elif_block",
      "label": "Execute ELIF Block",
      "type": "process",
      "description": "Code runs if the ELIF condition is True."
    }
  ],
  "edges": [
    {
      "source": "check_condition",
      "target": "execute_else_block",
      "deleted": true // Removing the old direct connection
    },
    {
      "source": "check_condition",
      "target": "check_elif_condition",
      "label": "False (No)" // Re-routing 'False' to the new condition
    },
    {
      "source": "check_elif_condition",
      "target": "execute_elif_block",
      "label": "True (Yes)"
    },
    {
      "source": "check_elif_condition",
      "target": "execute_else_block",
      "label": "False (No)"
    },
    {
      "source": "execute_elif_block",
      "target": "end_flow"
    }
  ],
  "explanation": "Implemented an ELIF structure by redirecting the 'False' path..."
}
```

**2. Deletion**
When the user asks to remove a node, the LLM marks it as `deleted: true`.

```json
{
  "nodes": [
    {
      "id": "start_flow",
      "label": "Start Flow",
      "type": "start",
      "deleted": true
    }
  ],
  "edges": [
    {
      "source": "start_flow",
      "target": "check_condition",
      "deleted": true
    }
  ],
  "explanation": "Removed the 'Start Flow' node and the edge connecting it to the initial condition check."
}
```

---

## 2. Request to Layout Engine (ELK)

The `src/services/layoutService.ts` converts the LLM's schema into a graph format compatible with the Eclipse Layout Kernel (ELK).

### Transformation Logic
*   **Dimensions**: Node dimensions are calculated based on their `type`.
    *   `start` / `end`: 140x60
    *   `process`: 180x80
    *   `decision`: 140x140 (Diamond shape)
    *   `group`: Dynamic (includes children)
*   **Layout Options**:
    *   `elk.algorithm`: `layered` (Hierarchical layout)
    *   `elk.direction`: `RIGHT` (Left-to-Right flow)
    *   `elk.layered.spacing.nodeNodeBetweenLayers`: `200`
    *   `elk.spacing.nodeNode`: `160`

### Example ELK Request Object
```javascript
{
  "id": "root",
  "layoutOptions": {
    "elk.algorithm": "layered",
    "elk.direction": "RIGHT",
    // ...
  },
  "children": [
    {
      "id": "start_node",
      "width": 140,
      "height": 60,
      "children": [],
      "_data": { ...originalNodeData }
    },
    // ...
  ],
  "edges": [
    // ...
  ]
}
```

---

## 3. Response from Layout Engine (ELK)

ELK processes the graph and returns the same object structure with calculated `x`, `y` coordinates.

### Example ELK Response Object
```javascript
{
  "id": "root",
  "children": [
    {
      "id": "start_node",
      "x": 0,
      "y": 100,
      "width": 140,
      "height": 60,
      // ...
    },
    // ...
  ],
  "edges": [
    // ...
  ]
}
```

---

## 4. Final Output (React Flow)

The `layoutService` converts the ELK response into React Flow nodes and edges for rendering.

```javascript
// Final React Flow Nodes
[
  {
    "id": "start_node",
    "type": "custom", // Delegates to StandardNode or DecisionNode
    "position": { "x": 0, "y": 100 },
    "data": { "label": "Start", "type": "start", ... },
    "style": { "width": 140, "height": 60 }
  },
  // ...
]
```
