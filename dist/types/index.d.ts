export interface V0Request {
    prompt: string;
    temperature?: number;
    stream?: boolean;
    images?: ImageInput[];
    template?: string;
}
export interface ImageInput {
    data: string;
    type: 'wireframe' | 'design' | 'screenshot' | 'reference';
    description?: string;
}
export interface V0Response {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Array<{
        index: number;
        message: {
            role: string;
            content: string;
        };
        finish_reason: string;
    }>;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}
export interface ComponentMetadata {
    name: string;
    description: string;
    dependencies: string[];
    framework: 'react' | 'nextjs';
    styling: 'tailwind' | 'css-modules' | 'styled-components';
    accessibility: boolean;
    typescript: boolean;
}
export interface ComponentResponse {
    code: string;
    metadata: ComponentMetadata;
    explanation?: string;
}
export interface AnalyzeRequirementsRequest {
    action: 'analyze_requirements';
    component_info: {
        description: string;
    };
    design_context: {
        design_system: 'shadcn/ui + tailwind';
        existing_components: string[];
        framework: 'nextjs' | 'react';
        responsive: boolean;
        accessibility: boolean;
    };
    project_context: {
        current_structure: string;
        target_location: string;
    };
}
export interface GenerateComponentRequest {
    action: 'generate_component';
    component_info: {
        name: string;
        type: 'ui_component' | 'page_component' | 'layout_component';
        location: string;
        description: string;
    };
    design_context: {
        design_system: 'shadcn/ui + tailwind';
        existing_components: string[];
        framework: 'nextjs' | 'react';
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
export interface ImproveComponentRequest {
    action: 'improve_component';
    component_info: {
        name: string;
        current_code: string;
        improvements_requested: string[];
    };
    design_context: {
        design_system: 'shadcn/ui + tailwind';
        framework: 'nextjs' | 'react';
    };
}
export interface AnalysisResponse {
    response_type: 'ui_analysis';
    ui_breakdown: {
        components_needed: UIComponentInfo[];
        build_order: string[];
        visual_relationships: VisualRelationship[];
    };
    shadcn_integration: {
        component_mappings: ShadcnMapping[];
        consistency_patterns: string[];
    };
}
export interface UIComponentInfo {
    name: string;
    type: 'ui_component' | 'page_component' | 'layout_component';
    visual_purpose: string;
    shadcn_dependencies: string[];
    priority: 'high' | 'medium' | 'low';
}
export interface VisualRelationship {
    component: string;
    contained_within?: string;
    visually_related_to: string[];
    shared_patterns: string[];
}
export interface ShadcnMapping {
    component: string;
    shadcn_components: string[];
    recommended_combinations: string[];
}
export interface ComponentGenerationResponse {
    response_type: 'component';
    component: {
        name: string;
        code: string;
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
export interface IntegrationStep {
    file: string;
    action: 'import' | 'modify' | 'create';
    code_snippet?: string;
    description: string;
}
export interface StreamingResponse {
    response_type: 'streaming';
    chunk: string;
    progress: number;
    complete: boolean;
    metadata?: any;
}
export interface UITemplate {
    name: string;
    category: 'forms' | 'cards' | 'navigation' | 'layouts' | 'data-display' | 'modals';
    description: string;
    visual_pattern: string;
    shadcn_components: string[];
    responsive_features: string[];
    accessibility_features: string[];
    variants: TemplateVariant[];
}
export interface TemplateVariant {
    name: string;
    description: string;
    modifications: string[];
}
export interface MultimodalRequest extends V0Request {
    images: ImageInput[];
    image_analysis_prompt?: string;
}
export interface ErrorRecoveryResponse {
    response_type: 'error_recovery';
    original_error: string;
    retry_suggestions: string[];
    fallback_approach?: string;
    recovered_result?: ComponentResponse;
}
