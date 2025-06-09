import { z } from 'zod';
export declare const ImageInputSchema: z.ZodObject<{
    data: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
    type: z.ZodEnum<["wireframe", "design", "screenshot", "reference"]>;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "wireframe" | "design" | "screenshot" | "reference";
    data: string;
    description?: string | undefined;
}, {
    type: "wireframe" | "design" | "screenshot" | "reference";
    data: string;
    description?: string | undefined;
}>;
export declare const V0RequestSchema: z.ZodObject<{
    prompt: z.ZodEffects<z.ZodString, string, string>;
    temperature: z.ZodOptional<z.ZodNumber>;
    stream: z.ZodOptional<z.ZodBoolean>;
    images: z.ZodOptional<z.ZodArray<z.ZodObject<{
        data: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
        type: z.ZodEnum<["wireframe", "design", "screenshot", "reference"]>;
        description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "wireframe" | "design" | "screenshot" | "reference";
        data: string;
        description?: string | undefined;
    }, {
        type: "wireframe" | "design" | "screenshot" | "reference";
        data: string;
        description?: string | undefined;
    }>, "many">>;
    template: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    prompt: string;
    stream?: boolean | undefined;
    temperature?: number | undefined;
    images?: {
        type: "wireframe" | "design" | "screenshot" | "reference";
        data: string;
        description?: string | undefined;
    }[] | undefined;
    template?: string | undefined;
}, {
    prompt: string;
    stream?: boolean | undefined;
    temperature?: number | undefined;
    images?: {
        type: "wireframe" | "design" | "screenshot" | "reference";
        data: string;
        description?: string | undefined;
    }[] | undefined;
    template?: string | undefined;
}>;
export declare const ComponentMetadataSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    dependencies: z.ZodArray<z.ZodString, "many">;
    framework: z.ZodEnum<["react", "nextjs"]>;
    styling: z.ZodEnum<["tailwind", "css-modules", "styled-components"]>;
    accessibility: z.ZodBoolean;
    typescript: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    description: string;
    name: string;
    dependencies: string[];
    framework: "react" | "nextjs";
    styling: "tailwind" | "css-modules" | "styled-components";
    accessibility: boolean;
    typescript: boolean;
}, {
    description: string;
    name: string;
    dependencies: string[];
    framework: "react" | "nextjs";
    styling: "tailwind" | "css-modules" | "styled-components";
    accessibility: boolean;
    typescript: boolean;
}>;
export declare const ComponentResponseSchema: z.ZodObject<{
    code: z.ZodString;
    metadata: z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        dependencies: z.ZodArray<z.ZodString, "many">;
        framework: z.ZodEnum<["react", "nextjs"]>;
        styling: z.ZodEnum<["tailwind", "css-modules", "styled-components"]>;
        accessibility: z.ZodBoolean;
        typescript: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        description: string;
        name: string;
        dependencies: string[];
        framework: "react" | "nextjs";
        styling: "tailwind" | "css-modules" | "styled-components";
        accessibility: boolean;
        typescript: boolean;
    }, {
        description: string;
        name: string;
        dependencies: string[];
        framework: "react" | "nextjs";
        styling: "tailwind" | "css-modules" | "styled-components";
        accessibility: boolean;
        typescript: boolean;
    }>;
    explanation: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    code: string;
    metadata: {
        description: string;
        name: string;
        dependencies: string[];
        framework: "react" | "nextjs";
        styling: "tailwind" | "css-modules" | "styled-components";
        accessibility: boolean;
        typescript: boolean;
    };
    explanation?: string | undefined;
}, {
    code: string;
    metadata: {
        description: string;
        name: string;
        dependencies: string[];
        framework: "react" | "nextjs";
        styling: "tailwind" | "css-modules" | "styled-components";
        accessibility: boolean;
        typescript: boolean;
    };
    explanation?: string | undefined;
}>;
export declare const ConfigureToolSchema: z.ZodObject<{
    apiKey: z.ZodOptional<z.ZodString>;
    testConnection: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    testConnection: boolean;
    apiKey?: string | undefined;
}, {
    apiKey?: string | undefined;
    testConnection?: boolean | undefined;
}>;
export declare const AnalyzeRequirementsSchema: z.ZodObject<{
    description: z.ZodString;
    framework: z.ZodDefault<z.ZodEnum<["react", "nextjs"]>>;
    existingComponents: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    description: string;
    framework: "react" | "nextjs";
    existingComponents: string[];
}, {
    description: string;
    framework?: "react" | "nextjs" | undefined;
    existingComponents?: string[] | undefined;
}>;
export declare const GenerateComponentSchema: z.ZodObject<{
    name: z.ZodEffects<z.ZodString, string, string>;
    type: z.ZodDefault<z.ZodEnum<["ui_component", "page_component", "layout_component"]>>;
    description: z.ZodString;
    location: z.ZodDefault<z.ZodString>;
    framework: z.ZodDefault<z.ZodEnum<["react", "nextjs"]>>;
    responsive: z.ZodDefault<z.ZodBoolean>;
    accessibility: z.ZodDefault<z.ZodBoolean>;
    existingComponents: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    integrationContext: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "ui_component" | "page_component" | "layout_component";
    description: string;
    name: string;
    framework: "react" | "nextjs";
    accessibility: boolean;
    existingComponents: string[];
    location: string;
    responsive: boolean;
    integrationContext?: string | undefined;
}, {
    description: string;
    name: string;
    type?: "ui_component" | "page_component" | "layout_component" | undefined;
    framework?: "react" | "nextjs" | undefined;
    accessibility?: boolean | undefined;
    existingComponents?: string[] | undefined;
    location?: string | undefined;
    responsive?: boolean | undefined;
    integrationContext?: string | undefined;
}>;
export declare const ImproveComponentSchema: z.ZodObject<{
    name: z.ZodString;
    currentCode: z.ZodString;
    improvements: z.ZodArray<z.ZodString, "many">;
    framework: z.ZodDefault<z.ZodEnum<["react", "nextjs"]>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    framework: "react" | "nextjs";
    currentCode: string;
    improvements: string[];
}, {
    name: string;
    currentCode: string;
    improvements: string[];
    framework?: "react" | "nextjs" | undefined;
}>;
export declare const MultimodalGenerateSchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodDefault<z.ZodEnum<["ui_component", "page_component", "layout_component"]>>;
    description: z.ZodString;
    images: z.ZodArray<z.ZodObject<{
        data: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
        type: z.ZodEnum<["wireframe", "design", "screenshot", "reference"]>;
        description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "wireframe" | "design" | "screenshot" | "reference";
        data: string;
        description?: string | undefined;
    }, {
        type: "wireframe" | "design" | "screenshot" | "reference";
        data: string;
        description?: string | undefined;
    }>, "many">;
    framework: z.ZodDefault<z.ZodEnum<["react", "nextjs"]>>;
    responsive: z.ZodDefault<z.ZodBoolean>;
    accessibility: z.ZodDefault<z.ZodBoolean>;
    existingComponents: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    imageAnalysisPrompt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "ui_component" | "page_component" | "layout_component";
    description: string;
    images: {
        type: "wireframe" | "design" | "screenshot" | "reference";
        data: string;
        description?: string | undefined;
    }[];
    name: string;
    framework: "react" | "nextjs";
    accessibility: boolean;
    existingComponents: string[];
    responsive: boolean;
    imageAnalysisPrompt?: string | undefined;
}, {
    description: string;
    images: {
        type: "wireframe" | "design" | "screenshot" | "reference";
        data: string;
        description?: string | undefined;
    }[];
    name: string;
    type?: "ui_component" | "page_component" | "layout_component" | undefined;
    framework?: "react" | "nextjs" | undefined;
    accessibility?: boolean | undefined;
    existingComponents?: string[] | undefined;
    responsive?: boolean | undefined;
    imageAnalysisPrompt?: string | undefined;
}>;
export declare const TemplateGenerateSchema: z.ZodObject<{
    template: z.ZodString;
    name: z.ZodString;
    variant: z.ZodOptional<z.ZodString>;
    customizations: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    framework: z.ZodDefault<z.ZodEnum<["react", "nextjs"]>>;
    existingComponents: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    template: string;
    name: string;
    framework: "react" | "nextjs";
    existingComponents: string[];
    customizations: string[];
    variant?: string | undefined;
}, {
    template: string;
    name: string;
    framework?: "react" | "nextjs" | undefined;
    existingComponents?: string[] | undefined;
    variant?: string | undefined;
    customizations?: string[] | undefined;
}>;
export declare const ListTemplatesSchema: z.ZodObject<{
    category: z.ZodDefault<z.ZodEnum<["forms", "cards", "navigation", "layouts", "data-display", "modals", "all"]>>;
    framework: z.ZodDefault<z.ZodEnum<["react", "nextjs"]>>;
}, "strip", z.ZodTypeAny, {
    framework: "react" | "nextjs";
    category: "forms" | "cards" | "navigation" | "layouts" | "data-display" | "modals" | "all";
}, {
    framework?: "react" | "nextjs" | undefined;
    category?: "forms" | "cards" | "navigation" | "layouts" | "data-display" | "modals" | "all" | undefined;
}>;
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
