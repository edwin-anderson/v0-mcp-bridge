import type { UITemplate } from '../types/index.js';
export declare const UI_TEMPLATES: UITemplate[];
export declare function getTemplate(name: string): UITemplate | undefined;
export declare function getTemplatesByCategory(category: UITemplate['category']): UITemplate[];
export declare function getAllTemplates(): UITemplate[];
export declare function searchTemplates(query: string): UITemplate[];
