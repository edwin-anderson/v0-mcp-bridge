# How And When To Use v0 MCP

## v0 MCP Integration Protocol

### Overview
This project uses v0 MCP server for UI component generation. Claude Code handles project structure, integration, and state management while v0 MCP focuses purely on UI component creation using shadcn/ui + Tailwind CSS.

### What v0 Excels At (SHOULD Handle):
- ✅ **UI Component Generation**: React/Next.js components with modern patterns
- ✅ **UI Structure Decomposition**: Breaking complex UIs into manageable component pieces
- ✅ **Visual Component Hierarchy**: Understanding how UI components relate and nest
- ✅ **shadcn/ui + Tailwind**: Production-ready components using these libraries
- ✅ **Responsive Design**: Mobile-first, responsive layouts
- ✅ **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- ✅ **Visual Polish**: Beautiful, modern UI components
- ✅ **Client Interactivity**: Forms, modals, dropdowns, animations

### What v0 Should NOT Handle:
- ❌ **Project Structure**: File organization, folder conventions
- ❌ **State Management**: Redux, Context, or shared state logic
- ❌ **Complex Application Logic**: Business rules, data processing
- ❌ **Backend Integration**: API calls, database operations
- ❌ **Large Codebase Context**: Entire project structure understanding
- ❌ **File Naming**: Component file names or locations

## Design System Configuration
- **Primary**: shadcn/ui components with Radix primitives
- **Styling**: Tailwind CSS utility classes
- **Framework**: Next.js 15 with App Router
- **TypeScript**: Required for all components
- **Icons**: Lucide React icons preferred

## Claude Code Rules for v0 MCP Communication

### Available v0 MCP Tools
Claude Code has access to these v0 MCP tools:

1. **`mcp__v0-mcp__test_connection`** - Test v0.dev API connectivity
   - No parameters required

2. **`mcp__v0-mcp__configure_v0`** - Configure and validate API settings
   - Parameters: `apiKey?`, `testConnection?`

3. **`mcp__v0-mcp__analyze_requirements`** - Break down UI into component structure (UI DECOMPOSITION ONLY)
   - Parameters: `description`, `framework?`, `existingComponents?`
   - Returns: UI component breakdown, visual hierarchy, shadcn/ui mappings

4. **`mcp__v0-mcp__generate_component`** - Generate React/Next.js components
   - Parameters: `name`, `type?`, `description`, `location?`, `framework?`, `responsive?`, `accessibility?`, `existingComponents?`, `integrationContext?`
   - Returns: Complete component code with integration instructions

5. **`mcp__v0-mcp__improve_component`** - Improve existing components
   - Parameters: `name`, `currentCode`, `improvements[]`, `framework?`
   - Returns: Improved code with changes summary

6. **`mcp__v0-mcp__generate_from_image`** - Generate components from wireframes/designs/screenshots
   - Parameters: `name`, `images[]`, `description`, `imageAnalysisPrompt?`, `responsive?`, `accessibility?`
   - Returns: Component code based on visual analysis of provided images

7. **`mcp__v0-mcp__generate_from_template`** - Generate components using UI pattern templates
   - Parameters: `name`, `template`, `variant?`, `customizations[]`, `framework?`
   - Returns: Component code based on selected template pattern

8. **`mcp__v0-mcp__list_templates`** - List available UI pattern templates
   - Parameters: `category` (forms|cards|navigation|layouts|data-display|modals|all), `framework?`
   - Returns: Available template patterns with descriptions and variants

### 1. UI Request Detection
Claude Code MUST identify UI-related requests and use v0 MCP when:
- User asks for UI components, pages, or layouts
- User requests visual/design improvements
- User wants to create forms, dashboards, cards, etc.
- User uploads design images/wireframes/mockups
- User requests components based on common UI patterns
- User asks for template-based component generation

**Non-v0 Tasks (Handle Locally):**
- Business logic implementation
- Database operations
- API integrations
- State management setup
- Authentication logic
- Performance optimization

### 2. Communication Workflow

#### Phase 1: UI Structure Analysis (REQUIRED)
Use `mcp__v0-mcp__analyze_requirements` tool for **UI decomposition only**:

**Claude Code sends (UI context only):**
```json
{
  "description": "Detailed description of the UI/interface user wants",
  "framework": "nextjs",
  "existingComponents": ["Button", "Card", "Input", "Dialog"]  // Available shadcn/ui components
}
```

