import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Loader2, User, Bot, Download, Users, ChevronDown, Check, Sun, Moon, Eraser, Settings, Key, Server, GitFork, Brain, Database, Code, ArrowLeft, Search, Paperclip, Layers } from 'lucide-react';
import { ChatMessage, AgentType } from '../../types';
import { getAllDiagrams, getDiagram } from '../../diagrams';
import { DeepThinkButton } from '../deep-think/DeepThinkButton';
import { DeepThinkForm } from '../deep-think/DeepThinkForm';
import { generateDeepThinkQuestions } from '../../services/deepThinkService';
import { DeepThinkQuestion, DeepThinkAnswers } from '../../types/deepThink';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface SidebarProps {
  isOpen: boolean;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  addUserMessage: (message: string) => void;
  onClear: () => void;
  onExport: () => void;
  onExportSvg: () => void;
  isLoading: boolean;
  // Theme
  toggleTheme: () => void;
  isDark: boolean;
  hasNodes: boolean;
  activeAgent: AgentType;
  onAgentChange: (agent: AgentType) => void;
  onDownloadLogs?: () => void;
  // Image
  selectedImage: string | null;
  onImageSelect: (image: string | null) => void;
  loadingText?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  messages,
  onSendMessage,
  addUserMessage,
  onClear,
  onExport,
  onExportSvg,
  isLoading,
  toggleTheme,
  isDark,
  hasNodes,
  activeAgent,
  onAgentChange,
  onDownloadLogs,
  selectedImage,
  onImageSelect,
  loadingText: propLoadingText
}) => {
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Agent Selector State
  const [isAgentSelectorOpen, setIsAgentSelectorOpen] = useState(false);
  const [agentSearch, setAgentSearch] = useState('');

  // Deep Think State
  // Deep Think State
  const [isDeepThinkEnabled, setIsDeepThinkEnabled] = useState(false);
  const [showDeepThinkForm, setShowDeepThinkForm] = useState(false);
  const [deepThinkQuestions, setDeepThinkQuestions] = useState<DeepThinkQuestion[]>([]);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

  const agents = getAllDiagrams().map(d => ({
    id: d.type,
    label: d.label
  }));

  const currentAgentLabel = agents.find(a => a.id === activeAgent)?.label || 'Select Agent';

  // Click outside handler for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    if (isDeepThinkEnabled) {
      // Show user message immediately
      addUserMessage(inputValue);
      const promptToUse = inputValue; // Capture value before clearing

      setInputValue('');

      setIsGeneratingQuestions(true);
      try {
        const response = await generateDeepThinkQuestions(activeAgent, apiKey, promptToUse);

        if (response.questions && response.questions.length > 0) {
          setDeepThinkQuestions(response.questions);
          setShowDeepThinkForm(true);
        } else if (response.analysis) {
          // Direct generation path if context is sufficient
          onSendMessage(`**Analysis & Generation**\n${response.analysis}`);
          setInputValue('');
          setIsDeepThinkEnabled(false); // Reset mode after successful send
        }
      } catch (error) {
        console.error("Failed to generate Deep Think questions:", error);
      } finally {
        setIsGeneratingQuestions(false);
      }
    } else {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };



  const handleDeepThinkClick = () => {
    setIsDeepThinkEnabled(!isDeepThinkEnabled);
  };

  const handleDeepThinkSubmit = (answers: DeepThinkAnswers) => {
    // Format answers into a single message
    const formattedMessage = Object.entries(answers).map(([id, answer]) => {
      const question = deepThinkQuestions.find(q => q.id === id);
      return `**${question?.text}**\n${answer}`;
    }).join('\n\n');

    onSendMessage(formattedMessage);
    setShowDeepThinkForm(false);
    setDeepThinkQuestions([]);
    setIsDeepThinkEnabled(false); // Reset mode after form submit
    setDeepThinkQuestions([]);
  };

  const activeDiagram = getDiagram(activeAgent);
  const placeholderText = activeDiagram.placeholderText;
  const loadingText = propLoadingText || activeDiagram.loadingText;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        alert("Image size should be less than 4MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <aside
      className={`
        ${isOpen ? 'w-96 border-r' : 'w-0 border-none'} 
        bg-sidebar text-sidebar-foreground border-sidebar-border 
        h-full shadow-xl transition-all duration-300 ease-in-out z-10 overflow-hidden
      `}
    >
      <div className="w-96 h-full flex flex-col">
        {isAgentSelectorOpen ? (
          // --- AGENT GALLERY VIEW ---
          <div className="flex flex-col h-full animate-in slide-in-from-left-4 duration-200 bg-sidebar">
            {/* Gallery Header */}
            <div className="p-4 border-b border-sidebar-border flex items-center gap-3 shrink-0">
              <button
                onClick={() => setIsAgentSelectorOpen(false)}
                className="p-2 -ml-2 rounded-lg hover:bg-sidebar-accent text-muted-foreground hover:text-sidebar-foreground transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="font-semibold text-lg">Select Agent</h2>
            </div>

            {/* Search Bar */}
            <div className="p-4 pb-2 shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search agents..."
                  className="w-full pl-9 pr-4 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                  value={agentSearch}
                  onChange={(e) => setAgentSearch(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            {/* Agent List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {agents
                .filter(a => a.label.toLowerCase().includes(agentSearch.toLowerCase()))
                .map((agent) => {
                  let Icon = Server;
                  if (agent.id === 'analyst') Icon = GitFork;
                  if (agent.id === 'mindmap') Icon = Brain;
                  if (agent.id === 'database') Icon = Database;
                  if (agent.id === 'class') Icon = Code;
                  if (agent.id === 'c4') Icon = Layers;

                  const isActive = activeAgent === agent.id;

                  return (
                    <button
                      key={agent.id}
                      onClick={() => {
                        onAgentChange(agent.id as AgentType);
                        setIsAgentSelectorOpen(false);
                      }}
                      className={`
                        w-full flex items-center gap-4 p-3 rounded-lg border text-left transition-all
                        ${isActive
                          ? 'bg-sidebar-accent border-primary/50 ring-1 ring-primary/50 shadow-sm'
                          : 'bg-card border-sidebar-border hover:border-primary/30 hover:bg-sidebar-accent/50'}
                      `}
                    >
                      <div className={`p-2 rounded-md ${isActive ? 'bg-primary/10 text-primary' : 'bg-sidebar-accent text-muted-foreground'}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium ${isActive ? 'text-primary' : 'text-foreground'}`}>
                          {agent.label}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {agent.id === 'architect' && 'Design system architecture & cloud infra'}
                          {agent.id === 'analyst' && 'Create detailed process flowcharts'}
                          {agent.id === 'mindmap' && 'Brainstorm ideas & organize thoughts'}
                          {agent.id === 'database' && 'Design database schemas & relationships'}
                          {agent.id === 'class' && 'Model object-oriented class structures'}
                          {agent.id === 'c4' && 'Visualize software architecture with C4 model'}
                        </div>
                      </div>
                      {isActive && <Check className="w-5 h-5 text-primary shrink-0" />}
                    </button>
                  );
                })}

              {agents.filter(a => a.label.toLowerCase().includes(agentSearch.toLowerCase())).length === 0 && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No agents found matching "{agentSearch}"
                </div>
              )}
            </div>
          </div>
        ) : showDeepThinkForm ? (
          // --- DEEP THINK FORM VIEW ---
          <DeepThinkForm
            questions={deepThinkQuestions}
            onSubmit={handleDeepThinkSubmit}
            onCancel={() => setShowDeepThinkForm(false)}
          />
        ) : (
          // --- CHAT VIEW ---
          <>
            {/* Header */}
            <div className="p-4 border-b border-sidebar-border flex flex-col gap-4 shrink-0">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <h1 className="text-lg font-bold tracking-tight leading-tight">
                    NeuroFlow
                  </h1>
                </div>
                <div className="flex gap-2">
                  {hasNodes && (
                    <>
                      <div className="relative" ref={dropdownRef}>
                        <button
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className="p-2 rounded-lg hover:bg-sidebar-accent text-muted-foreground hover:text-sidebar-foreground transition-colors"
                          title="Export"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        {isDropdownOpen && (
                          <div className="absolute right-0 top-full mt-1 bg-popover border border-border rounded-lg shadow-lg z-50 min-w-[120px] overflow-hidden">
                            <button
                              onClick={() => { onExport(); setIsDropdownOpen(false); }}
                              className="w-full px-3 py-2 text-sm text-left hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2"
                            >
                              <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">PNG</span>
                              <span>Image</span>
                            </button>
                            <button
                              onClick={() => { onExportSvg(); setIsDropdownOpen(false); }}
                              className="w-full px-3 py-2 text-sm text-left hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2"
                            >
                              <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">SVG</span>
                              <span>Vector</span>
                            </button>
                          </div>
                        )}
                      </div>
                      {onDownloadLogs && (
                        <button onClick={onDownloadLogs} className="p-2 rounded-lg hover:bg-sidebar-accent text-muted-foreground hover:text-sidebar-foreground transition-colors" title="Download Research Data (JSON)">
                          <Database className="w-4 h-4" />
                        </button>
                      )}
                      <button onClick={onClear} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" title="Clear">
                        <Eraser className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors" title="Theme">
                    {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Current Agent Display (Clickable to Open Gallery) */}
              <button
                onClick={() => setIsAgentSelectorOpen(true)}
                className="w-full bg-sidebar-accent/30 hover:bg-sidebar-accent/50 border border-sidebar-border rounded-lg p-3 flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-background rounded-md shadow-sm text-primary">
                    {(() => {
                      let Icon = Server;
                      if (activeAgent === 'analyst') Icon = GitFork;
                      if (activeAgent === 'mindmap') Icon = Brain;
                      if (activeAgent === 'database') Icon = Database;
                      if (activeAgent === 'class') Icon = Code;
                      if (activeAgent === 'c4') Icon = Layers;
                      return <Icon className="w-4 h-4" />;
                    })()}
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Current Agent</span>
                    <span className="text-sm font-semibold text-foreground">{currentAgentLabel}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                  Change
                  <ChevronDown className="w-3 h-3 -rotate-90" />
                </div>
              </button>
            </div>

            {/* --- AI CHAT --- */}
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center shrink-0
                      ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-sidebar-accent text-sidebar-foreground'}
                    `}>
                      {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>

                    <div className="flex flex-col gap-1 max-w-[85%]">
                      {/* Image in History */}
                      {msg.imageUrl && (
                        <div className="rounded-lg overflow-hidden border border-sidebar-border mb-1">
                          <img src={msg.imageUrl} alt="User upload" className="max-w-full h-auto max-h-64 object-cover" />
                        </div>
                      )}

                      <div className={`
                        rounded-2xl px-4 py-2.5 text-sm shadow-sm overflow-hidden prose prose-sm dark:prose-invert max-w-none break-words
                        ${msg.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-tr-none prose-headings:text-primary-foreground prose-p:text-primary-foreground prose-strong:text-primary-foreground prose-code:text-primary-foreground'
                          : 'bg-sidebar-accent border border-sidebar-border text-sidebar-foreground rounded-tl-none'}
                      `}>
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            pre: ({ node, ...props }) => <pre className="overflow-auto w-full my-2 bg-black/10 dark:bg-black/30 p-2 rounded-lg" {...props} />,
                            code: ({ node, ...props }) => <code className="bg-black/10 dark:bg-black/30 px-1 py-0.5 rounded text-xs" {...props} />
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center shrink-0 animate-pulse">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-sidebar-accent/50 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2 text-xs text-muted-foreground">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      {loadingText}
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="p-4 border-t border-sidebar-border bg-sidebar/50 backdrop-blur-sm relative">
                {/* Floating Deep Think Button */}
                <div className="absolute -top-10 left-4 z-10">
                  <DeepThinkButton
                    onClick={handleDeepThinkClick}
                    isLoading={isGeneratingQuestions || isLoading}
                    isActive={isDeepThinkEnabled}
                  />
                </div>

                {/* Image Preview */}
                {/* Image Preview Area */}
                {selectedImage && (
                  <div className="mx-4 mb-2 p-2 bg-sidebar-accent/30 border border-sidebar-border rounded-lg inline-flex items-center gap-2 relative group animate-in zoom-in-95 duration-200">
                    <div className="w-16 h-16 rounded overflow-hidden relative">
                      <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium truncate max-w-[120px]">Image attached</span>
                      <span className="text-[10px] text-muted-foreground">Ready to analyze</span>
                    </div>
                    <button
                      onClick={() => onImageSelect(null)}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove image"
                    >
                      <ChevronDown className="w-3 h-3 rotate-45" /> {/* X icon via rotation */}
                    </button>
                  </div>
                )}

                <form onSubmit={handleSend} className="flex gap-3 items-end">
                  {/* Upload Button */}
                  <div className="pb-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileSelect}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isLoading}
                      className={`
                           p-2 rounded-lg transition-colors
                           ${selectedImage
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-sidebar-accent text-muted-foreground hover:text-sidebar-foreground'}
                        `}
                      title="Upload Image"
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>
                  </div>
                  {/* Input Field & Send Button Container */}
                  <div className="relative flex-1">
                    <textarea
                      rows={1}
                      className="w-full bg-background border border-input rounded-xl pl-4 pr-12 py-3 text-sm focus:ring-2 focus:ring-ring focus:border-transparent outline-none shadow-sm resize-none overflow-hidden min-h-[48px] max-h-[200px] flex items-center"
                      placeholder={placeholderText}
                      value={inputValue}
                      onChange={(e) => {
                        setInputValue(e.target.value);
                        e.target.style.height = 'auto';
                        e.target.style.height = `${e.target.scrollHeight}px`;
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !inputValue.trim()}
                      className="absolute right-2 bottom-2 p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;