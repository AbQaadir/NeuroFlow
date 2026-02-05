# NeuroFlow Architect 🧠

An AI-powered diagram generation platform that transforms natural language descriptions into professional architecture diagrams, flowcharts, mind maps, ER diagrams, and UML class diagrams.

![Powered by Gemini 2.5 & ELK Layout](https://img.shields.io/badge/Powered%20by-Gemini%202.5%20%26%20ELK-blue)

---

## 🌟 What is NeuroFlow?

**NeuroFlow Architect** is an intelligent diagramming application that uses AI to understand your requirements and automatically generates visual diagrams. Simply describe what you want in plain English, and watch as the AI creates professionally structured diagrams in real-time.

### Supported Diagram Types

The application features **5 specialized AI agents**, each expert in a different domain:

| Agent | Focus Area | Node Types | Documentation |
|-------|-----------|-----------|---------------|
| **System Architect** | Cloud infrastructure & system topology | `service`, `database`, `client`, `queue`, `external`, `group` | [Guide](./docs/System_Architecture_Guide.md) |
| **Process Analyst** | Business processes & decision flows | `start`, `end`, `process`, `decision` | [Guide](./docs/Flowchart_Guide.md) |
| **Mind Mapper** | Hierarchical brainstorming & concept mapping | `central`, `topic`, `subtopic`, `note` | [Guide](./docs/Mind_Map_Guide.md) |
| **Database Architect** | Entity-Relationship diagrams & schemas | `entity` (with attributes, PK/FK) | [Guide](./docs/ER_Diagram_Guide.md) |
| **Class Diagram Agent** | UML class diagrams & OOP structures | `class` (with attributes, methods, visibility) | [Guide](./docs/Class_Diagram_Guide.md) |
| **C4 Modeler** | Context, Container, Component diagrams | `person`, `frame` (System/Container) | [Guide](./docs/c4_implementation.md) |

For a deep dive into the chat and request architecture, see the [Chat System Architecture](./docs/Chat_System_Architecture.md).

---

## 🏗️ Application Architecture

### High-Level Overview

```
User Input (Natural Language)
        ↓
[1] AI Service (Gemini 2.5) ← Semantic Understanding & Structure Generation (Client-Side)
        ↓
[2] Layout Service (ELK.js) ← Spatial Positioning & Graph Layout
        ↓
[3] React Flow Renderer ← Visual Rendering & Interaction
        ↓
Interactive Canvas
```

### The Three-Stage Pipeline

#### **Stage 1: Semantic Reasoning (AI Service)**
**File:** `src/services/geminiService.ts`

- **What happens:** Your natural language input is sent directly to Google's Gemini 2.5 Flash model from the browser.
- **Role:** The AI acts as a specialized agent (architect/analyst/etc.) and interprets your requirements.
- **Output:** A structured JSON schema containing nodes, edges, and an explanation.

#### **Stage 2: Spatial Layout (Layout Service)**
**File:** `src/services/layoutService.ts`

- **What happens:** The logical schema is transformed into positioned visual nodes.
- **Role:** ELK (Eclipse Layout Kernel) calculates optimal node positions and edge routing.
- **Output:** React Flow compatible nodes and edges with X/Y coordinates.

#### **Stage 3: Visual Rendering (React Flow)**
**File:** `src/components/canvas/DiagramCanvas.tsx`, `src/components/nodes/StandardNode.tsx`

- **What happens:** Positioned nodes are rendered as interactive SVG/HTML elements.
- **Role:** React Flow provides the canvas, zoom/pan, and interaction layer.
- **Smart Icons:** Uses [Icon Mapper](./docs/icon_mapper.md) to automatically select icons based on node content.
- **Output:** A beautiful, interactive diagram that users can manipulate.

---

## 🎨 How the UI Renders

### Component Structure

```
src/
├── App.tsx                    # Main Layout & State Provider
├── main.tsx                   # Entry Point
├── components/
│   ├── canvas/
│   │   └── DiagramCanvas.tsx  # React Flow Wrapper
│   ├── panels/
│   │   ├── Sidebar.tsx        # Left Panel (Chat & Controls)
│   │   └── EditorPanel.tsx    # Top Panel (Drag & Drop)
│   ├── nodes/
│   │   ├── StandardNode.tsx   # Universal Node Renderer
│   │   └── ... (Specific logic)
│   └── edges/
│       └── CustomEdge.tsx     # Smart Edges
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Google AI Studio API Key ([Get one here](https://aistudio.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd product2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   Create a `.env.local` file:
   ```env
   VITE_GEMINI_API_KEY=your_google_ai_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173`

---

## 📁 Project Structure

```
webapp/
├── src/
│   ├── components/    # UI Components
│   ├── hooks/         # Custom React Hooks
│   ├── services/      # Business Logic (AI, Layout)
│   ├── types/         # TypeScript Definitions
│   ├── App.tsx        # Main Component
│   └── main.tsx       # Entry Point
├── docs/              # Detailed Documentation
├── index.html         # HTML Entry
├── vite.config.ts     # Vite Configuration
└── package.json       # Dependencies
```

---

## 🎯 Key Features

✅ **AI-Powered Generation**: Converts natural language to diagrams  
✅ **5 Diagram Types**: Architecture, Flowchart, Mind Map, ER, UML Class  
✅ **Context-Aware Updates**: Modify existing diagrams conversationally  
✅ **Manual Editing**: Full control over nodes and edges  
✅ **Dark/Light Themes**: Beautiful UI in both modes  
✅ **Export to PNG**: High-resolution image downloads  
✅ **Responsive Layout**: Auto-calculates optimal node positions  
✅ **Smart Icon System**: Context-aware icon selection ([Docs](./docs/icon_mapper.md))  
✅ **Type Safety**: Full TypeScript support  

---

## 📝 License

MIT License - Feel free to use and modify for your own projects!

---

## 🙏 Acknowledgments

- **Google Gemini** - For powerful AI capabilities
- **ELK.js** - For robust graph layout algorithms
- **React Flow** - For the incredible diagram foundation
- **Vite** - For blazing-fast development experience

---

**Built with ❤️ using AI and Modern Web Technologies**