**Purpose**: Ask v0 to break down complex UI into manageable component pieces
**Focus**: Visual structure, component relationships, shadcn/ui usage
**NOT included**: File paths, project structure, architecture decisions

**v0 MCP responds with UI breakdown:**
```json
{
  "response_type": "ui_analysis",
  "ui_breakdown": {
    "components_needed": [
      {
        "name": "ComponentName",  // v0 suggests, Claude Code decides final name
        "type": "ui_component | page_component | layout_component",
        "visual_purpose": "What this component displays/handles visually",
        "shadcn_dependencies": ["Card", "Button", "Input"],
        "priority": "high | medium | low"
      }
    ],
    "build_order": ["Component1", "Component2"],  // Visual dependency order
    "visual_relationships": [
      {
        "parent": "ComponentA",
        "children": ["ComponentB", "ComponentC"],
        "layout_pattern": "grid | flex | stack"
      }
    ]
  },
  "shadcn_integration": {
    "component_mappings": ["Card for containers", "Button for actions"],
    "consistency_patterns": ["Use same spacing tokens", "Consistent color scheme"]
  }
}
```

#### Phase 2: Component Generation (Based on Analysis)
Use one of the component generation tools based on the request type:

**Standard Component Generation** - Use `mcp__v0-mcp__generate_component` tool:

**Claude Code sends (with specific names/structure it decided):**
```json
{
  "name": "ComponentName",  // Claude Code specifies exact name
  "type": "ui_component | page_component | layout_component",
  "description": "Specific component description",
  "location": "components/ui/",
  "framework": "nextjs",
  "responsive": true,
  "accessibility": true,
  "existingComponents": ["Button", "Input", "Card"],
  "integrationContext": "Where it will be used, parent component, etc."
}
```

**Full request structure Claude Code should send:**
```json
{
  "name": "ComponentName",
  "type": "ui_component",
  "description": "Detailed description for v0 to generate code",
  "location": "components/ui/",
  "framework": "nextjs",
  "responsive": true,
  "accessibility": true,
  "existingComponents": ["Button", "Input", "Card", "etc"],
  "integrationContext": "This will be used in Dashboard component as a child..."
}
```

**Multimodal Generation (From Images)** - Use `mcp__v0-mcp__generate_from_image` tool:
```json
{
  "name": "ComponentName",
  "images": [
    {
      "data": "base64_encoded_image_data",
      "type": "wireframe" | "design" | "screenshot" | "reference",
      "description": "Optional description of what this image shows"
    }
  ],
  "description": "Component description and requirements",
  "imageAnalysisPrompt": "Optional specific instructions for analyzing the images",
  "framework": "nextjs",
  "responsive": true,
  "accessibility": true
}
```

**Template-Based Generation** - Use `mcp__v0-mcp__generate_from_template` tool:
```json
{
  "name": "ComponentName",
  "template": "login-form" | "contact-form" | "pricing-card" | "confirmation-dialog" | "etc",
  "variant": "with-social" | "with-remember" | "destructive" | "etc",
  "customizations": [
    "Add custom branding colors",
    "Include company logo",
    "Modify field labels"
  ],
  "framework": "nextjs"
}
```

### 3. Workflow Selection Guide

**Choose the appropriate workflow based on user input:**

**Standard Analysis + Generation Workflow:**
- User provides text description of UI requirements
- Complex multi-component interfaces
- Custom business logic components

**Multimodal Workflow (Image-to-Component):**
- User uploads wireframes, mockups, or design screenshots
- User provides image URLs of desired interfaces
- Converting static designs to interactive components

**Template-Based Workflow:**
- User requests common UI patterns ("contact form", "pricing table")
- User wants to start from established patterns
- Rapid prototyping scenarios

### 4. Iteration Rules

**Maximum Iterations per workflow:**
- **Standard workflow**: 5 iterations maximum
- **Multimodal workflow**: 3 iterations maximum (image analysis is more deterministic)
- **Template workflow**: 2 iterations maximum (templates are pre-defined)

**Iteration Triggers:**
- Missing component dependencies
- Unclear component structure  
- Integration conflicts
- User feedback requiring changes
- Image analysis clarification needed

