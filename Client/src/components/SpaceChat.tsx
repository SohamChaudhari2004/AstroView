"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Image as ImageIcon,
  Database,
  Film,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { getAgent, ChatMessage } from "@/lib/agent";
import axios from "axios";

interface MessageComponentProps {
  message: ChatMessage;
}

const getMissionStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "ongoing":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "upcoming":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "planned":
      return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    case "completed":
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
};

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};

const MessageComponent: React.FC<MessageComponentProps> = ({ message }) => {
  const isUser = message.role === "user";

  // Helper function for text formatting
  function formatText(text: string) {
    // Split by lines
    const lines = text.split("\n");
    const elements: JSX.Element[] = [];
    let listItems: JSX.Element[] = [];
    let tableRows: string[][] = [];
    let isInTable = false;

    const flushList = (idx: number) => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${idx}`} className="space-y-1 mb-3">
            {listItems}
          </ul>,
        );
        listItems = [];
      }
    };

    const flushTable = (idx: number) => {
      if (tableRows.length > 0) {
        const headers = tableRows[0];
        const rows = tableRows.slice(2); // Skip header and separator line
        elements.push(
          <div key={`table-${idx}`} className="overflow-x-auto my-4">
            <table className="w-full border-collapse bg-gray-800/50 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-blue-600/20 border-b border-gray-700">
                  {headers.map((header, i) => (
                    <th
                      key={i}
                      className="px-4 py-3 text-left font-semibold text-blue-400"
                    >
                      {header.trim()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-800 hover:bg-gray-800/50"
                  >
                    {row.map((cell, j) => (
                      <td key={j} className="px-4 py-3 text-gray-300">
                        {cell.trim()}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>,
        );
        tableRows = [];
        isInTable = false;
      }
    };

    lines.forEach((line, idx) => {
      // Handle horizontal rules
      if (line.trim() === "---" || line.trim() === "***") {
        flushList(idx);
        flushTable(idx);
        elements.push(
          <hr key={idx} className="my-4 border-gray-700 border-t-2" />,
        );
        return;
      }

      // Handle table rows
      if (line.includes("|")) {
        flushList(idx);
        const cells = line.split("|").filter((cell) => cell.trim() !== "");
        if (cells.length > 0) {
          tableRows.push(cells);
          isInTable = true;
          return;
        }
      } else if (isInTable) {
        flushTable(idx);
      }

      // Handle headers (### or lines with ** wrapping main content)
      if (line.startsWith("### ")) {
        flushList(idx);
        flushTable(idx);
        const cleanLine = line.replace(/^###\s+/, "");
        elements.push(
          <h3 key={idx} className="text-xl font-bold text-blue-400 mt-4 mb-2">
            {cleanLine}
          </h3>,
        );
        return;
      }

      // Handle emphasized headers (lines with emojis and bold)
      if (line.match(/^[🌍🚀🔴🪐🛰️💫🔭🌕].*\*\*/)) {
        flushList(idx);
        flushTable(idx);
        const cleanLine = line.replace(/\*\*/g, "");
        elements.push(
          <h2
            key={idx}
            className="text-2xl font-bold text-blue-300 mt-6 mb-3 flex items-center gap-2"
          >
            {cleanLine}
          </h2>,
        );
        return;
      }

      // Handle bold text as subheaders (entire line wrapped in **)
      if (line.match(/^\*\*[^*]+\*\*$/)) {
        flushList(idx);
        flushTable(idx);
        const cleanLine = line.replace(/^\*\*|\*\*$/g, "");
        elements.push(
          <h4
            key={idx}
            className="text-lg font-semibold text-blue-300 mt-3 mb-2"
          >
            {cleanLine}
          </h4>,
        );
        return;
      }

      // Handle list items
      if (
        line.startsWith("- ") ||
        line.startsWith("• ") ||
        line.startsWith("✅ ") ||
        line.match(/^\d+\.\s+/)
      ) {
        flushTable(idx);
        const content = line.replace(/^[-•✅]\s+/, "").replace(/^\d+\.\s+/, "");

        // Check if content has bold text
        if (content.includes("**")) {
          const parts = content.split(/(\*\*.*?\*\*)/g);
          listItems.push(
            <li key={idx} className="ml-4 mb-1 text-gray-300">
              {parts.map((part, i) => {
                if (part.startsWith("**") && part.endsWith("**")) {
                  return (
                    <strong key={i} className="font-bold text-white">
                      {part.slice(2, -2)}
                    </strong>
                  );
                }
                return <span key={i}>{part}</span>;
              })}
            </li>,
          );
        } else {
          listItems.push(
            <li key={idx} className="ml-4 mb-1 text-gray-300">
              {content}
            </li>,
          );
        }
        return;
      } else {
        flushList(idx);
      }

      // Handle inline code/quoted text
      if (line.startsWith("*") && line.endsWith("*") && !line.includes("**")) {
        flushTable(idx);
        const cleanLine = line.replace(/^\*|\*$/g, "");
        elements.push(
          <p key={idx} className="italic text-gray-400 ml-4 mb-2">
            {cleanLine}
          </p>,
        );
        return;
      }

      // Handle lines with inline bold text
      if (line.includes("**")) {
        flushTable(idx);
        const parts = line.split(/(\*\*.*?\*\*)/g);
        elements.push(
          <p key={idx} className="mb-2 text-gray-300">
            {parts.map((part, i) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return (
                  <strong key={i} className="font-bold text-white">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              return <span key={i}>{part}</span>;
            })}
          </p>,
        );
        return;
      }

      // Empty line
      if (line.trim() === "") {
        flushTable(idx);
        elements.push(<div key={idx} className="h-2" />);
        return;
      }

      // Regular text
      flushTable(idx);
      elements.push(
        <p key={idx} className="mb-2 text-gray-300">
          {line}
        </p>,
      );
    });

    // Flush any remaining list items or tables
    flushList(lines.length);
    flushTable(lines.length);

    return elements;
  }

  // Parse content for special rendering
  const renderContent = () => {
    const { content, metadata } = message;

    // Check if metadata contains special data to render
    if (metadata?.data) {
      const data = metadata.data;

      // Render image type
      if (data.type === "image") {
        return (
          <div className="space-y-3">
            <div className="prose prose-invert max-w-none text-gray-300">
              {formatText(content)}
            </div>
            <div className="bg-gray-800 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 text-blue-400">
                <ImageIcon size={16} />
                <span className="font-semibold">{data.title}</span>
              </div>
              {data.url && (
                <img
                  src={data.url}
                  alt={data.title}
                  className="w-full rounded-lg"
                  loading="lazy"
                />
              )}
              {data.explanation && (
                <p className="text-sm text-gray-300">{data.explanation}</p>
              )}
              {data.date && (
                <p className="text-xs text-gray-500">Date: {data.date}</p>
              )}
            </div>
          </div>
        );
      }

      // Render images array (Mars photos, etc.)
      if (data.type === "images" && data.photos) {
        return (
          <div className="space-y-3">
            <div className="prose prose-invert max-w-none text-gray-300">
              {formatText(content)}
            </div>
            <div className="bg-gray-800 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 text-blue-400">
                <ImageIcon size={16} />
                <span className="font-semibold">Mars Rover Photos</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {data.photos.slice(0, 8).map((photo: any, idx: number) => (
                  <div key={idx} className="space-y-2">
                    <img
                      src={photo.img_src}
                      alt={`Mars photo ${idx + 1}`}
                      className="w-full rounded-lg"
                      loading="lazy"
                    />
                    <p className="text-xs text-gray-400">
                      {photo.camera} - {photo.earth_date}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }

      // Render media search results
      if (data.type === "media" && data.items) {
        return (
          <div className="space-y-3">
            <div className="prose prose-invert max-w-none text-gray-300">
              {formatText(content)}
            </div>
            <div className="bg-gray-800 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 text-blue-400">
                <Film size={16} />
                <span className="font-semibold">NASA Media Library</span>
              </div>
              <div className="space-y-3">
                {data.items.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="border border-gray-700 rounded-lg p-3 space-y-2"
                  >
                    {item.href && (
                      <img
                        src={item.href}
                        alt={item.title}
                        className="w-full rounded-lg"
                        loading="lazy"
                      />
                    )}
                    <h4 className="font-semibold text-sm">{item.title}</h4>
                    {item.description && (
                      <p className="text-xs text-gray-400 line-clamp-3">
                        {item.description.substring(0, 200)}...
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      Type: {item.media_type}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }

      // Render data type (generic structured data)
      if (data.type === "data") {
        // Check if it's mission data
        if (data.missions && Array.isArray(data.missions)) {
          return (
            <div className="space-y-3">
              <div className="prose prose-invert max-w-none text-gray-300">
                {formatText(content)}
              </div>
              <div className="bg-gray-800 rounded-lg p-4 space-y-4">
                <div className="flex items-center gap-2 text-blue-400">
                  <Database size={16} />
                  <span className="font-semibold">
                    {data.missions.length} Space Missions
                  </span>
                </div>
                <div className="space-y-3">
                  {data.missions.map((mission: any, idx: number) => (
                    <div
                      key={idx}
                      className="border border-gray-700 rounded-lg p-4 space-y-3 hover:border-blue-500/50 transition-colors"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white">
                            {mission.name}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {mission.organization}
                          </p>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full border text-xs font-semibold uppercase ${getMissionStatusColor(mission.status)}`}
                        >
                          {mission.status}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-300">
                        {mission.description}
                      </p>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="space-y-1">
                          <p className="text-gray-500 text-xs uppercase">
                            Mission Type
                          </p>
                          <p className="text-gray-300 font-medium">
                            {mission.missionType}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-gray-500 text-xs uppercase">
                            Destination
                          </p>
                          <p className="text-gray-300 font-medium">
                            {mission.destination}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-gray-500 text-xs uppercase">
                            Launch Date
                          </p>
                          <p className="text-gray-300 font-medium">
                            {formatDate(mission.launchDate)}
                          </p>
                        </div>
                        {mission.crew > 0 && (
                          <div className="space-y-1">
                            <p className="text-gray-500 text-xs uppercase">
                              Crew Size
                            </p>
                            <p className="text-gray-300 font-medium">
                              {mission.crew} astronauts
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Progress Bar */}
                      {mission.progress !== undefined && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Progress</span>
                            <span className="text-gray-300 font-semibold">
                              {mission.progress}%
                            </span>
                          </div>
                          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                              style={{ width: `${mission.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        // Check if it's NEO (Near Earth Objects) data
        if (data.objects || data.near_earth_objects) {
          const neoData = data.objects || data.near_earth_objects;
          const neoArray = Object.values(neoData).flat() as any[];

          return (
            <div className="space-y-3">
              <div className="prose prose-invert max-w-none text-gray-300">
                {formatText(content)}
              </div>
              <div className="bg-gray-800 rounded-lg p-4 space-y-4">
                <div className="flex items-center gap-2 text-orange-400">
                  <Database size={16} />
                  <span className="font-semibold">
                    {neoArray.length} Near Earth Objects
                  </span>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {neoArray.slice(0, 10).map((neo: any, idx: number) => (
                    <div
                      key={idx}
                      className={`border rounded-lg p-4 space-y-2 ${
                        neo.is_potentially_hazardous_asteroid
                          ? "border-red-500/50 bg-red-500/10"
                          : "border-gray-700"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="font-bold text-white">{neo.name}</h4>
                        {neo.is_potentially_hazardous_asteroid && (
                          <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-semibold rounded border border-red-500/30">
                            ⚠️ HAZARDOUS
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-500 text-xs">Diameter</p>
                          <p className="text-gray-300">
                            {neo.estimated_diameter?.meters?.estimated_diameter_max?.toFixed(
                              0,
                            ) || "N/A"}{" "}
                            m
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Velocity</p>
                          <p className="text-gray-300">
                            {parseFloat(
                              neo.close_approach_data?.[0]?.relative_velocity
                                ?.kilometers_per_hour || 0,
                            ).toFixed(0)}{" "}
                            km/h
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        // Generic data rendering for other types
        return (
          <div className="space-y-3">
            <div className="prose prose-invert max-w-none text-gray-300">
              {formatText(content)}
            </div>
            <div className="bg-gray-800 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 text-blue-400">
                <Database size={16} />
                <span className="font-semibold">Data Response</span>
              </div>
              <pre className="text-xs bg-gray-900 p-3 rounded overflow-x-auto max-h-96 overflow-y-auto text-gray-300">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          </div>
        );
      }
    }

    // Default text rendering
    return (
      <div className="prose prose-invert max-w-none text-gray-300">
        {formatText(content)}
      </div>
    );
  };

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
          <Bot size={18} />
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-lg p-4 ${
          isUser ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-100"
        }`}
      >
        {renderContent()}
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
          <User size={18} />
        </div>
      )}
    </div>
  );
};

export default function SpaceChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "### 🚀 Welcome to AstroView AI!\n\nI'm your space exploration assistant with real-time access to NASA, ISRO, ESA, CNSA, and SpaceX data.\n\n**What I can help you with:**\n\n• 🌌 Astronomy Picture of the Day\n• 🪐 Near Earth Objects & Asteroids\n• 🔴 Mars Rover Photos & Exploration\n• 🚀 **Current & Upcoming Space Missions** (Artemis, Europa Clipper, Gaganyaan, etc.)\n• 🛰️ ISRO Missions & Spacecraft\n• ☀️ Space Weather & Solar Activity\n• 📸 NASA Media Library Search\n• 🔬 Space Science Studies\n• 🛸 NASA Technology & Patents\n\n",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agentStatus, setAgentStatus] = useState<
    "initializing" | "ready" | "error"
  >("initializing");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const agentRef = useRef<any>(null);

  useEffect(() => {
    // Initialize agent
    const initAgent = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5001/api/chat/config",
        );
        const agent = await getAgent(data.apiKey);
        agentRef.current = agent;
        setAgentStatus("ready");
      } catch (err) {
        console.error("Failed to initialize agent:", err);
        setError(
          "Failed to initialize AI agent. Some features may be limited.",
        );
        setAgentStatus("error");
      }
    };

    initAgent();
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      if (agentRef.current) {
        const response = await agentRef.current.chat(
          userMessage.content,
          messages,
        );
        setMessages((prev) => [...prev, response]);
      } else {
        throw new Error("Agent not initialized");
      }
    } catch (err: any) {
      console.error("Chat error:", err);
      setError(err.message || "Failed to get response");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I apologize, but I encountered an error processing your request. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col mt-20 bg-gray-900 text-white">
      {/* Error banner */}
      {error && (
        <div className="flex-shrink-0 bg-red-900/50 border-b border-red-700 p-3 flex items-center justify-center gap-2 animate-in slide-in-from-top duration-300">
          <AlertCircle size={16} />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Messages Container - Scrollable area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden smooth-scroll scrollbar-thin">
        <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-4">
          {messages.map((message, index) => (
            <MessageComponent key={index} message={message} />
          ))}
          {isLoading && (
            <div className="flex gap-3 justify-start animate-in fade-in slide-in-from-bottom duration-300">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <Bot size={18} />
              </div>
              <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={16} />
                  <span className="text-sm text-gray-400">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* Input Box - Fixed at bottom */}
      <div className="flex-shrink-0 bg-gray-800 border-t  border-gray-700 shadow-2xl">
        <div className="max-w-screen-xl mx-auto p-4">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about space exploration, missions, or cosmic phenomena..."
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 resize-none transition-all"
                rows={2}
                disabled={isLoading}
                style={{ minHeight: "60px", maxHeight: "200px" }}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="px-6 py-3 h-[60px] bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-all flex items-center justify-center shadow-lg hover:shadow-blue-500/50 disabled:shadow-none"
              title="Send message"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
