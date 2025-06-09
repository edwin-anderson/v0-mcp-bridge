# Communication Protocol Specification

## Overview
This document defines the standardized communication protocol between Claude Code and the v0 MCP server. It ensures consistent, structured interactions that maximize the effectiveness of UI component generation.

## Request/Response Architecture

### Request Types
1. **analyze_requirements** - Analyze user requirements and plan component structure
2. **generate_component** - Generate specific UI component code
3. **improve_component** - Refactor or enhance existing component code
4. **clarify_component** - Request clarification on specific aspects

## Request Format Specifications

### 1. Requirements Analysis Request
Used when Claude Code needs to understand what components are needed for a user's UI request.

```typescript
interface AnalyzeRequirementsRequest {
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

**Example:**
```json
{
  "action": "analyze_requirements",
  "component_info": {
    "description": "Create a dashboard with user stats, activity feed, and charts"
  },
  "design_context": {
    "design_system": "shadcn/ui + tailwind",
    "existing_components": ["Button", "Card", "Avatar", "Input"],
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

### 2. Component Generation Request
Used to generate specific UI components based on analysis or direct user requests.

```typescript
interface GenerateComponentRequest {
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

### 3. Component Improvement Request
Used to enhance or refactor existing components.

```typescript
interface ImproveComponentRequest {
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

### 4. Clarification Request
Used when previous responses need clarification or are incomplete.

```typescript
interface ClarifyComponentRequest {
  action: "clarify_component";
  missing_info: string[];
  component_name: string;
  specific_questions: string[];
}
```

## Response Format Specifications

### 1. Analysis Response
Response to requirements analysis requests.

```typescript
interface AnalysisResponse {
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

interface ComponentInfo {
  name: string;
  type: "ui_component" | "page_component" | "layout_component";
  location: string;
  priority: "high" | "medium" | "low";
  dependencies: string[];
  description: string;
}

interface IntegrationPoint {
  component: string;
  integrates_with: string[];
  shared_props?: Record<string, any>;
}
```

### 2. Component Generation Response
Response containing the generated component code and integration instructions.

```typescript
interface ComponentResponse {
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

interface IntegrationStep {
  file: string;
  action: "import" | "modify" | "create";
  code_snippet?: string;
  description: string;
}
```

### 3. Error Response
Response when something goes wrong or clarification is needed.

```typescript
interface ErrorResponse {
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

## Communication Flow Examples

### Example 1: Dashboard Creation
```
1. User: "Create a admin dashboard with user stats and charts"

2. Claude Code → v0 MCP:
{
  "action": "analyze_requirements",
  "component_info": {
    "description": "Admin dashboard with user stats and charts"
  },
  // ... context
}

3. v0 MCP → Claude Code:
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
        "description": "Display individual statistics"
      },
      {
        "name": "Dashboard",
        "type": "page_component", 
        "location": "components/sections/dashboard.tsx",
        "priority": "medium",
        "dependencies": ["StatCard", "Chart"],
        "description": "Main dashboard layout"
      }
    ],
    "build_order": ["StatCard", "Dashboard"]
  }
}

4. Claude Code → v0 MCP (for each component):
{
  "action": "generate_component",
  "component_info": {
    "name": "StatCard",
    "type": "ui_component",
    // ... details
  }
}

5. v0 MCP → Claude Code:
{
  "response_type": "component",
  "component": {
    "name": "StatCard",
    "code": "import React from 'react';\n// ... component code",
    // ... integration details
  }
}
```

## Iteration Rules

### Maximum Iterations
- **Analysis requests**: 2 iterations max
- **Component generation**: 3 iterations max
- **Clarification requests**: 2 iterations max
- **Total per user request**: 5 v0 MCP calls max

### Iteration Triggers
Claude Code should iterate when:
- Response is missing required fields
- Integration instructions are unclear
- Component dependencies are unresolved
- Code quality issues are detected

### Iteration Request Format
```json
{
  "action": "clarify_component",
  "missing_info": ["integration_steps", "props_interface"],
  "component_name": "StatCard",
  "specific_questions": [
    "How should StatCard integrate with existing Card component?",
    "What TypeScript interface should be exported?"
  ]
}
```

## Quality Assurance

### Required Response Elements
Every component generation response MUST include:
- ✅ Complete TypeScript component code
- ✅ Props interface definition
- ✅ Integration steps with code examples
- ✅ Import statements for usage
- ✅ Dependency information

### Validation Checklist
Claude Code must verify:
- ✅ Code compiles without TypeScript errors
- ✅ All imports are resolvable
- ✅ Component follows project conventions
- ✅ Integration steps are actionable
- ✅ No conflicts with existing components

## Error Handling

### Common Error Scenarios
1. **v0 API unavailable** - Graceful degradation
2. **Invalid API key** - Clear error message
3. **Rate limiting** - Retry with backoff
4. **Incomplete responses** - Iteration up to limits
5. **Integration conflicts** - Prioritize existing patterns

### Error Response Format
```json
{
  "response_type": "error",
  "error": {
    "code": "API_UNAVAILABLE",
    "message": "v0 API is currently unavailable",
    "details": "Connection timeout after 30 seconds"
  },
  "suggestions": [
    "Try again in a few minutes",
    "Check v0 service status"
  ],
  "retry_possible": true
}
```

This protocol ensures efficient, structured communication between Claude Code and v0 MCP while maintaining code quality and preventing infinite loops.
