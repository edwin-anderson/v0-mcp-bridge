import { z } from 'zod';

export const ImageInputSchema = z.object({
  data: z.string()
    .min(1, 'Image data is required')
    .refine(data => {
      // Basic base64 validation - should contain valid base64 characters
      const base64Pattern = /^[A-Za-z0-9+/]+=*$/;
      return base64Pattern.test(data);
    }, 'Image data must be valid base64 encoded')
    .refine(data => {
      // Check minimum size (avoid extremely small files that likely aren't valid images)
      return data.length > 100;
    }, 'Image data appears too small to be a valid image'),
  type: z.enum(['wireframe', 'design', 'screenshot', 'reference'], {
    errorMap: () => ({ message: 'Image type must be one of: wireframe, design, screenshot, reference' })
  }),
  description: z.string().max(500, 'Image description must be 500 characters or less').optional(),
});

export const V0RequestSchema = z.object({
  prompt: z.string()
    .min(10, 'Prompt must be at least 10 characters for meaningful component generation')
    .max(2000, 'Prompt must be 2000 characters or less to avoid API limits')
    .refine(prompt => {
      // Ensure prompt contains some meaningful content, not just whitespace or special chars
      const meaningfulContent = prompt.replace(/[^\w\s]/g, '').trim();
      return meaningfulContent.length >= 5;
    }, 'Prompt must contain meaningful description for component generation'),
  temperature: z.number()
    .min(0, 'Temperature must be between 0 and 2')
    .max(2, 'Temperature must be between 0 and 2')
    .optional(),
  stream: z.boolean().optional(),
  images: z.array(ImageInputSchema)
    .max(5, 'Maximum 5 images allowed per request to avoid API limits')
    .optional(),
  template: z.string()
    .min(1, 'Template name cannot be empty')
    .max(50, 'Template name must be 50 characters or less')
    .optional(),
});

export const ComponentMetadataSchema = z.object({
  name: z.string(),
  description: z.string(),
  dependencies: z.array(z.string()),
  framework: z.enum(['react', 'nextjs']),
  styling: z.enum(['tailwind', 'css-modules', 'styled-components']),
  accessibility: z.boolean(),
  typescript: z.boolean(),
});

export const ComponentResponseSchema = z.object({
  code: z.string(),
  metadata: ComponentMetadataSchema,
  explanation: z.string().optional(),
});

export const ConfigureToolSchema = z.object({
  apiKey: z.string().optional().describe('Optional API key to test (will not be stored)'),
  testConnection: z.boolean().default(true).describe('Whether to test the connection'),
});

export const AnalyzeRequirementsSchema = z.object({
  description: z.string().min(1, 'Description is required').describe('UI requirements to break down into components'),
  framework: z.enum(['react', 'nextjs']).default('react').describe('Target framework for components'),
  existingComponents: z.array(z.string()).default([
    'button', 'card', 'input', 'dialog', 'dropdown-menu', 'sheet', 'table', 
    'avatar', 'badge', 'separator', 'tabs', 'accordion', 'alert', 'progress'
  ]).describe('Available shadcn/ui components to leverage')
});

