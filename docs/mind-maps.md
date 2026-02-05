# Mindmap Generator Agent Flow

This document outlines the data flow for the Mindmap Generator Agent, from the initial LLM generation to the final layout calculation.

## 1. LLM Generation (Gemini)

The system uses Google's Gemini model to generate the logical structure of the mind map.

### System Instruction
The agent is initialized with the `MINDMAP_INSTRUCTION`:
> "You are an Expert Information Architect and Mind Map Specialist... Output strictly conforming JSON."

### Node Types
*   `central`: The main subject (Exactly one).
*   `topic`: Level 1 branches.
*   `subtopic`: Level 2 branches.
*   `note`: Optional annotations.

### LLM Response Structure
The LLM returns a JSON object conforming to the `ArchitectureSchema`.

**Example LLM Response:**
```json
{
  "nodes": [
    {
      "id": "central_concept",
      "label": "Artificial Intelligence",
      "type": "central",
      "description": "Main Concept"
    },
    {
      "id": "ml_topic",
      "label": "Machine Learning",
      "type": "topic",
      "description": "Subset of AI"
    },
    {
      "id": "dl_subtopic",
      "label": "Deep Learning",
      "type": "subtopic",
      "description": "Neural Networks"
    }
  ],
  "edges": [
    {
      "source": "central_concept",
      "target": "ml_topic",
      "label": "includes"
    },
    {
      "source": "ml_topic",
      "target": "dl_subtopic",
      "label": "subset"
    }
  ],
  "explanation": "A basic mind map structure for AI concepts."
}
```

---

## 2. Request to Layout Engine (ELK)

The `src/services/layoutService.ts` converts the LLM's schema into a graph format compatible with the Eclipse Layout Kernel (ELK).

### Transformation Logic
*   **Dimensions**: Node dimensions are calculated based on their `type`.
    *   `central`: 260x100
    *   `topic`: 200x70
    *   `subtopic`: 180x50
    *   `note`: 160x140
*   **Layout Options**: Specific options are applied for Mind Maps (`isMindMap = true`).
    *   `elk.algorithm`: `mrtree` (Mr. Tree - ideal for hierarchical structures)
    *   `elk.direction`: `RIGHT`
    *   `elk.spacing.nodeNode`: `60` (Vertical spacing)
    *   `elk.spacing.edgeNode`: `100` (Horizontal spacing)

### Example ELK Request Object
```javascript
{
  "id": "root",
  "layoutOptions": {
    "elk.algorithm": "mrtree",
    "elk.direction": "RIGHT",
    "elk.spacing.nodeNode": "60",
    "elk.spacing.edgeNode": "100"
  },
  "children": [
    {
      "id": "central_concept",
      "width": 260,
      "height": 100,
      "children": [],
      "_data": { ...originalNodeData }
    },
    {
      "id": "ml_topic",
      "width": 200,
      "height": 70,
      "children": [],
      "_data": { ...originalNodeData }
    },
    {
      "id": "dl_subtopic",
      "width": 180,
      "height": 50,
      "children": [],
      "_data": { ...originalNodeData }
    }
  ],
  "edges": [
    {
      "id": "central_concept-ml_topic",
      "sources": ["central_concept"],
      "targets": ["ml_topic"]
    },
    {
      "id": "ml_topic-dl_subtopic",
      "sources": ["ml_topic"],
      "targets": ["dl_subtopic"]
    }
  ]
}
```

---

## 3. Response from Layout Engine (ELK)

ELK processes the graph and returns the same object structure, but with `x` and `y` coordinates injected into each node.

### Example ELK Response Object
```javascript
{
  "id": "root",
  "children": [
    {
      "id": "central_concept",
      "x": 0,
      "y": 100,
      "width": 260,
      "height": 100,
      // ...
    },
    {
      "id": "ml_topic",
      "x": 360, // shifted right
      "y": 50,
      "width": 200,
      "height": 70,
      // ...
    },
    {
      "id": "dl_subtopic",
      "x": 660, // shifted further right
      "y": 50,
      "width": 180,
      "height": 50,
      // ...
    }
  ],
  "edges": [
    {
      "id": "central_concept-ml_topic",
      "sections": [
        {
          "startPoint": { "x": 260, "y": 150 },
          "endPoint": { "x": 360, "y": 85 }
        }
      ]
      // ...
    }
  ]
}
```

---

## 4. Final Output (React Flow)

The `layoutService` finally converts the ELK response into React Flow nodes and edges.

*   **Nodes**: `x` and `y` from ELK are mapped to `position`. `width` and `height` are applied to `style`.
*   **Edges**: Original edge data is restored, and styling is applied (e.g., thicker strokes for mind maps).

```javascript
// Final React Flow Nodes
[
  {
    "id": "central_concept",
    "type": "custom",
    "position": { "x": 0, "y": 100 },
    "data": { "label": "Artificial Intelligence", "type": "central", ... },
    "style": { "width": 260, "height": 100 }
  },
  // ...
]
```
