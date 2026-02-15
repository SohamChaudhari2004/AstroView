import { ChatMistralAI } from "@langchain/mistralai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { getAllMCPTools } from "./mcp-server";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  metadata?: {
    type?: string;
    data?: any;
  };
}

export class SpaceIntelligenceAgent {
  private llm: ChatMistralAI | null = null;
  private tools = getAllMCPTools();
  private apiKey: string;
  private useToolsMode: boolean = true;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.initializeAgent();
  }

  private async initializeAgent() {
    try {
      // Initialize Mistral AI
      this.llm = new ChatMistralAI({
        apiKey: this.apiKey,
        model: "mistral-large-latest",
        temperature: 0.7,
      });

      console.log(
        "Agent initialized successfully with",
        this.tools.length,
        "tools",
      );
    } catch (error) {
      console.error("Failed to initialize agent:", error);
      this.useToolsMode = false;
    }
  }

  async chat(
    message: string,
    history: ChatMessage[] = [],
  ): Promise<ChatMessage> {
    try {
      if (this.llm && this.useToolsMode) {
        // Direct pattern matching for critical queries (fallback if AI doesn't select tool)
        const lowerMessage = message.toLowerCase();
        let directTool = null;

        if (
          lowerMessage.includes("astronomy picture") ||
          lowerMessage.includes("apod") ||
          lowerMessage.includes("picture of the day") ||
          lowerMessage.includes("space picture today")
        ) {
          directTool = this.tools.find((t) => t.name === "get_apod");
        } else if (
          lowerMessage.includes("mission") &&
          (lowerMessage.includes("upcoming") ||
            lowerMessage.includes("artemis") ||
            lowerMessage.includes("europa"))
        ) {
          directTool = this.tools.find((t) => t.name === "get_missions");
        } else if (
          lowerMessage.includes("asteroid") ||
          lowerMessage.includes("neo")
        ) {
          directTool = this.tools.find(
            (t) => t.name === "get_near_earth_objects",
          );
        } else if (
          lowerMessage.includes("mars") &&
          (lowerMessage.includes("photo") || lowerMessage.includes("image"))
        ) {
          directTool = this.tools.find((t) => t.name === "get_mars_photos");
        }

        // If direct pattern match found, use it immediately
        if (directTool) {
          console.log(
            `Direct pattern match - executing tool: ${directTool.name}`,
          );
          try {
            const toolResult = await directTool.invoke(message);
            console.log("Tool result:", toolResult);

            let toolData;
            try {
              toolData = JSON.parse(toolResult);
            } catch {
              toolData = { type: "text", content: toolResult };
            }

            // Generate brief intro
            const responseMessages = [
              {
                role: "system" as const,
                content: `Write a SHORT 2-3 sentence intro for ${directTool.name} results. Use ### for header and emojis. Be brief!`,
              },
              { role: "user" as const, content: message },
            ];

            const finalResponse = await this.llm.invoke(responseMessages);

            return {
              role: "assistant",
              content: finalResponse.content as string,
              metadata: toolData.type
                ? {
                    type: toolData.type,
                    data: toolData,
                  }
                : undefined,
            };
          } catch (error) {
            console.error("Direct tool execution error:", error);
            // Continue to AI-based tool selection
          }
        }

        // AI-based tool selection
        // Create system message with tool descriptions
        const toolDescriptions = this.tools
          .map((tool) => `- ${tool.name}: ${tool.description}`)
          .join("\n");

        const systemPrompt = `You are AstroView AI, an intelligent space exploration assistant with access to multiple space agencies' data.

Available tools:
${toolDescriptions}

ALWAYS use tools when available for these queries:
- "astronomy picture", "APOD", "picture of the day", "space picture today" → use "get_apod"
- "missions", "artemis", "europa clipper", "upcoming launches", "space missions" → use "get_missions"
- "asteroids", "NEO", "near earth objects" → use "get_near_earth_objects"
- "mars photos", "mars rover", "mars images" → use "get_mars_photos"
- "ISRO", "indian space", "chandrayaan" → use "get_isro_missions"
- "space weather", "solar", "solar flares" → use "get_space_weather"
- "search nasa", "find images of" → use "search_nasa_media" with the search term
- "nasa technology", "patents" → use "get_tech_transfer"
- "space studies", "space biology" → use "get_osdr_studies"

RESPOND ONLY WITH JSON:
{"tool": "tool_name", "input": "search term or empty string"}

Or if no tool matches:
{"tool": null}`;

        // Check if we should use a tool
        const checkMessages = [
          { role: "system" as const, content: systemPrompt },
          {
            role: "user" as const,
            content: `Should I use a tool for this query? "${message}"\n\nRespond with JSON like {"tool": "tool_name", "input": "query"} if yes, or {"tool": null} if no.`,
          },
        ];

        try {
          const toolCheckResponse = await this.llm.invoke(checkMessages);
          const toolCheckContent = toolCheckResponse.content as string;

          console.log("Tool check response:", toolCheckContent);

          // Try to parse tool decision
          const jsonMatch = toolCheckContent.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const toolDecision = JSON.parse(jsonMatch[0]);

            console.log("Tool decision:", toolDecision);

            if (toolDecision.tool && toolDecision.tool !== null) {
              // Find and execute the tool
              const tool = this.tools.find((t) => t.name === toolDecision.tool);
              if (tool) {
                console.log(`Executing tool: ${tool.name}`);
                const toolResult = await tool.invoke(
                  toolDecision.input || message,
                );

                console.log("Tool result:", toolResult);

                // Parse tool result
                let toolData;
                try {
                  toolData = JSON.parse(toolResult);
                } catch {
                  toolData = { type: "text", content: toolResult };
                }

                // Generate natural language response with tool data
                const responseMessages = [
                  {
                    role: "system" as const,
                    content: `You are AstroView AI presenting ${tool.name} data. Rules:
1. Write a SHORT 2-3 sentence intro about what you found
2. DO NOT describe the data in detail - the UI will display it beautifully
3. Use ### for the main header only
4. Use emojis 🚀🌌
5. Keep it brief - let the visual data speak for itself

Example for APOD: "### 🌌 Today's Astronomy Picture\n\nHere's today's stunning space image from NASA! The image and full details are displayed below. 🔭✨"

Example for missions: "### 🚀 Space Missions\n\nI found ${toolData.missions?.length || "several"} exciting space missions! Check out the details below. 🛸"`,
                  },
                  { role: "user" as const, content: message },
                  {
                    role: "assistant" as const,
                    content: `I fetched ${tool.name} data. Write a very brief engaging intro (2-3 sentences max).`,
                  },
                ];

                const finalResponse = await this.llm.invoke(responseMessages);

                return {
                  role: "assistant",
                  content: finalResponse.content as string,
                  metadata: toolData.type
                    ? {
                        type: toolData.type,
                        data: toolData,
                      }
                    : undefined,
                };
              }
            }
          }
        } catch (toolError) {
          console.warn("Tool execution failed:", toolError);
          // Continue to conversation fallback
        }
      }

      // Fallback to normal conversation (no tools or tool failed)
      if (this.llm) {
        const systemMessage = {
          role: "system" as const,
          content: `You are AstroView AI, a knowledgeable space exploration assistant. ${
            this.useToolsMode ? "I tried to use tools but couldn't. " : ""
          }Provide information about space, astronomy, missions, and space agencies based on your knowledge. Be helpful, accurate, and enthusiastic!`,
        };

        const messages = [
          systemMessage,
          ...history.map((msg) => ({
            role: msg.role as "user" | "assistant" | "system",
            content: msg.content,
          })),
          { role: "user" as const, content: message },
        ];

        const response = await this.llm.invoke(messages);

        return {
          role: "assistant",
          content: response.content as string,
        };
      }

      throw new Error("LLM not initialized");
    } catch (error) {
      console.error("Chat error:", error);
      return {
        role: "assistant",
        content:
          "I apologize, but I'm having trouble processing your request right now. Please try again later.",
      };
    }
  }

  isUsingTools(): boolean {
    return this.useToolsMode;
  }

  getAvailableTools(): string[] {
    return this.tools.map((tool) => tool.name);
  }
}

// Singleton instance
let agentInstance: SpaceIntelligenceAgent | null = null;

export const getAgent = async (
  apiKey: string,
): Promise<SpaceIntelligenceAgent> => {
  if (!agentInstance) {
    agentInstance = new SpaceIntelligenceAgent(apiKey);
    // Wait a bit for initialization
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  return agentInstance;
};

export const resetAgent = () => {
  agentInstance = null;
};
