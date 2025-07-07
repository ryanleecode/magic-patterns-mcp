# Magic Patterns MCP Server

A Model Context Protocol (MCP) server that provides tools for creating UI designs and components using the Magic Patterns API. This server enables AI assistants to generate React components, HTML/CSS layouts, and complete web interfaces through natural language prompts.

## Features

- **Create Design Tool**: Generate UI components and layouts from text descriptions
- **Multiple Frameworks**: Support for React, HTML/Tailwind, ShadCN, Chakra UI, and Mantine
- **Quality Modes**: Choose between 'fast' for quick iterations or 'best' for high-quality results
- **Flexible Input**: Accept design descriptions, existing code to modify, or any design request
- **Complete Output**: Get source files, compiled assets, preview URLs, and editor links

## Installation & Usage

### With Bun (Recommended)

```bash
# Run directly from source
bun run src/main.ts

# Build and run binary
bun run build
./dist/magic-patterns-mcp
```

### With Docker

```bash
# Build the image
docker build -t magic-patterns-mcp .

# Run the server
docker run --rm -i magic-patterns-mcp
```

### With NPM (when published)

```bash
npx magic-patterns-mcp
```

## Claude Desktop Integration

Add this MCP server to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "magic-patterns-mcp": {
      "command": "bun",
      "args": ["run", "/path/to/magic-patterns-mcp/src/main.ts"],
      "env": {
        "MAGIC_PATTERNS_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

Or if using the binary:

```json
{
  "mcpServers": {
    "magic-patterns-mcp": {
      "command": "/path/to/magic-patterns-mcp/dist/magic-patterns-mcp",
      "env": {
        "MAGIC_PATTERNS_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

## Environment Variables

- `MAGIC_PATTERNS_API_KEY`: Your Magic Patterns API key (required)

## Available Tools

### create_design

Creates a new design pattern using the Magic Patterns API.

**Parameters:**
- `prompt` (required): The design request - can be a description, existing React code to modify, or any design request
- `mode` (optional): 
  - `"best"` (default): Higher quality results, recommended for most use cases
  - `"fast"`: Quick generation for simple fixes or time-sensitive requests
- `presetId` (optional): Framework/styling preset (default: "html-tailwind")
  - `"html-tailwind"`: HTML with Tailwind CSS
  - `"shadcn-tailwind"`: ShadCN components with Tailwind
  - `"chakraUi-inline"`: Chakra UI components
  - `"mantine-inline"`: Mantine components

**Returns:**
- Design ID and URLs (editor, preview)
- Source files (React/HTML/CSS)
- Compiled assets
- Chat conversation history

## Development

### Prerequisites

- [Bun](https://bun.sh/) runtime
- Magic Patterns API key

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd magic-patterns-mcp

# Install dependencies
bun install

# Set your API key
export MAGIC_PATTERNS_API_KEY="your-api-key"

# Run in development mode
bun run dev
```

### Building

```bash
# Create binary executable
bun run build

# The binary will be created at ./dist/magic-patterns-mcp
```

### Docker Development

```bash
# Build development image
docker build -f Dockerfile.alternative -t magic-patterns-mcp:dev .

# Run with API key
docker run --rm -i -e MAGIC_PATTERNS_API_KEY="your-key" magic-patterns-mcp:dev
```

## Project Structure

```
magic-patterns-mcp/
├── src/
│   ├── main.ts           # MCP server entry point
│   └── MagicPatterns.ts  # Magic Patterns API integration
├── scripts/
│   └── copy-package-json.ts  # Build helper
├── dist/                 # Compiled binary output
├── Dockerfile           # Production container
├── Dockerfile.alternative  # Development container
└── package.json
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Related

- [Magic Patterns](https://magicpatterns.com/) - UI component generation platform
- [Model Context Protocol](https://github.com/anthropics/mcp) - Protocol specification
- [Claude Desktop](https://claude.ai/desktop) - AI assistant with MCP support
