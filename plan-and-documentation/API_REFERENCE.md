# API Reference Documentation

## v0 MCP Server API

### Overview
The v0 MCP server provides tools for generating React/Next.js UI components using v0.dev's official API. All tools follow the standardized request/response format defined in the communication protocol.

## Available Tools

### 1. configure_v0

**Description**: Configure the v0 API with your API key from v0.dev

**Parameters**:
```typescript
{
  apiKey: string; // Your v0.dev API key from https://v0.dev/chat/settings/keys
}
```

**Response**:
```typescript
{
  success: boolean;
  message: string;
  api_status?: "connected" | "invalid_key" | "rate_limited";
}
```

**Example**:
```json
{
  "apiKey": "v0_1234567890abcdef..."
}
```

**Usage Notes**:
- Must be called before any component generation
- API key is validated by making a test request
- Stores key securely for subsequent requests

---

### 2. analyze_requirements

**Description**: Analyze user requirements and determine what components need to be built

**Parameters**:
```typescript
{
  action: "analyze_requirements";
  component_info: {
    description: string; // User's original request
  };
  design_context: {
    design_system: "shadcn/ui + tailwind";
    existing_components: string[]; // Available components
    framework: "nextjs" | "react";
    responsive: boolean;
    accessibility: boolean;
  };
  project_context: {
    current_structure: string; // Brief folder structure
    target_location: string; // Where components should go
  };
}
```

**Response**:
```typescript
{
  response_type: "analysis";
  analysis: {
    components_needed: ComponentInfo[];
    build_order: string[];
    integration_points: IntegrationPoint[];
  };
  recommendations: {
    reusable_components: string[];
    design_patterns: string[];
    potential_issues: string[];
  };
}
```

**Example Request**:
```json
{
  "action": "analyze_requirements",
  "component_info": {
    "description": "Create a user dashboard with profile stats and activity feed"
  },
  "design_context": {
    "design_system": "shadcn/ui + tailwind",
    "existing_components": ["Button", "Card", "Avatar"],
    "framework": "nextjs",
    "responsive": true,
    "accessibility": true
  },
  "project_context": {
    "current_structure": "app/, components/ui/, components/sections/",
    "target_location": "components/sections/dashboard"
  }
}
```

**Example Response**:
```json
{
  "response_type": "analysis",
  "analysis": {
    "components_needed": [
      {
        "name": "StatCard",
        "type": "ui_component",
        "location": "components/ui/stat-card.tsx",
        "priority": "high",
        "dependencies": ["Card"],
        "description": "Display individual user statistics"
      },
      {
        "name": "ActivityFeed",
        "type": "ui_component", 
        "location": "components/ui/activity-feed.tsx",
        "priority": "medium",
        "dependencies": ["Avatar", "Card"],
        "description": "Show user activity timeline"
      }
    ],
    "build_order": ["StatCard", "ActivityFeed", "Dashboard"],
    "integration_points": [
      {
        "component": "Dashboard",
        "integrates_with": ["StatCard", "ActivityFeed"],
        "shared_props": {"user": "User"}
      }
    ]
  },
  "recommendations": {
    "reusable_components": ["StatCard"],
    "design_patterns": ["Compound components for dashboard sections"],
    "potential_issues": ["Consider loading states for async data"]
  }
}
```

---

### 3. generate_component

**Description**: Generate a specific UI component with complete code and integration instructions

**Parameters**:
```typescript
{
  action: "generate_component";
  component_info: {
    name: string;
    type: "ui_component" | "page_component" | "layout_component";
    location: string; // File path
    description: string;
  };
  design_context: {
    design_system: "shadcn/ui + tailwind";
    existing_components: string[];
    framework: "nextjs" | "react";
    responsive: boolean;
    accessibility: boolean;
  };
  integration_context: {
    parent_component?: string;
    props_needed?: Record<string, string>;
    dependencies: string[];
  };
  constraints: {
    file_structure: string;
    naming_convention?: string;
    style_guide?: string;
  };
}
```

**Response**:
```typescript
{
  response_type: "component";
  component: {
    name: string;
    code: string; // Complete TypeScript component code
    file_path: string;
    exports: string[];
    props_interface: Record<string, any>;
  };
  integration: {
    imports_needed: string[];
    usage_example: string;
    integration_steps: IntegrationStep[];
  };
  dependencies: {
    npm_packages: string[];
    internal_components: string[];
    missing_components: string[];
  };
  notes: {
    customization_hints: string[];
    accessibility_features: string[];
    responsive_breakpoints: string[];
  };
}
```