**Iteration Process:**
1. Evaluate v0 response completeness
2. Identify missing information or conflicts
3. Send targeted follow-up request
4. If max iterations reached, proceed with available information and note limitations

### 5. Response Evaluation Criteria

Claude Code MUST verify v0 responses contain:
- ✅ **Complete component code** with proper TypeScript types
- ✅ **Integration instructions** (imports, usage examples)
- ✅ **Dependency information** (npm packages, internal components)
- ✅ **File structure guidance** (where to place files)

**If Missing, Iterate With:**
For clarification or improvements, use `mcp__v0-mcp__improve_component`:
```json
{
  "name": "ComponentName",
  "currentCode": "// existing generated code",
  "improvements": [
    "Add proper TypeScript props interface",
    "Include integration example with parent component",
    "Add missing dependency imports",
    "Clarify how to connect to existing Button component"
  ],
  "framework": "nextjs"
}
```

Note: This is for improving/clarifying v0-generated code, not for initial generation.

### 6. Integration Responsibilities

**Claude Code Handles (Project Management):**
- ✅ **UI Architectural Decisions**: Final component names, file structure, organization
- ✅ **File Management**: Creating files, determining locations, naming conventions
- ✅ **Project Integration**: Import/export management, connecting to existing codebase
- ✅ **State Management**: Redux, Context, shared state between components
- ✅ **Application Logic**: Business rules, data processing, API integration
- ✅ **Routing**: Next.js routing, navigation setup
- ✅ **Testing**: Test setup, integration tests
- ✅ **Dependency Management**: Installing packages, version management

**v0 MCP Handles (Pure UI Generation & Decomposition):**
- ✅ **UI Structure Analysis**: Breaking complex interfaces into component pieces
- ✅ **Visual Component Hierarchy**: Understanding how UI components nest and relate
- ✅ **Component UI Code**: React/Next.js component implementation
- ✅ **shadcn/ui Usage**: Proper implementation of shadcn/ui components
- ✅ **Tailwind Styling**: Beautiful, responsive styles
- ✅ **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- ✅ **Client Interactivity**: Forms, modals, dropdowns, animations
- ✅ **Visual Polish**: Modern, production-ready appearance

**Key Principle**: v0 generates beautiful UI components, Claude Code integrates them into the project.

### 7. Error Handling

**If v0 MCP is unavailable:**
- Inform user v0 is needed for UI generation
- Offer to help with non-UI tasks
- Suggest alternative approaches

**If v0 response is incomplete:**
- Iterate up to max limit
- Fill gaps with best practices
- Document limitations in comments

**If integration conflicts:**
- Prioritize existing codebase patterns
- Modify v0 output to match project standards
- Document changes made

## v0 MCP Server Rules

### 1. Response Requirements

v0 MCP MUST always respond with structured data containing:

#### For UI Analysis Requests:
```json
{
  "response_type": "ui_analysis",
  "ui_breakdown": {
    "components_needed": [
      {
        "name": "string",  // v0 suggests, Claude Code decides final name
        "type": "ui_component | page_component | layout_component", 
        "visual_purpose": "string",  // What this component displays visually
        "shadcn_dependencies": ["Card", "Button", "Input"],
        "priority": "high | medium | low"
      }
    ],
    "build_order": ["Component1", "Component2"],  // Visual dependency order
    "visual_relationships": [
      {
        "parent": "string",
        "children": ["string[]"],
        "layout_pattern": "grid | flex | stack"
      }
    ]
  },
  "shadcn_integration": {
    "component_mappings": ["string[]"],  // Which shadcn components to use where
    "consistency_patterns": ["string[]"]  // Design consistency guidelines
  }
}
```

#### For Component Generation (All Types):
```json
{
  "response_type": "component",
  "generation_method": "standard" | "image_analysis" | "template_based",
  "component": {
    "name": "string",
    "code": "string", // Complete TypeScript component code
    "file_path": "string",
    "exports": ["string[]"],
    "props_interface": "object"
  },
  "source_analysis": {
    "method_used": "text_description" | "image_analysis" | "template_pattern",
    "confidence_score": "number", // 0-1 for image analysis
    "detected_elements": ["string[]"], // For image analysis
    "template_base": "string" // For template generation
  },
  "integration": {
    "imports_needed": ["string[]"],
    "usage_example": "string",
    "integration_steps": [
      {
        "file": "string",
        "action": "import | modify | create",
        "code_snippet": "string",
        "description": "string"
      }
    ]
  },
  "dependencies": {
    "npm_packages": ["string[]"],
    "internal_components": ["string[]"],
    "missing_components": ["string[]"]
  },
  "notes": {
    "customization_hints": ["string[]"],
    "accessibility_features": ["string[]"],
    "responsive_breakpoints": ["string[]"]
  }
}
```

