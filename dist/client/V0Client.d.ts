import type { V0Request, ComponentResponse, MultimodalRequest, StreamingResponse } from '../types/index.js';
export declare class V0Client {
    private apiKey;
    private baseURL;
    constructor(apiKey: string);
    generateComponent(request: V0Request): Promise<ComponentResponse>;
    generateComponentMultimodal(request: MultimodalRequest): Promise<ComponentResponse>;
    generateComponentStreaming(request: V0Request): AsyncGenerator<StreamingResponse>;
    testConnection(): Promise<boolean>;
    private makeRequest;
    private parseResponse;
    private extractCode;
    private extractMetadata;
    private extractComponentName;
    private extractDependencies;
    private extractExplanation;
    private buildMessages;
    private buildMultimodalMessages;
    generateComponentWithRetry(request: V0Request, maxRetries?: number): Promise<ComponentResponse>;
}