export const GenerateComponentSchema = z.object({
  name: z.string()
    .min(1, 'Component name is required')
    .max(50, 'Component name must be 50 characters or less')
    .refine(name => {
      // Validate React component naming conventions
      const componentNamePattern = /^[A-Z][a-zA-Z0-9]*$/;
      return componentNamePattern.test(name);
    }, 'Component name must start with uppercase letter and contain only letters and numbers (PascalCase)')
    .describe('Name of the component to generate'),
  type: z.enum(['ui_component', 'page_component', 'layout_component'], {
    errorMap: () => ({ message: 'Component type must be one of: ui_component, page_component, layout_component' })
  }).default('ui_component').describe('Type of component'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters for meaningful component generation')
    .max(1000, 'Description must be 1000 characters or less')
    .describe('What the component should do'),
  location: z.string()
    .max(200, 'File path must be 200 characters or less')
    .default('components/')
    .describe('File path for the component'),
  framework: z.enum(['react', 'nextjs'], {
    errorMap: () => ({ message: 'Framework must be either react or nextjs' })
  }).default('react').describe('Target framework'),
  responsive: z.boolean().default(true).describe('Whether to make the component responsive'),
  accessibility: z.boolean().default(true).describe('Whether to include accessibility features'),
  existingComponents: z.array(z.string())
    .max(50, 'Maximum 50 existing components allowed')
    .default([])
    .describe('Available shadcn/ui components'),
  integrationContext: z.string()
    .max(500, 'Integration context must be 500 characters or less')
    .optional()
    .describe('How this component will be used'),
});

export const ImproveComponentSchema = z.object({
  name: z.string().min(1, 'Component name is required').describe('Name of the component'),
  currentCode: z.string().min(1, 'Current code is required').describe('Existing component code'),
  improvements: z.array(z.string()).min(1, 'At least one improvement required').describe('List of improvements to make'),
  framework: z.enum(['react', 'nextjs']).default('react').describe('Target framework'),
});

// Phase 3 Schemas
export const MultimodalGenerateSchema = z.object({
  name: z.string().min(1, 'Component name is required').describe('Name of the component to generate'),
  type: z.enum(['ui_component', 'page_component', 'layout_component']).default('ui_component').describe('Type of component'),
  description: z.string().min(1, 'Description is required').describe('What the component should do'),
  images: z.array(ImageInputSchema).min(1, 'At least one image is required').describe('Images to analyze (wireframes, designs, etc.)'),
  framework: z.enum(['react', 'nextjs']).default('react').describe('Target framework'),
  responsive: z.boolean().default(true).describe('Whether to make the component responsive'),
  accessibility: z.boolean().default(true).describe('Whether to include accessibility features'),
  existingComponents: z.array(z.string()).default([]).describe('Available shadcn/ui components'),
  imageAnalysisPrompt: z.string().optional().describe('Specific instructions for analyzing the images'),
});

export const TemplateGenerateSchema = z.object({
  template: z.string().min(1, 'Template name is required').describe('Name of the UI pattern template to use'),
  name: z.string().min(1, 'Component name is required').describe('Name of the component to generate'),
  variant: z.string().optional().describe('Template variant to use'),
  customizations: z.array(z.string()).default([]).describe('Visual customizations to apply'),
  framework: z.enum(['react', 'nextjs']).default('react').describe('Target framework'),
  existingComponents: z.array(z.string()).default([]).describe('Available shadcn/ui components'),
});

export const ListTemplatesSchema = z.object({
  category: z.enum(['forms', 'cards', 'navigation', 'layouts', 'data-display', 'modals', 'all'], {
    errorMap: () => ({ message: 'Category must be one of: forms, cards, navigation, layouts, data-display, modals, all' })
  }).default('all').describe('Template category to filter by'),
  framework: z.enum(['react', 'nextjs'], {
    errorMap: () => ({ message: 'Framework must be either react or nextjs' })
  }).default('react').describe('Target framework'),
});

export type V0RequestType = z.infer<typeof V0RequestSchema>;
export type ComponentMetadataType = z.infer<typeof ComponentMetadataSchema>;
export type ComponentResponseType = z.infer<typeof ComponentResponseSchema>;
export type ConfigureToolType = z.infer<typeof ConfigureToolSchema>;
export type AnalyzeRequirementsType = z.infer<typeof AnalyzeRequirementsSchema>;
export type GenerateComponentType = z.infer<typeof GenerateComponentSchema>;
export type ImproveComponentType = z.infer<typeof ImproveComponentSchema>;
export type MultimodalGenerateType = z.infer<typeof MultimodalGenerateSchema>;
export type TemplateGenerateType = z.infer<typeof TemplateGenerateSchema>;
export type ListTemplatesType = z.infer<typeof ListTemplatesSchema>;