### 2. Code Generation Standards

v0 MCP MUST generate code that:
- ✅ Uses TypeScript with proper type definitions
- ✅ Follows shadcn/ui component patterns
- ✅ Implements responsive design with Tailwind
- ✅ Includes proper accessibility attributes
- ✅ Uses existing components when specified
- ✅ Exports components with clear interfaces
- ✅ Includes proper error boundaries where needed

### 3. Integration Guidance Requirements

v0 MCP MUST provide:
- **Import statements** for other files to use component
- **Usage examples** showing proper implementation
- **Props documentation** with TypeScript interfaces
- **Dependency lists** (npm packages and internal components)
- **File placement** recommendations following project structure

### 4. Iteration Response Rules

When Claude Code requests clarification, v0 MCP MUST:
- Address ALL specific questions asked
- Provide complete code examples for integration
- Explain any assumptions made
- Offer alternatives if constraints conflict

**Never respond with:**
- Incomplete code snippets
- "You can implement X yourself" statements
- Generic suggestions without specifics
- References to external documentation without context

### 5. Error and Limitation Handling

v0 MCP MUST clearly communicate:
- **Limitations**: What it cannot generate or implement
- **Assumptions**: What it assumes about the project structure
- **Alternatives**: Different approaches if requirements conflict
- **Dependencies**: External packages or setup required

## Communication Examples

### Good Request Patterns:

#### Standard Text-Based Request:
```
User: "I need an e-commerce product page with image gallery, details, and reviews"

Claude Code → v0 MCP:
1. mcp__v0-mcp__analyze_requirements({
     description: "E-commerce product page with image gallery, product details, customer reviews, and purchase options",
     framework: "nextjs",
     existingComponents: ["Card", "Button", "Badge", "Dialog", "Carousel"]
   })

   v0 Response: UI breakdown suggesting:
   - ProductImageGallery (handles image display + zoom)
   - ProductDetails (price, description, specs)  
   - ReviewsSection (customer reviews + ratings)
   - RelatedProducts (recommendations)
   - AddToCartForm (purchase actions)

2. Claude Code decides:
   - Final names: ProductGallery, ProductInfo, CustomerReviews, etc.
   - File structure: components/product/product-gallery.tsx
   - Data flow: props from product page component
   - State management: cart integration, user auth

3. mcp__v0-mcp__generate_component({
     name: "ProductGallery",  // Claude Code's chosen name
     description: "Interactive image gallery with zoom and thumbnail navigation",
     existingComponents: ["Carousel", "Dialog", "Button"]
   })

4. Repeat for each component...

Claude Code handles:
- Decides final component names and file structure  
- Creates files in chosen locations
- Sets up data fetching and API integration
- Connects to state management (cart, user, products)
- Adds product routes in Next.js app router
- Writes integration tests
```

#### Multimodal Image-Based Request:
```
User: "Here's a wireframe of the dashboard I want" [uploads image]

Claude Code → v0 MCP:
1. mcp__v0-mcp__generate_from_image({
     name: "DashboardLayout",
     images: [
       {
         data: "iVBORw0KGgoAAAANSUhEUgAA...", // base64 encoded image
         type: "wireframe",
         description: "Main dashboard wireframe showing sidebar and content area"
       }
     ],
     description: "Dashboard layout with sidebar navigation and main content area",
     imageAnalysisPrompt: "Focus on the layout structure and component placement",
     framework: "nextjs",
     responsive: true,
     accessibility: true
   })

   v0 Response: Analyzes image and generates component code matching the visual design

Claude Code handles:
- Processes uploaded image to base64 encoding
- Creates files based on v0's component structure
- Integrates generated components into existing layout system
- Adds routing and navigation logic
- Handles responsive breakpoints and accessibility features
```

