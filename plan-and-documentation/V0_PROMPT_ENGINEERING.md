# v0 Prompt Engineering Guide

This document defines the prompt engineering strategies for the v0 MCP server to ensure consistent, high-quality UI component generation.

## Core Principles

### 1. Be Explicit About Output Format
v0 models are trained on UI generation, but we need to guide them to produce consistent, parseable output:
- Always request complete, working code
- Specify export format (default export vs named exports)
- Request TypeScript types and interfaces
- Ask for import statements at the top

### 2. Provide Rich Context
v0 performs best with detailed context:
- Specify the exact design system (shadcn/ui)
- Mention the framework (Next.js App Router or React)
- List available components to encourage reuse
- Describe the component's purpose and usage

### 3. Structure Over Freedom
Constrain the output to ensure consistency:
- Request specific file structure
- Define naming conventions
- Specify prop interfaces
- Request integration examples

## Prompt Templates

### 1. Component Analysis Prompt

```typescript
const ANALYZE_REQUIREMENTS_PROMPT = `
You are a expert UI architect specializing in React and Next.js applications using shadcn/ui components.

Analyze the following UI requirements and provide a structured component breakdown:

USER REQUEST: {description}

CONTEXT:
- Framework: {framework}
- Design System: shadcn/ui with Tailwind CSS
- Existing Components: {existing_components}
- Project Structure: {project_structure}

Please analyze and respond with:

1. COMPONENTS NEEDED:
For each component, specify:
- Name: PascalCase component name
- Type: "ui_component" | "page_component" | "layout_component"
- Purpose: Clear description of what it does
- Dependencies: Other components it needs
- Priority: "high" | "medium" | "low"

2. BUILD ORDER:
List components in the order they should be built (dependencies first)

3. INTEGRATION POINTS:
- How components connect to each other
- Shared props or state
- Data flow between components

4. RECOMMENDATIONS:
- Reusable patterns to extract
- Potential performance considerations
- Accessibility requirements

Format your response as structured text, not JSON.
`;
```

### 2. Component Generation Prompt

```typescript
const GENERATE_COMPONENT_PROMPT = `
You are an expert React/Next.js developer. Create a production-ready component with the following specifications:

COMPONENT REQUIREMENTS:
- Name: {component_name}
- Type: {component_type}
- Description: {description}
- Location: {file_path}

TECHNICAL SPECIFICATIONS:
- Framework: {framework}
- TypeScript: Required with proper type definitions
- Design System: shadcn/ui components only
- Styling: Tailwind CSS classes only
- Responsive: {responsive}
- Accessibility: {accessibility}

AVAILABLE COMPONENTS:
You can import and use these shadcn/ui components:
{existing_components}

INTEGRATION CONTEXT:
{integration_context}

REQUIREMENTS:
1. Create a complete, working TypeScript component
2. Use only shadcn/ui components from the available list
3. Include all necessary imports at the top
4. Export as default: export default function {component_name}
5. Define TypeScript interface for props (if any)
6. Include helpful comments for complex logic
7. Follow React best practices and hooks rules
8. Make it {responsive ? 'fully responsive with mobile-first approach' : 'desktop-optimized'}
9. Include {accessibility ? 'comprehensive ARIA labels, keyboard navigation, and screen reader support' : 'basic accessibility features'}

