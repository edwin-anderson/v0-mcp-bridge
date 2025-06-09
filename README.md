# v0 MCP Server

**Designed by Edwin Anderson**

A production-ready Model Context Protocol (MCP) server that bridges the gap between AI development tools and v0.dev's superior UI generation capabilities. This server enables any MCP-compatible application (Claude Desktop, Claude Code, or custom implementations) to leverage v0.dev's specialized expertise in React/Next.js component generation, creating beautiful and modern UI designs with ease.

## 🎯 Project Vision

This MCP server creates perfect synergy between AI development tools and v0.dev's specialized UI generation:

- **v0.dev handles**: Beautiful UI components, modern design patterns, shadcn/ui integration, responsive layouts
- **Your AI tool handles**: Project structure, file organization, state management, API integration, testing, and overall development workflow

The result is the best of both worlds: stunning UI components seamlessly integrated into well-architected applications, accessible from any MCP-compatible environment.

## 🎉 All Phases Complete ✅

**Current Status**: Phase 4 Complete - Production ready with comprehensive features

### ✨ Key Features

- **8 Comprehensive Tools**: Complete workflow from analysis to advanced generation
- **22 UI Templates**: Pre-built patterns across 6 categories (forms, cards, navigation, layouts, data-display, modals)
- **Multimodal Support**: Generate components from wireframes, designs, and screenshots
- **Enhanced Error Handling**: Descriptive error messages and robust validation
- **Type Safety**: Full TypeScript coverage with comprehensive Zod validation
- **Production Ready**: Optimized code, cleanup, and enhanced documentation

### 🛠️ Available Tools

**Foundation Tools:**

- `test_connection` - Test v0.dev API connectivity with detailed diagnostics
- `configure_v0` - Configure and validate API settings

**Core Generation Tools:**

- `analyze_requirements` - Break down UI requirements into component structure (UI decomposition only)
- `generate_component` - Generate React/Next.js components with shadcn/ui + Tailwind
- `improve_component` - Enhance existing components with targeted improvements

**Advanced Features:**