#### Template-Based Request:
```
User: "I need a contact form with name, email, and message fields"

Claude Code → v0 MCP:
1. mcp__v0-mcp__list_templates({
     category: "forms",
     framework: "nextjs"
   })

   v0 Response: Lists available form templates including "contact-form", "search-form", "settings-form"

2. mcp__v0-mcp__generate_from_template({
     name: "ContactForm",
     template: "contact-form",
     variant: "with-validation",
     customizations: [
       "Add company branding",
       "Include phone number field",
       "Custom submit button text: Send Message"
     ],
     framework: "nextjs"
   })

   v0 Response: Generates contact form based on template with customizations

Claude Code handles:
- Chooses appropriate template from available options
- Defines component name and customization parameters
- Creates form component file in appropriate location
- Sets up form validation and submission logic
- Integrates with backend API endpoints
- Adds proper TypeScript types for form data
```

### Bad Request Pattern:
```
User: "Make the app faster"

Claude Code response:
- Does NOT call v0 MCP
- Handles performance optimization locally
- Explains this is not a UI generation task
```

## Max Iteration Limits

### Standard Workflow:
- **Analysis requests**: 2 iterations maximum
- **Component generation**: 3 iterations maximum  
- **Clarification requests**: 2 iterations maximum
- **Total per user request**: 5 v0 MCP calls maximum

### Multimodal Workflow:
- **Image analysis + generation**: 2 iterations maximum
- **Clarification requests**: 1 iteration maximum
- **Total per user request**: 3 v0 MCP calls maximum

### Template Workflow:
- **Template listing**: 1 call maximum
- **Template generation**: 1 iteration maximum
- **Clarification requests**: 1 iteration maximum
- **Total per user request**: 2 v0 MCP calls maximum

If limits reached, Claude Code MUST:
1. Use best available information
2. Fill gaps with standard practices
3. Document any limitations or assumptions
4. Provide working solution even if not perfect

## Quality Assurance

Before finalizing any v0-generated component, Claude Code MUST verify:
- ✅ Code compiles without TypeScript errors
- ✅ All imports are available or can be installed
- ✅ Component follows project naming conventions
- ✅ Integration steps are clear and complete
- ✅ No conflicts with existing codebase

## Available Template Library (22 Templates)

The v0 MCP server includes a comprehensive template library organized into 6 categories:

### **Forms (6 templates)**
- `login-form` - Email/password login with social and remember-me variants
- `contact-form` - Name/email/message form with validation variant
- `signup-form` - User registration with social and multi-step variants
- `checkout-form` - E-commerce checkout with guest and express variants
- `search-form` - Search with autocomplete and advanced-filters variants
- `settings-form` - User preferences with privacy and notification variants

### **Cards (3 templates)**
- `product-card` - E-commerce product display with rating and compact variants
- `user-profile-card` - User info display with stats variant
- `pricing-card` - Subscription plans with popular and enterprise variants

### **Navigation (2 templates)**
- `header-nav` - Horizontal navigation with search and minimal variants
- `sidebar-nav` - Vertical sidebar with icons variant

### **Layouts (6 templates)**
- `dashboard-grid` - Responsive widget grid with sidebar variant
- `hero-section` - Landing page hero with image variant
- `auth-layout` - Centered authentication with background and split-screen variants
- `landing-page` - Marketing page with saas-landing and app-landing variants
- `profile-layout` - User profile with public-profile and settings-profile variants
- `error-page` - Error states with 404-not-found and maintenance variants

### **Data Display (2 templates)**
- `data-table` - Sortable/filterable table with actions variant
- `stats-grid` - Metrics dashboard with charts variant

### **Modals (3 templates)**
- `confirmation-dialog` - Destructive action confirmations with destructive and with-input variants
- `image-gallery` - Lightbox modal with thumbnails and zoom variants
- `drawer-panel` - Side panel overlay with navigation and form-panel variants

Each template includes:
- **Visual patterns**: Detailed layout descriptions
- **shadcn/ui components**: Required component dependencies
- **Responsive features**: Mobile-first design considerations
- **Accessibility features**: Built-in a11y support
- **Variants**: Alternative versions with different features

Use `mcp__v0-mcp__list_templates` to explore available templates by category.

---

*This configuration ensures efficient collaboration between Claude Code and v0 MCP while maintaining code quality and project consistency.*
