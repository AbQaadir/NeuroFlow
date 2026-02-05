# Class Diagram Generator Flow

This document outlines the data flow for the Class Diagram Agent, from the initial LLM generation to the final layout calculation.

## 1. LLM Generation (Gemini)

The system uses Google's Gemini model to generate a detailed UML Class Diagram.

### System Instruction
The agent is initialized with the `CLASS_INSTRUCTION`:
> "You are a Senior Software Engineer specializing in Object-Oriented Design... Design a detailed UML CLASS DIAGRAM... Output strictly conforming JSON."

### Node Types
*   `class`: Represents a class or interface.

### Class Details
Classes can have:
*   `attributes`: Properties/fields (name, type, visibility).
*   `methods`: Functions (name, returnType, visibility).

### LLM Response Structure
The LLM returns a JSON object conforming to the `ArchitectureSchema`.

**Example LLM Response:**
```json
{
  "nodes": [
    {
      "id": "user_class",
      "label": "User",
      "type": "class",
      "description": "Base user class",
      "attributes": [
        { "name": "username", "dataType": "String", "visibility": "+" },
        { "name": "password", "dataType": "String", "visibility": "-" }
      ],
      "methods": [
        { "name": "login", "returnType": "void", "visibility": "+" },
        { "name": "logout", "returnType": "void", "visibility": "+" }
      ]
    },
    {
      "id": "admin_class",
      "label": "Admin",
      "type": "class",
      "description": "Administrator",
      "attributes": [],
      "methods": [
        { "name": "banUser", "returnType": "void", "visibility": "+" }
      ]
    }
  ],
  "edges": [
    {
      "source": "admin_class",
      "target": "user_class",
      "label": "extends"
    }
  ],
  "explanation": "User inheritance hierarchy."
}
```

---

## 2. Request to Layout Engine (ELK)

The `src/services/layoutService.ts` converts the LLM's schema into a graph format compatible with the Eclipse Layout Kernel (ELK).

### Transformation Logic
*   **Dimensions**: Height is dynamically calculated based on attributes AND methods.
    *   `width`: 220
    *   `height`: `40 (Header) + (AttrCount * 24) + 10 + (MethodCount * 24) + 10`
*   **Layout Options**: Default Layered Architecture options.
    *   `elk.algorithm`: `layered`
    *   `elk.direction`: `RIGHT`

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
      "id": "user_class",
      "width": 220,
      "height": 156, // 40 + (2*24) + 10 + (2*24) + 10
      "children": [],
      "_data": { ...originalNodeData }
    },
    {
      "id": "admin_class",
      "width": 220,
      "height": 84, // 40 + 0 + 10 + (1*24) + 10
      "children": [],
      "_data": { ...originalNodeData }
    }
  ],
  "edges": [
    // ...
  ]
}
```

---

## 3. Response from Layout Engine (ELK)

ELK processes the graph and returns the same object structure with coordinates.

### Example ELK Response Object
```javascript
{
  "id": "root",
  "children": [
    {
      "id": "user_class",
      "x": 380,
      "y": 50,
      "width": 220,
      "height": 156,
      // ...
    },
    {
      "id": "admin_class",
      "x": 0,
      "y": 80,
      "width": 220,
      "height": 84,
      // ...
    }
  ],
  "edges": [
    // ...
  ]
}
```

---

## 4. Final Output (React Flow)

The `layoutService` converts the ELK response into React Flow nodes and edges.

```javascript
// Final React Flow Nodes
[
  {
    "id": "user_class",
    "type": "custom",
    "position": { "x": 380, "y": 50 },
    "data": { 
      "label": "User", 
      "type": "class", 
      "attributes": [...],
      "methods": [...],
      ... 
    },
    "style": { "width": 220, "height": 156 }
  },
  // ...
]
```
