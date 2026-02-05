# ER Diagram Generator Flow

This document outlines the data flow for the Database Architect Agent, from the initial LLM generation to the final layout calculation.

## 1. LLM Generation (Gemini)

The system uses Google's Gemini model to generate a normalized Entity-Relationship (ER) diagram.

### Memory Management & Context Optimization
To prevent "context window overloaded" errors and reduce token usage, the system strictly separates **Logical State** from **Visual Layout**.

#### 1. Logical Schema (Sent to LLM)
When communicating with the Gemini API, the system strips all layout-related data (`position`, `width`, `height`) from the context. The LLM receives a lightweight "Logical Schema" containing only the structural information needed for reasoning (Entities, Attributes, Relationships).

**Why?**
*   **Token Efficiency**: Coordinate numbers consume significant tokens but provide little value to the LLM's reasoning process.
*   **Focus**: The LLM focuses on *what* tables to create and how they relate, not *where* to place them.

#### 2. Visual Layout (Client-Side)
The layout is handled entirely on the client side by the **ELK (Eclipse Layout Kernel)** engine.
1.  The app receives the logical updates from the LLM.
2.  It merges these updates with the existing state.
3.  The full schema (including new nodes without coordinates) is passed to the ELK engine.
4.  ELK calculates the optimal `x`, `y` coordinates for all nodes.

### System Instruction
The agent is initialized with the `DATABASE_INSTRUCTION`:
> "You are a Senior Database Architect... Design a normalized ENTITY-RELATIONSHIP (ER) Diagram... Output strictly conforming JSON."

### Node Types
*   `entity`: Represents a database table.

### Attributes
Entities MUST have an `attributes` array containing:
*   `name`: Column name.
*   `dataType`: Data type (INT, VARCHAR, etc.).
*   `isPK`: Primary Key boolean.
*   `isFK`: Foreign Key boolean.

### LLM Response Structure
The LLM returns a JSON object conforming to the `ArchitectureSchema`.

**Example LLM Response:**
```json
{
  "nodes": [
    {
      "id": "users_table",
      "label": "Users",
      "type": "entity",
      "description": "User accounts",
      "attributes": [
        { "name": "id", "dataType": "INT", "isPK": true },
        { "name": "email", "dataType": "VARCHAR", "isPK": false }
      ]
    },
    {
      "id": "orders_table",
      "label": "Orders",
      "type": "entity",
      "description": "Customer orders",
      "attributes": [
        { "name": "id", "dataType": "INT", "isPK": true },
        { "name": "user_id", "dataType": "INT", "isFK": true }
      ]
    }
  ],
  "edges": [
    {
      "source": "users_table",
      "target": "orders_table",
      "label": "1:N"
    }
  ],
  "explanation": "Basic User-Order relationship."
}
  "explanation": "Basic User-Order relationship."
}
```

### Real-World Examples (Incremental Updates)

**1. Adding a New Table**
When the user asks to "Add a Products table", the LLM returns only the new node and its relationship.

```json
{
  "nodes": [
    {
      "id": "products_table",
      "label": "Products",
      "type": "entity",
      "description": "Product catalog",
      "attributes": [
        { "name": "id", "dataType": "INT", "isPK": true },
        { "name": "name", "dataType": "VARCHAR", "isPK": false },
        { "name": "price", "dataType": "DECIMAL", "isPK": false }
      ]
    }
  ],
  "edges": [
    {
      "source": "orders_table",
      "target": "products_table",
      "label": "N:M"
    }
  ],
  "explanation": "Added Products table and linked to Orders."
}
```

**2. Modifying Columns (Deltas)**
When the user asks to "Add 'status' to Orders", the LLM returns the updated node with the new attribute list.

```json
{
  "nodes": [
    {
      "id": "orders_table",
      "label": "Orders",
      "type": "entity",
      "description": "Customer orders",
      "attributes": [
        { "name": "id", "dataType": "INT", "isPK": true },
        { "name": "user_id", "dataType": "INT", "isFK": true },
        { "name": "status", "dataType": "VARCHAR", "isPK": false } // New Attribute
      ]
    }
  ],
  "edges": [],
  "explanation": "Added 'status' column to Orders table."
}
```

### Manual Editing
Users can also manually modify the schema directly on the canvas:
*   **Add Attribute**: Click the **+** button next to any row to insert a new attribute below it, or use the button at the bottom of the list.
*   **Delete Attribute**: Hover over a row and click the **X** button.
*   **Edit Fields**: Double-click any text (name, type) to edit it inline.
*   **Toggle Keys**: Click the Key icon (PK) or Fork icon (FK) to toggle constraints.

---

## 2. Request to Layout Engine (ELK)

The `src/services/layoutService.ts` converts the LLM's schema into a graph format compatible with the Eclipse Layout Kernel (ELK).

### Transformation Logic
*   **Dimensions**: Height is dynamically calculated based on the number of attributes.
    *   `width`: 200
    *   `height`: `40 (Header) + (AttributeCount * 24) + 10`
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
      "id": "users_table",
      "width": 200,
      "height": 98, // 40 + (2 * 24) + 10
      "children": [],
      "_data": { ...originalNodeData }
    },
    {
      "id": "orders_table",
      "width": 200,
      "height": 98,
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
      "id": "users_table",
      "x": 0,
      "y": 50,
      "width": 200,
      "height": 98,
      // ...
    },
    {
      "id": "orders_table",
      "x": 360,
      "y": 50,
      "width": 200,
      "height": 98,
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
    "id": "users_table",
    "type": "custom",
    "position": { "x": 0, "y": 50 },
    "data": { 
      "label": "Users", 
      "type": "entity", 
      "attributes": [...],
      ... 
    },
    "style": { "width": 200, "height": 98 }
  },
  // ...
]
```
