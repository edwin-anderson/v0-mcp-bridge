import { FastMCP } from 'fastmcp';
import { z } from 'zod';
import { V0Client } from '../client/V0Client.js';
import { loadConfig } from '../utils/config.js';
import { logger } from '../utils/logger.js';
import { AnalyzeRequirementsSchema, GenerateComponentSchema, ImproveComponentSchema, MultimodalGenerateSchema, TemplateGenerateSchema, ListTemplatesSchema } from '../types/schemas.js';
import { ANALYZE_REQUIREMENTS_PROMPT, GENERATE_COMPONENT_PROMPT, IMPROVE_COMPONENT_PROMPT, fillPromptTemplate } from '../services/prompts.js';
import { parseAnalysisResponse, parseComponentResponse } from '../utils/responseParser.js';
import { getTemplate, getTemplatesByCategory, getAllTemplates } from '../services/templates.js';
export class V0McpServer {
    server;
    v0Client;
    constructor() {
        this.server = new FastMCP({
            name: 'v0-mcp',
            version: '1.0.0',
        });
        const config = loadConfig();
        this.v0Client = new V0Client(config.v0ApiKey);
        this.setupTools();
    }
    setupTools() {
        this.server.addTool({
            name: 'test_connection',
            description: 'Test connection to v0.dev API with detailed diagnostics',
            parameters: z.object({}),
            execute: async () => {
                try {
                    const isConnected = await this.v0Client.testConnection();
                    if (isConnected) {
                        return 'Connection test result: Successfully connected to v0.dev API';
                    }
                    else {
                        // Try to get more detailed error information
                        try {
                            await this.v0Client.generateComponent({
                                prompt: 'test connection',
                                temperature: 0.1
                            });
                            return 'Connection test result: API responded but test_connection failed unexpectedly';
                        }
                        catch (detailedError) {
                            return `Connection test result: Failed to connect to v0.dev API. Error: ${detailedError instanceof Error ? detailedError.message : 'Unknown error'}`;
                        }
                    }
                }
                catch (error) {
                    logger.error('Connection test failed:', error);
                    return `Connection test result: Connection test threw error: ${error instanceof Error ? error.message : 'Unknown error'}`;
                }
            }
        });
        this.server.addTool({
            name: 'configure_v0',
            description: 'Configure v0.dev integration settings and validate API connectivity',
            parameters: z.object({
                apiKey: z.string().optional().describe('Optional API key to test (will not be stored)'),
                testConnection: z.boolean().default(true).describe('Whether to test the connection')
            }),
            execute: async ({ apiKey, testConnection }) => {
                try {
                    let clientToTest = this.v0Client;
                    if (apiKey) {
                        clientToTest = new V0Client(apiKey);
                    }
                    if (testConnection) {
                        const isConnected = await clientToTest.testConnection();
                        if (!isConnected) {
                            throw new Error('Failed to connect to v0.dev API');
                        }
                    }
                    const connectionStatus = testConnection ? ' API connection verified.' : ' API connection not tested.';
                    return `v0.dev integration configured successfully.${connectionStatus}`;
                }
                catch (error) {
                    logger.error('Configuration failed:', error);
                    throw new Error(`Configuration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                }
            }
        });
        // Phase 2: Core Tools Implementation
        // Note: v0 MCP focuses on UI generation only. Claude Code handles all file structure,
        // naming, and project integration decisions.
        this.server.addTool({
            name: 'analyze_requirements',
            description: 'Break down UI requirements into React component structure using shadcn/ui. Focuses purely on visual hierarchy and component relationships - does not handle file paths or architecture.',
            parameters: AnalyzeRequirementsSchema,
            execute: async (args) => {
                try {
                    const prompt = fillPromptTemplate(ANALYZE_REQUIREMENTS_PROMPT, {
                        description: args.description,
                        framework: args.framework,
                        existing_components: args.existingComponents.join(', ') || 'button, card, input, dialog, dropdown, sheet, table, avatar, badge, separator'
                    });
                    const response = await this.v0Client.generateComponent({
                        prompt,
                        temperature: 0.7
                    });
                    const parsed = parseAnalysisResponse(response.code || response.explanation || '');
                    const analysisResponse = {
                        response_type: 'ui_analysis',
                        ui_breakdown: {
                            components_needed: parsed.componentsNeeded.map(comp => ({
                                name: comp.name,
                                type: comp.type,
                                visual_purpose: comp.visualPurpose,
                                shadcn_dependencies: comp.shadcnDependencies,
                                priority: comp.priority
                            })),
                            build_order: parsed.buildOrder,
                            visual_relationships: parsed.visualRelationships.map(rel => ({
                                component: rel.component,
                                contained_within: rel.containedWithin,
                                visually_related_to: rel.visuallyRelatedTo,
                                shared_patterns: rel.sharedPatterns || []
                            }))
                        },
                        shadcn_integration: {
                            component_mappings: parsed.shadcnIntegration.componentMappings.map(mapping => ({
                                component: mapping.component,
                                shadcn_components: mapping.shadcnComponents,
                                recommended_combinations: mapping.combinations
                            })),
                            consistency_patterns: parsed.shadcnIntegration.consistencyPatterns
                        }
                    };
                    return JSON.stringify(analysisResponse, null, 2);
                }
                catch (error) {
                    logger.error('UI requirements analysis failed:', error);
                    throw new Error(`UI requirements analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                }
            }
        });
        this.server.addTool({
            name: 'generate_component',
            description: 'Generate a React/Next.js component with TypeScript and shadcn/ui',
            parameters: GenerateComponentSchema,
            execute: async (args) => {
                try {
                    const prompt = fillPromptTemplate(GENERATE_COMPONENT_PROMPT, {
                        component_name: args.name,
                        component_type: args.type,
                        description: args.description,
                        file_path: '', // Claude Code handles file paths
                        framework: args.framework,
                        responsive: args.responsive,
                        accessibility: args.accessibility,
                        existing_components: args.existingComponents,
                        integration_context: args.integrationContext || 'Standalone component'
                    });
                    const response = await this.v0Client.generateComponent({
                        prompt,
                        temperature: 0.7
                    });
                    const parsed = parseComponentResponse(response.code || response.explanation || '');
                    // Extract props interface from the code
                    const propsMatch = parsed.code.match(/interface\s+\w+Props\s*{\s*([^}]+)\s*}/);
                    const propsInterface = propsMatch ? propsMatch[1].trim() : '';
                    // Extract exports from the code
                    const exports = [];
                    if (parsed.code.includes('export default'))
                        exports.push('default');
                    const namedExports = parsed.code.match(/export\s+(?:const|function|class)\s+(\w+)/g);
                    if (namedExports) {
                        namedExports.forEach(match => {
                            const name = match.match(/export\s+(?:const|function|class)\s+(\w+)/)?.[1];
                            if (name)
                                exports.push(name);
                        });
                    }
                    // Identify npm packages vs internal components
                    const npmPackages = parsed.metadata.imports.filter(imp => !imp.startsWith('@/') && !imp.startsWith('./'));
                    const internalComponents = parsed.metadata.imports.filter(imp => imp.startsWith('@/components/ui/'));
                    const componentResponse = {
                        response_type: 'component',
                        component: {
                            name: args.name,
                            code: parsed.code,
                            file_path: '', // Claude Code will determine file path
                            exports,
                            props_interface: propsInterface ? { props: propsInterface } : {}
                        },
                        integration: {
                            imports_needed: [], // Claude Code will determine imports based on file structure
                            usage_example: parsed.metadata.usage || `<${args.name} />`,
                            integration_steps: parsed.metadata.integrationSteps.map(step => ({
                                file: '', // Claude Code will determine which files to modify
                                action: 'modify',
                                description: step
                            }))
                        },
                        dependencies: {
                            npm_packages: npmPackages,
                            internal_components: internalComponents,
                            missing_components: []
                        },
                        notes: {
                            customization_hints: parsed.metadata.customizationNotes,
                            accessibility_features: args.accessibility ? ['ARIA labels', 'Keyboard navigation', 'Screen reader support'] : [],
                            responsive_breakpoints: args.responsive ? ['sm (640px)', 'md (768px)', 'lg (1024px)', 'xl (1280px)'] : []
                        }
                    };
                    return JSON.stringify(componentResponse, null, 2);
                }
                catch (error) {
                    logger.error('Component generation failed:', error);
                    throw new Error(`Component generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                }
            }
        });
        this.server.addTool({
            name: 'improve_component',
            description: 'Improve an existing React/Next.js component',
            parameters: ImproveComponentSchema,
            execute: async (args) => {
                try {
                    const prompt = fillPromptTemplate(IMPROVE_COMPONENT_PROMPT, {
                        current_code: args.currentCode,
                        improvements_requested: args.improvements,
                        framework: args.framework
                    });
                    const response = await this.v0Client.generateComponent({
                        prompt,
                        temperature: 0.7
                    });
                    const parsed = parseComponentResponse(response.code || response.explanation || '');
                    // Extract changes summary from the response
                    const changesSection = (response.explanation || '').split(/CHANGES MADE:/i)[1];
                    const changesList = changesSection ?
                        changesSection.split('\n')
                            .filter(line => line.trim().startsWith('-'))
                            .map(line => line.replace(/^-\s*/, '').trim())
                        : ['Code improvements applied'];
                    return JSON.stringify({
                        response_type: 'improvement',
                        component: {
                            name: args.name,
                            improved_code: parsed.code,
                            changes_made: changesList
                        },
                        breaking_changes: [],
                        migration_guide: []
                    }, null, 2);
                }
                catch (error) {
                    logger.error('Component improvement failed:', error);
                    throw new Error(`Component improvement failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                }
            }
        });
        // Phase 3: Advanced Features
        this.server.addTool({
            name: 'generate_from_image',
            description: 'Generate React/Next.js component from wireframes, designs, or screenshots',
            parameters: MultimodalGenerateSchema,
            execute: async (args) => {
                try {
                    const multimodalRequest = {
                        prompt: `Generate a STUNNING, POLISHED ${args.name} component based on the provided ${args.images.map(img => img.type).join(', ')}.

${args.description}

🎨 VISUAL EXCELLENCE REQUIREMENTS:
1. Match the design EXACTLY while enhancing with modern polish
2. Use shadcn/ui components: ${args.existingComponents.join(', ')}
3. Add subtle animations and smooth transitions
4. Implement proper hover states and micro-interactions
5. Ensure pixel-perfect spacing and alignment
6. Include loading states where appropriate
7. NEVER compromise on visual quality - make it beautiful!

Framework: ${args.framework}
Make it ${args.responsive ? 'fully responsive' : 'desktop-optimized'}
${args.accessibility ? 'Include comprehensive accessibility features' : ''}`,
                        images: args.images,
                        image_analysis_prompt: args.imageAnalysisPrompt,
                        temperature: 0.7
                    };
                    const response = await this.v0Client.generateComponentMultimodal(multimodalRequest);
                    const parsed = parseComponentResponse(response.code || response.explanation || '');
                    const componentResponse = {
                        response_type: 'component',
                        component: {
                            name: args.name,
                            code: parsed.code,
                            file_path: '',
                            exports: parsed.code.includes('export default') ? ['default'] : [],
                            props_interface: {}
                        },
                        integration: {
                            imports_needed: [],
                            usage_example: parsed.metadata.usage || `<${args.name} />`,
                            integration_steps: parsed.metadata.integrationSteps.map(step => ({
                                file: '',
                                action: 'modify',
                                description: step
                            }))
                        },
                        dependencies: {
                            npm_packages: parsed.metadata.imports.filter(imp => !imp.startsWith('@/')),
                            internal_components: parsed.metadata.imports.filter(imp => imp.startsWith('@/components/ui/')),
                            missing_components: []
                        },
                        notes: {
                            customization_hints: parsed.metadata.customizationNotes,
                            accessibility_features: args.accessibility ? ['ARIA labels', 'Keyboard navigation', 'Screen reader support'] : [],
                            responsive_breakpoints: args.responsive ? ['sm (640px)', 'md (768px)', 'lg (1024px)', 'xl (1280px)'] : []
                        }
                    };
                    return JSON.stringify(componentResponse, null, 2);
                }
                catch (error) {
                    logger.error('Multimodal component generation failed:', error);
                    throw new Error(`Multimodal component generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                }
            }
        });
        this.server.addTool({
            name: 'generate_from_template',
            description: 'Generate component from UI pattern template (forms, cards, navigation, etc.)',
            parameters: TemplateGenerateSchema,
            execute: async (args) => {
                try {
                    const template = getTemplate(args.template);
                    if (!template) {
                        throw new Error(`Template '${args.template}' not found`);
                    }
                    const variant = args.variant ? template.variants.find(v => v.name === args.variant) : null;
                    let templatePrompt = `Generate a STUNNING, POLISHED ${args.name} component using the ${template.name} template pattern.

Template Description: ${template.description}
Visual Pattern: ${template.visual_pattern}
Required shadcn/ui components: ${template.shadcn_components.join(', ')}
Responsive features: ${template.responsive_features.join(', ')}
Accessibility features: ${template.accessibility_features.join(', ')}

🎨 VISUAL EXCELLENCE REQUIREMENTS:
1. Take the template as a starting point and ELEVATE it visually
2. Add beautiful details: subtle shadows, smooth transitions, hover effects
3. Implement micro-interactions that delight users
4. Use modern design patterns and current UI trends
5. Ensure perfect spacing, alignment, and visual hierarchy
6. Include thoughtful loading and empty states
7. NEVER settle for basic - make it visually exceptional!

Available shadcn/ui components: ${args.existingComponents.join(', ')}
Framework: ${args.framework}`;
                    if (variant) {
                        templatePrompt += `\n\nVariant: ${variant.name} - ${variant.description}
Variant modifications: ${variant.modifications.join(', ')}`;
                    }
                    if (args.customizations.length > 0) {
                        templatePrompt += `\n\nCustomizations: ${args.customizations.join(', ')}`;
                    }
                    const response = await this.v0Client.generateComponent({
                        prompt: templatePrompt,
                        template: args.template,
                        temperature: 0.7
                    });
                    const parsed = parseComponentResponse(response.code || response.explanation || '');
                    const componentResponse = {
                        response_type: 'component',
                        component: {
                            name: args.name,
                            code: parsed.code,
                            file_path: '',
                            exports: parsed.code.includes('export default') ? ['default'] : [],
                            props_interface: {}
                        },
                        integration: {
                            imports_needed: [],
                            usage_example: parsed.metadata.usage || `<${args.name} />`,
                            integration_steps: [{
                                    file: '',
                                    action: 'modify',
                                    description: `Use the ${template.name} pattern for consistent UI design`
                                }]
                        },
                        dependencies: {
                            npm_packages: [],
                            internal_components: template.shadcn_components.map(comp => `@/components/ui/${comp.toLowerCase()}`),
                            missing_components: []
                        },
                        notes: {
                            customization_hints: [
                                `Based on ${template.name} template`,
                                ...template.responsive_features,
                                ...args.customizations
                            ],
                            accessibility_features: template.accessibility_features,
                            responsive_breakpoints: ['sm (640px)', 'md (768px)', 'lg (1024px)', 'xl (1280px)']
                        }
                    };
                    return JSON.stringify(componentResponse, null, 2);
                }
                catch (error) {
                    logger.error('Template-based component generation failed:', error);
                    throw new Error(`Template-based component generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                }
            }
        });
        this.server.addTool({
            name: 'list_templates',
            description: 'List available UI pattern templates by category',
            parameters: ListTemplatesSchema,
            execute: async (args) => {
                try {
                    const templates = args.category === 'all'
                        ? getAllTemplates()
                        : getTemplatesByCategory(args.category);
                    const response = {
                        response_type: 'templates',
                        category: args.category,
                        framework: args.framework,
                        templates: templates.map(template => ({
                            name: template.name,
                            category: template.category,
                            description: template.description,
                            visual_pattern: template.visual_pattern,
                            shadcn_components: template.shadcn_components,
                            variants: template.variants.map(v => ({
                                name: v.name,
                                description: v.description
                            }))
                        }))
                    };
                    return JSON.stringify(response, null, 2);
                }
                catch (error) {
                    logger.error('Template listing failed:', error);
                    throw new Error(`Template listing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                }
            }
        });
        logger.info('Phase 3 tools registered successfully');
    }
    async start() {
        try {
            await this.server.start({
                transportType: 'stdio'
            });
            logger.info('v0 MCP Server started successfully');
        }
        catch (error) {
            logger.error('Failed to start server:', error);
            throw error;
        }
    }
    async stop() {
        try {
            // FastMCP handles cleanup automatically on process exit for stdio transport
            logger.info('v0 MCP Server stopped');
        }
        catch (error) {
            logger.error('Error stopping server:', error);
            throw error;
        }
    }
}
