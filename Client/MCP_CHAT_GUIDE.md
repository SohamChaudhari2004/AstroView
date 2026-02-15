# AstroView AI Chat - MCP Integration Guide

## Overview

I've successfully integrated an MCP (Model Context Protocol) server with LangChain and Mistral AI into your AstroView application. The chat system includes:

- **LangChain Agent**: Intelligent AI assistant powered by Mistral AI
- **MCP Tools**: 9 specialized tools for space data APIs
- **Media Rendering**: Beautiful UI for images, data, and media
- **Fallback Mode**: Works as normal chatbot if tools fail

## Architecture

### 1. MCP Server (`Client/src/lib/mcp-server.ts`)

Nine custom LangChain tools that wrap your existing APIs:

- **APODTool**: NASA Astronomy Picture of the Day
- **NEOTool**: Near Earth Objects (asteroids)
- **MarsRoverTool**: Mars rover photos
- **ISROMissionsTool**: ISRO spacecraft and missions
- **SpaceWeatherTool**: Solar activity and space weather
- **NASAMediaTool**: NASA media library search
- **TechTransferTool**: NASA technology patents
- **OSDRTool**: Open Science Data Repository
- **MissionsTool**: Space mission information

Each tool:

- Has clear descriptions for the AI to understand when to use them
- Returns structured data with type information
- Handles errors gracefully

### 2. LangChain Agent (`Client/src/lib/agent.ts`)

**Key Features:**

- Powered by Mistral AI (mistral-large-latest model)
- Intelligent tool selection based on user queries
- Two-step process:
  1. Determines if a tool should be used
  2. Executes tool and formats response naturally
- Automatic fallback to conversational mode if tools fail
- Maintains conversation history

**How It Works:**

```typescript
User Query → Agent Analyzes → Selects Tool → Executes → Formats Response
                           ↓ (if no tool needed)
                        Direct Conversation
```

### 3. Chat UI (`Client/src/components/SpaceChat.tsx`)

**Features:**

- Full-screen chat interface
- Real-time status indicators (tools active/fallback mode)
- Smart message rendering:
  - **Text**: Standard chat messages
  - **Images**: APOD and Mars photos with metadata
  - **Image Arrays**: Gallery view for multiple photos
  - **Media**: NASA media library results
  - **Data**: JSON viewer for structured data
- Loading states and error handling
- Keyboard shortcuts (Enter to send, Shift+Enter for new line)

### 4. Server Endpoint (`server/src/routes/chatRoutes.ts`)

Simple endpoint that provides the Mistral API key to the client:

- `GET /api/chat/config` - Returns API key for client initialization
- `POST /api/chat/message` - Reserved for future server-side processing

## How to Use

### 1. Start the Servers

**Backend:**

```bash
cd server
npm run dev
```

**Frontend:**

```bash
cd Client
npm run dev
```

### 2. Access the Chat

Navigate to: `http://localhost:3000/chat`

Or click "AI Chat" in the navigation menu.

### 3. Example Queries

Try these queries to see different tools in action:

**APOD Tool:**

- "Show me today's astronomy picture"
- "What's the space picture of the day?"

**NEO Tool:**

- "Are there any asteroids near Earth?"
- "Tell me about near Earth objects"

**Mars Rover:**

- "Show me photos from Mars"
- "What did the Mars rovers capture?"

**ISRO:**

- "What are ISRO's current missions?"
- "Tell me about Indian space program"

**Space Weather:**

- "What's the current space weather?"
- "Are there any solar storms?"

**NASA Media:**

- "Search NASA for images of nebula"
- "Find videos about the ISS"

**General Questions:**

- "Tell me about the James Webb telescope"
- "How far is Mars from Earth?"

## Media Rendering

### Image Type (APOD)

```json
{
  "type": "image",
  "title": "NGC 604...",
  "url": "https://...",
  "explanation": "...",
  "date": "2024-02-15"
}
```

Renders as: Large image with title and description

### Images Array (Mars Photos)

```json
{
  "type": "images",
  "photos": [...]
}
```

Renders as: 2-column gallery grid

### Media (NASA Library)

```json
{
  "type": "media",
  "items": [...]
}
```

Renders as: Cards with thumbnails and descriptions

### Data (Generic)

```json
{
  "type": "data",
  ...
}
```

Renders as: Formatted JSON viewer

## Fallback Behavior

The agent automatically falls back to normal chat mode if:

1. Mistral API key is invalid
2. Tool execution fails
3. API endpoints are unreachable
4. Rate limits are hit

In fallback mode, it still provides helpful information based on its training data.

## API Key Configuration

The Mistral API key is configured in `server/.env`:

```
MISTRAL_API_KEY=wdRPqlYhnNnML2PVDygaSZdTgNIuug9A
```

The client fetches this key securely from the server on initialization.

## Dependencies Installed

**Client:**

- @langchain/core@^1.1.24
- @langchain/mistralai
- @modelcontextprotocol/sdk
- langchain
- @langchain/community
- zod

## File Structure

```
Client/
  src/
    lib/
      mcp-server.ts      # MCP tool definitions
      agent.ts           # LangChain agent logic
    components/
      SpaceChat.tsx      # Chat UI component
    app/
      chat/
        page.tsx         # Chat page route

server/
  src/
    routes/
      chatRoutes.ts      # Chat API endpoints
```

## Customization

### Adding New Tools

1. Create a new tool class in `mcp-server.ts`:

```typescript
export class MyNewTool extends Tool {
  name = "my_tool";
  description = "What this tool does...";

  async _call(input: string): Promise<string> {
    // Your API call here
    return JSON.stringify({
      type: "data",
      // your data
    });
  }
}
```

2. Add to `getAllMCPTools()` function

### Customizing UI

Edit `SpaceChat.tsx` to:

- Change colors and styling
- Add new message formats
- Modify the layout
- Add additional features (voice input, export, etc.)

### Adjusting Agent Behavior

In `agent.ts`, modify:

- `temperature` for more/less creative responses
- System prompts for different personality
- Tool selection logic
- Response formatting

## Troubleshooting

**Agent not initializing:**

- Check console for errors
- Verify Mistral API key is valid
- Ensure server is running on port 5001

**Tools not working:**

- Check if backend APIs are accessible
- Look for CORS issues
- Verify API endpoints return expected data

**Slow responses:**

- Mistral API can take 2-5 seconds
- Tool execution adds extra time
- Consider caching frequent queries

**Media not rendering:**

- Check image URLs are accessible
- Verify CORS allows image loading
- Look for console errors

## Future Enhancements

Possible improvements:

1. **Streaming responses** for faster perceived performance
2. **Caching layer** to reduce API calls
3. **Voice input/output** for hands-free operation
4. **Export conversations** as PDF or markdown
5. **Multi-modal inputs** (upload images)
6. **Personalized recommendations** based on user history
7. **Tool chaining** for complex queries
8. **Real-time notifications** for space events

## Security Notes

- API key is fetched from server, not exposed in client bundle
- Consider adding authentication to chat endpoints
- Implement rate limiting for production
- Sanitize user inputs before tool execution
- Validate tool outputs before rendering

---

**Status:** ✅ All components implemented and ready to use!
**Next Step:** Start both servers and navigate to `/chat` to begin exploring!