**Example Request**:
```json
{
  "action": "generate_component",
  "component_info": {
    "name": "StatCard",
    "type": "ui_component",
    "location": "components/ui/stat-card.tsx",
    "description": "Card component displaying a statistic with value, label, and trend"
  },
  "design_context": {
    "design_system": "shadcn/ui + tailwind",
    "existing_components": ["Card", "Button"],
    "framework": "nextjs",
    "responsive": true,
    "accessibility": true
  },
  "integration_context": {
    "parent_component": "Dashboard",
    "props_needed": {
      "value": "string | number",
      "label": "string",
      "trend": "number"
    },
    "dependencies": ["Card"]
  },
  "constraints": {
    "file_structure": "TypeScript, default export",
    "naming_convention": "kebab-case files, PascalCase components",
    "style_guide": "Follow shadcn/ui patterns"
  }
}
```

---

### 4. improve_component

**Description**: Refactor or enhance an existing component based on specific requirements

**Parameters**:
```typescript
{
  action: "improve_component";
  component_info: {
    name: string;
    current_code: string;
    improvements_requested: string[];
  };
  design_context: {
    design_system: "shadcn/ui + tailwind";
    framework: "nextjs" | "react";
  };
}
```

**Response**:
```typescript
{
  response_type: "component";
  component: {
    name: string;
    code: string; // Improved component code
    file_path: string;
    exports: string[];
    props_interface: Record<string, any>;
  };
  improvements_applied: string[];
  migration_notes?: string[];
}
```

---

### 5. generate_ui_from_image

**Description**: Generate UI components from design images, wireframes, or mockups

**Parameters**:
```typescript
{
  imageBase64: string; // Base64 encoded image data
  prompt: string; // Additional description or instructions
  framework: "nextjs" | "react";
}
```

**Response**: Same as `generate_component`

**Usage Notes**:
- Supports common image formats (PNG, JPG, SVG)
- Works best with clear wireframes or mockups
- Additional text prompt helps clarify intent

---

### 6. get_ui_templates

**Description**: Browse available UI component templates and patterns

**Parameters**:
```typescript
{
  category?: "landing-page" | "dashboard" | "ecommerce" | "forms" | 
           "navigation" | "data-display" | "layout" | "interactive";
}
```

**Response**:
```typescript
{
  category?: string;
  templates: string[] | Record<string, string[]>;
  message: string;
}
```

**Available Categories**:
- **landing-page**: Hero sections, feature grids, testimonials
- **dashboard**: KPI cards, charts, activity feeds
- **ecommerce**: Product cards, shopping carts, checkout flows
- **forms**: Contact forms, multi-step wizards, validation
- **navigation**: Navbars, sidebars, breadcrumbs
- **data-display**: Tables, lists, timelines
- **layout**: Grid systems, containers, responsive layouts
- **interactive**: Modals, dropdowns, carousels

---

### 7. check_api_status

**Description**: Check v0 API connection status and usage limits

**Parameters**: None

**Response**:
```typescript
{
  status: "connected" | "disconnected" | "error";
  model: string; // Current v0 model
  limits: {
    "Max messages per day": string;
    "Max context window": string;
    "Max output": string;
  };
  apiKey: string; // Masked API key
  message: string;
}
```

## Error Responses

All tools can return error responses with this format:

```typescript
{
  response_type: "error";
  error: {
    code: string;
    message: string;
    details?: string;
  };
  suggestions?: string[];
  retry_possible: boolean;
}
```

**Common Error Codes**:
- `API_NOT_CONFIGURED`: v0 API key not set
- `API_UNAVAILABLE`: v0 service unreachable
- `INVALID_API_KEY`: API key invalid or expired
- `RATE_LIMITED`: Too many requests
- `VALIDATION_ERROR`: Invalid request parameters
- `GENERATION_FAILED`: Component generation failed
- `MAX_ITERATIONS_REACHED`: Hit iteration limits

## Rate Limits & Constraints

### v0 API Limits
- **Messages per day**: 200 (free tier)
- **Context window**: 128,000 tokens
- **Max output**: 32,000 tokens
- **Request timeout**: 30 seconds

### MCP Server Limits
- **Max iterations per request**: 5
- **Analysis iterations**: 2 max
- **Component generation iterations**: 3 max
- **Clarification iterations**: 2 max
- **Memory usage**: <100MB per session

## Best Practices

### Effective Prompting
- Be specific about component requirements
- Mention existing components to reuse
- Specify responsive and accessibility needs
- Include integration context

### Error Handling
- Always check for error responses
- Implement retry logic for retryable errors
- Provide fallbacks when v0 is unavailable
- Validate responses before using generated code

### Performance Optimization
- Use `analyze_requirements` before generating multiple components
- Cache analysis results when generating related components
- Batch related component requests
- Monitor API usage to avoid rate limits

This API reference provides everything needed to integrate with the v0 MCP server effectively.