- `generate_from_image` - Generate components from wireframes/designs/screenshots (multimodal)
- `generate_from_template` - Create components using 22 pre-built UI pattern templates
- `list_templates` - Browse available templates by category (forms, cards, navigation, layouts, data-display, modals)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- v0.dev API key ([get one here](https://v0.dev))
- An MCP-compatible application (Claude Desktop, Claude Code, or custom implementation)

### Installation

Choose your preferred installation method:

#### Option 1: Direct from GitHub (Recommended)

**No cloning or building required!** Use npx to run directly from GitHub:

1. **Configure in your MCP client**:
   
   **For Claude Desktop:**
   Add to your MCP settings:
   ```json
   {
     "mcpServers": {
       "v0-mcp": {
         "command": "npx",
         "args": ["--yes", "github:edwin-anderson/v0-mcp-bridge"],
         "env": {
           "V0_API_KEY": "your_v0_api_key"
         }
       }
     }
   }
   ```

   **For Claude Code (Recommended - Project Level):**
   ```bash
   claude mcp add v0-mcp -e V0_API_KEY=your_v0_api_key -- npx --yes github:edwin-anderson/v0-mcp-bridge
   ```

   **For Claude Code (User Level):**
   ```bash
   claude mcp add v0-mcp -s user -e V0_API_KEY=your_v0_api_key -- npx --yes github:edwin-anderson/v0-mcp-bridge
   ```

   > 💡 **Tip**: We recommend project-level installation (without `-s user`) so you have better control and visibility over which projects use the v0 MCP server.

   **For custom MCP implementations:**
   Use the standard MCP stdio transport to launch the server via npx.

2. **That's it!** Your MCP client will automatically download and run the latest version.

#### Option 2: Local Development Setup

For local development or customization:

1. **Clone and install dependencies**:

   ```bash
   git clone https://github.com/edwin-anderson/v0-mcp-bridge.git
   cd v0-mcp-bridge
   npm install
   ```

2. **Configure environment**:

   ```bash
   cp .env.example .env
   # Edit .env and add: V0_API_KEY=your_v0_api_key_here
   ```

3. **Build and test**:

   ```bash
   npm run build
   npm run typecheck
   ```

4. **Configure in your MCP client**:
   ```json
   {
     "mcpServers": {
       "v0-mcp": {
         "command": "/path/to/node",
         "args": ["/path/to/v0-mcp-bridge/dist/index.js"],
         "env": {
           "V0_API_KEY": "your_v0_api_key"
         }
       }
     }
   }
   ```

## 📋 Available Commands

- `npm run build` - Build TypeScript to JavaScript (required before using with Claude Code)
- `npm run dev` - Development with hot reload
- `npm run typecheck` - TypeScript type checking
- `npm start` - Run the built server
- `npx fastmcp dev src/index.ts` - Test server standalone
- `npx fastmcp inspect src/index.ts` - Inspect available tools

## 🎨 Template Library (22 Templates)

### Forms (6)

- `login-form`, `contact-form`, `signup-form`, `checkout-form`, `search-form`, `settings-form`

### Cards (3)

- `product-card`, `user-profile-card`, `pricing-card`

### Navigation (2)

- `header-nav`, `sidebar-nav`

### Layouts (6)

- `dashboard-grid`, `hero-section`, `auth-layout`, `landing-page`, `profile-layout`, `error-page`

### Data Display (2)

- `data-table`, `stats-grid`

### Modals (3)

- `confirmation-dialog`, `image-gallery`, `drawer-panel`

Each template includes multiple variants and customization options.

## 🔧 Usage Examples

### Basic Component Generation

```javascript
// Your MCP client will use:
generate_component({
  name: "UserCard",
  description: "Display user information with avatar and details",
  framework: "nextjs",
  responsive: true,
  accessibility: true,
});
```

### Template-Based Generation

```javascript
// Generate from template:
generate_from_template({
  name: "ContactForm",
  template: "contact-form",
  variant: "with-validation",
  customizations: ["Add phone field", "Custom submit text"],
});
```

### Multimodal Generation

```javascript
// Generate from wireframe:
generate_from_image({
  name: "Dashboard",
  images: [{ data: "base64...", type: "wireframe" }],
  description: "Admin dashboard layout",
});
```

## 🏗️ Architecture

```
src/
├── client/           # V0 API client with enhanced error handling
├── server/          # FastMCP server with 8 tools
├── services/        # Templates and prompt management
├── types/           # TypeScript definitions and Zod schemas
├── utils/           # Configuration, logging, and utilities
└── index.ts         # Main entry point with graceful shutdown

plan-and-documentation/  # Comprehensive project docs
├── CLAUDE_MD_RULES.md   # Claude Code integration rules
├── TASK_TRACKER.md      # Phase completion tracking
└── ...                  # Additional documentation
```

## 🔒 Environment Variables

- `V0_API_KEY` - Your v0.dev API key (required)
  - Get from [v0.dev](https://v0.dev)
  - Used for component generation API calls
  - Costs managed by your own v0.dev account

## 📚 Documentation

- **[CLAUDE_MD_RULES.md](plan-and-documentation/CLAUDE_MD_RULES.md)** - Complete integration guide for Claude Code
- **[TASK_TRACKER.md](plan-and-documentation/TASK_TRACKER.md)** - Implementation progress and technical decisions
- **[API_REFERENCE.md](plan-and-documentation/API_REFERENCE.md)** - Detailed API documentation

## 🎯 Key Design Principles

- **Universal Compatibility**: Works with any MCP-compatible client (Claude Desktop, Claude Code, custom implementations)
- **Clear Boundaries**: v0 handles UI generation, your AI tool handles project structure
- **Type Safety**: Full TypeScript coverage with runtime validation
- **Error Recovery**: Comprehensive error handling with actionable messages
- **Template-Driven**: 22 pre-built patterns for rapid development
- **Multimodal**: Support for wireframes, designs, and screenshots
- **Production Ready**: Optimized, tested, and documented

## ⚠️ Important Notes

- **Build Required**: Run `npm run build` after code changes before testing with Claude Code
- **API Costs**: v0.dev API usage is charged to your account - use wisely
- **Model**: Uses `v0-1.5-md` model (not `v0-preview`)
- **Stdio Transport**: Configured for Claude Code MCP integration
- **No Console Logging**: MCP-safe logging to avoid JSON-RPC conflicts

## 📦 Distribution & Publishing

This project is configured for easy distribution via GitHub + npx:

- **Built files included**: The `dist/` directory is committed to the repository
- **NPX ready**: Users can run directly from GitHub without cloning/building
- **Auto-updates**: npx fetches the latest version from GitHub on each run
- **Zero maintenance**: No npm publishing or version management required

### Publishing Updates

1. Make your changes in `src/`
2. Run `npm run build` to update `dist/`
3. Commit both source and built files
4. Push to GitHub - users automatically get the latest version

## 🤝 Contributing

This is a complete implementation ready for production use. The codebase is well-documented and follows TypeScript best practices.

### Development Workflow

1. Clone the repository
2. Install dependencies: `npm install`
3. Make changes in `src/`
4. Build: `npm run build`
5. Test locally with Claude Code
6. Commit both source and built files
