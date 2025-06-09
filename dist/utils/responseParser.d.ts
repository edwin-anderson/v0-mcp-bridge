export interface ParsedComponent {
    code: string;
    metadata: {
        name: string;
        imports: string[];
        usage: string;
        integrationSteps: string[];
        customizationNotes: string[];
    };
}
export interface ParsedAnalysis {
    componentsNeeded: Array<{
        name: string;
        type: 'ui_component' | 'page_component' | 'layout_component';
        visualPurpose: string;
        shadcnDependencies: string[];
        priority: 'high' | 'medium' | 'low';
    }>;
    buildOrder: string[];
    visualRelationships: Array<{
        component: string;
        containedWithin?: string;
        visuallyRelatedTo: string[];
        sharedPatterns?: string[];
    }>;
    shadcnIntegration: {
        componentMappings: Array<{
            component: string;
            shadcnComponents: string[];
            combinations: string[];
        }>;
        consistencyPatterns: string[];
    };
}
export declare function extractComponentCode(response: string): string;
export declare function parseComponentResponse(response: string): ParsedComponent;
export declare function parseAnalysisResponse(response: string): ParsedAnalysis;