OUTPUT FORMAT:
\`\`\`tsx
// Complete component code here
\`\`\`

After the code block, provide:
- IMPORTS NEEDED: List any npm packages required
- USAGE EXAMPLE: Show how to use this component
- INTEGRATION STEPS: Step-by-step integration guide
- CUSTOMIZATION NOTES: How to modify common aspects
`;
```

### 3. Component Improvement Prompt

```typescript
const IMPROVE_COMPONENT_PROMPT = `
You are an expert code reviewer specializing in React/Next.js and shadcn/ui.

Review and improve the following component:

CURRENT CODE:
\`\`\`tsx
{current_code}
\`\`\`

IMPROVEMENT REQUESTS:
{improvements_requested}

CONSTRAINTS:
- Maintain the same component API (props interface)
- Keep using shadcn/ui components
- Preserve the component's core functionality
- Framework: {framework}

Please provide:
1. IMPROVED CODE with all requested changes
2. SUMMARY of changes made
3. Any BREAKING CHANGES (if unavoidable)
4. MIGRATION GUIDE (if breaking changes exist)

OUTPUT FORMAT:
\`\`\`tsx
// Improved component code
\`\`\`

CHANGES MADE:
- List each improvement

NOTES:
- Any additional considerations
`;
```

### 4. Clarification Prompt

```typescript
const CLARIFY_COMPONENT_PROMPT = `
Regarding the {component_name} component, please provide the following missing information:

{missing_info}

SPECIFIC QUESTIONS:
{specific_questions}

Please provide clear, actionable answers that can be directly used in the implementation.
`;
```

## Prompt Enhancement Strategies

### 1. Context Injection
Always inject relevant context into prompts:

```typescript
function enhancePrompt(basePrompt: string, context: Context): string {
  const designSystemContext = `
Available shadcn/ui components: ${context.existing_components.join(', ')}
CSS Framework: Tailwind CSS (use className, not style)
Color Scheme: Use shadcn/ui color variables (e.g., bg-background, text-foreground)
`;

  const frameworkContext = context.framework === 'nextjs' ? `
Framework Specifics:
- Use Next.js App Router patterns
- Prefer Server Components unless client interactivity needed
- Use 'use client' directive for interactive components
- Import from '@/components/ui' for shadcn components
` : `
Framework Specifics:
- Standard React patterns
- Import from '@/components/ui' for shadcn components
`;

  return basePrompt
    .replace('{design_system_context}', designSystemContext)
    .replace('{framework_context}', frameworkContext);
}
```

### 2. Example Injection
For better results, inject examples of well-structured components:

```typescript
const EXAMPLE_COMPONENT = `
Example of a well-structured shadcn/ui component:

\`\`\`tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  trend?: 'up' | 'down' | 'neutral'
}

export default function StatsCard({ 
  title, 
  value, 
  description, 
  trend = 'neutral' 
}: StatsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}
\`\`\`
`;
```

### 3. Progressive Refinement
For complex components, use iterative prompting:

```typescript
const PROGRESSIVE_PROMPTS = {
  structure: "First, outline the component structure and main elements needed.",
  implementation: "Now implement the component based on the structure.",
  polish: "Finally, add proper TypeScript types, error handling, and edge cases.",
};
```

## Response Parsing Strategy

### 1. Code Extraction
```typescript
function extractCode(response: string): string {
  // Primary: Look for tsx/ts code blocks
  const tsxMatch = response.match(/```(?:tsx?|jsx?)\n([\s\S]*?)\n```/);
  if (tsxMatch) return tsxMatch[1];
  
  // Fallback: Any code block
  const codeMatch = response.match(/```\n([\s\S]*?)\n```/);
  if (codeMatch) return codeMatch[1];
  
  // Last resort: Assume entire response is code
  return response;
}
```

### 2. Metadata Extraction
```typescript
function extractMetadata(response: string): ComponentMetadata {
  const metadata: ComponentMetadata = {
    imports: [],
    usage: '',
    integration: [],
    customization: []
  };

  // Extract sections after code block
  const sections = response.split(/\n(?=[A-Z\s]+:)/);
  
  sections.forEach(section => {
    if (section.startsWith('IMPORTS NEEDED:')) {
      metadata.imports = extractList(section);
    } else if (section.startsWith('USAGE EXAMPLE:')) {
      metadata.usage = extractCodeBlock(section);
    } else if (section.startsWith('INTEGRATION STEPS:')) {
      metadata.integration = extractList(section);
    }
  });

  return metadata;
}
```

### 3. Validation Patterns
```typescript
function validateComponent(code: string): ValidationResult {
  const checks = {
    hasDefaultExport: /export default function \w+/.test(code),
    hasTypeScript: /interface \w+|type \w+|: \w+/.test(code),
    usesShadcnImports: /@\/components\/ui/.test(code),
    hasProperImports: /^import .+ from .+$/m.test(code),
  };

  return {
    isValid: Object.values(checks).every(Boolean),
    issues: Object.entries(checks)
      .filter(([_, valid]) => !valid)
      .map(([check]) => check)
  };
}
```

## Optimization Tips

### 1. Token Efficiency
- Use concise but clear instructions
- Avoid redundant examples if context is clear
- Focus on specific requirements rather than general guidelines

### 2. Consistency Patterns
- Always use the same terminology (e.g., "shadcn/ui" not "shadcn")
- Maintain consistent formatting expectations
- Use the same code block markers

### 3. Error Recovery
- If response lacks code blocks, try simpler extraction
- If component is incomplete, use clarification prompts
- Have fallback templates for common component types

## Model Selection

- **v0-1.5-md**: Use for standard components, forms, cards, layouts
- **v0-1.5-lg**: Use for complex components with intricate logic or state management
- **v0-1.0-md**: Legacy fallback if newer models have issues

## Continuous Improvement

1. Log successful prompts and their outputs
2. Identify patterns in failed generations
3. Refine prompts based on common issues
4. Maintain a library of proven prompt templates