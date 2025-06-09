export class V0Client {
    apiKey;
    baseURL;
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseURL = 'https://api.v0.dev/v1';
    }
    async generateComponent(request) {
        try {
            // Validate request parameters
            if (!request.prompt || request.prompt.trim().length === 0) {
                throw new Error('Component generation requires a non-empty prompt describing the component to create');
            }
            if (request.temperature !== undefined && (request.temperature < 0 || request.temperature > 2)) {
                throw new Error('Temperature must be between 0 and 2 for optimal component generation');
            }
            const messages = this.buildMessages(request);
            const response = await this.makeRequest('/chat/completions', {
                model: 'v0-1.5-md',
                messages,
                temperature: request.temperature ?? 0.7,
                stream: request.stream ?? false,
            });
            return this.parseResponse(response);
        }
        catch (error) {
            if (error instanceof Error) {
                // Enhance specific error types with actionable messages
                if (error.message.includes('401')) {
                    throw new Error('V0 API authentication failed. Please verify your V0_API_KEY is valid and has not expired.');
                }
                if (error.message.includes('429')) {
                    throw new Error('V0 API rate limit exceeded. Please wait a moment before making another request or check your usage limits.');
                }
                if (error.message.includes('500')) {
                    throw new Error('V0 API server error. The service may be temporarily unavailable. Please try again in a few minutes.');
                }
                if (error.message.includes('timeout')) {
                    throw new Error('V0 API request timed out. The component generation may be taking longer than expected. Please try again.');
                }
                throw new Error(`V0 component generation failed: ${error.message}`);
            }
            throw new Error('V0 component generation failed due to an unexpected error. Please check your request parameters and try again.');
        }
    }
    async generateComponentMultimodal(request) {
        try {
            // Validate multimodal request parameters
            if (!request.prompt || request.prompt.trim().length === 0) {
                throw new Error('Multimodal component generation requires a non-empty prompt describing what to create from the image(s)');
            }
            if (!request.images || request.images.length === 0) {
                throw new Error('Multimodal generation requires at least one image (wireframe, design, or screenshot)');
            }
            // Validate image data
            for (const [index, image] of request.images.entries()) {
                if (!image.data || image.data.trim().length === 0) {
                    throw new Error(`Image ${index + 1} has no data. Please provide valid base64 encoded image data.`);
                }
                if (!['wireframe', 'design', 'screenshot', 'reference'].includes(image.type)) {
                    throw new Error(`Image ${index + 1} has invalid type "${image.type}". Must be one of: wireframe, design, screenshot, reference.`);
                }
            }
            const messages = this.buildMultimodalMessages(request);
            const response = await this.makeRequest('/chat/completions', {
                model: 'v0-1.5-md',
                messages,
                temperature: request.temperature ?? 0.7,
                stream: request.stream ?? false,
            });
            return this.parseResponse(response);
        }
        catch (error) {
            if (error instanceof Error) {
                // Enhance specific multimodal error types
                if (error.message.includes('401')) {
                    throw new Error('V0 API authentication failed for multimodal request. Please verify your V0_API_KEY supports vision capabilities.');
                }
                if (error.message.includes('413') || error.message.includes('payload too large')) {
                    throw new Error('Image file size too large. Please compress images or use smaller images for component generation.');
                }
                if (error.message.includes('unsupported media type')) {
                    throw new Error('Image format not supported. Please use JPEG, PNG, or WebP images for component generation.');
                }
                throw new Error(`V0 multimodal component generation failed: ${error.message}`);
            }
            throw new Error('V0 multimodal component generation failed due to an unexpected error. Please check your images and try again.');
        }
    }
    async *generateComponentStreaming(request) {
        try {
            const messages = this.buildMessages(request);
            const response = await fetch(`${this.baseURL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'v0-1.5-md',
                    messages,
                    temperature: request.temperature ?? 0.7,
                    stream: true,
                }),
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${await response.text()}`);
            }
            const reader = response.body?.getReader();
            if (!reader) {
                throw new Error('No response body reader available');
            }
            const decoder = new TextDecoder();
            let buffer = '';
            let progress = 0;
            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done)
                        break;
                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');
                    buffer = lines.pop() || '';
                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const data = line.slice(6);
                            if (data === '[DONE]') {
                                yield {
                                    response_type: 'streaming',
                                    chunk: '',
                                    progress: 100,
                                    complete: true
                                };
                                return;
                            }
                            try {
                                const parsed = JSON.parse(data);
                                const chunk = parsed.choices[0]?.delta?.content || '';
                                progress = Math.min(progress + 5, 95);
                                yield {
                                    response_type: 'streaming',
                                    chunk,
                                    progress,
                                    complete: false,
                                    metadata: parsed.usage
                                };
                            }
                            catch {
                                // Skip invalid JSON chunks
                            }
                        }
                    }
                }
            }
            finally {
                reader.releaseLock();
            }
        }
        catch (error) {
            throw new Error(`V0 Streaming API request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async testConnection() {
        try {
            await this.makeRequest('/chat/completions', {
                model: 'v0-1.5-md',
                messages: [{ role: 'user', content: 'test' }],
                max_tokens: 1,
            });
            return true;
        }
        catch (error) {
            // Don't use console.error in MCP stdio transport as it interferes with JSON-RPC
            return false;
        }
    }
    async makeRequest(endpoint, body) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            if (!response.ok) {
                const errorText = await response.text();
                // Parse error response if it's JSON
                let errorDetails = errorText;
                try {
                    const errorJson = JSON.parse(errorText);
                    errorDetails = errorJson.error || errorJson.message || errorText;
                }
                catch {
                    // Keep original text if not JSON
                }
                throw new Error(`HTTP ${response.status}: ${errorDetails}`);
            }
            const responseData = await response.json();
            // Validate response structure
            if (!responseData.choices || !Array.isArray(responseData.choices) || responseData.choices.length === 0) {
                throw new Error('Invalid response format: missing or empty choices array');
            }
            return responseData;
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error(`Network request failed: ${String(error)}`);
        }
    }
    parseResponse(response) {
        // Validate response structure
        if (!response.choices || !Array.isArray(response.choices) || response.choices.length === 0) {
            throw new Error('Invalid response from v0 API: missing or empty choices array. The API may be experiencing issues.');
        }
        const choice = response.choices[0];
        if (!choice.message) {
            throw new Error('Invalid response from v0 API: missing message in response choice');
        }
        const content = choice.message.content || '';
        if (!content.trim()) {
            throw new Error('V0 API returned empty content. This may indicate the request was too complex or the service is experiencing issues. Please try simplifying your request.');
        }
        // Extract and validate component code
        const extractedCode = this.extractCode(content);
        if (!extractedCode || extractedCode.trim().length === 0) {
            throw new Error('V0 API response did not contain valid component code. Please try rephrasing your request with more specific requirements.');
        }
        // Basic validation for React component structure
        if (!extractedCode.includes('export') && !extractedCode.includes('function') && !extractedCode.includes('const')) {
            throw new Error('Generated code does not appear to be a valid React component. Please try a more specific component description.');
        }
        return {
            code: extractedCode,
            metadata: this.extractMetadata(content),
            explanation: this.extractExplanation(content),
        };
    }
    extractCode(content) {
        const codeMatch = content.match(/```(?:jsx?|tsx?|javascript|typescript)?\n([\s\S]*?)\n```/);
        return codeMatch?.[1] || content;
    }
    extractMetadata(content) {
        return {
            name: this.extractComponentName(content),
            description: 'Generated component',
            dependencies: this.extractDependencies(content),
            framework: 'react',
            styling: 'tailwind',
            accessibility: true,
            typescript: true,
        };
    }
    extractComponentName(content) {
        const nameMatch = content.match(/(?:function|const|export)\s+(\w+)/);
        return nameMatch?.[1] || 'GeneratedComponent';
    }
    extractDependencies(content) {
        const importMatches = content.match(/import\s+.*?\s+from\s+['"]([^'"]+)['"]/g) || [];
        return importMatches
            .map(match => match.match(/from\s+['"]([^'"]+)['"]/)?.[1])
            .filter(Boolean);
    }
    extractExplanation(content) {
        const lines = content.split('\n');
        const explanationLines = lines.filter(line => !line.trim().startsWith('```') &&
            !line.trim().startsWith('import') &&
            !line.trim().startsWith('export') &&
            line.trim().length > 0);
        return explanationLines.length > 0 ? explanationLines.join('\n') : undefined;
    }
    buildMessages(request) {
        return [
            {
                role: 'user',
                content: request.prompt
            }
        ];
    }
    buildMultimodalMessages(request) {
        const content = [
            {
                type: 'text',
                text: request.prompt
            }
        ];
        // Add images to the message content
        for (const image of request.images) {
            content.push({
                type: 'image_url',
                image_url: {
                    url: `data:image/jpeg;base64,${image.data}`,
                    detail: image.type === 'wireframe' ? 'high' : 'auto'
                }
            });
        }
        // Add image analysis prompt if provided
        if (request.image_analysis_prompt) {
            content.push({
                type: 'text',
                text: `\n\nImage Analysis Instructions: ${request.image_analysis_prompt}`
            });
        }
        return [
            {
                role: 'user',
                content
            }
        ];
    }
    // Error recovery with automatic retry
    async generateComponentWithRetry(request, maxRetries = 3) {
        let lastError;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await this.generateComponent(request);
            }
            catch (error) {
                lastError = error;
                // Don't retry on authentication errors
                if (error instanceof Error && error.message.includes('401')) {
                    throw error;
                }
                // Wait before retrying
                if (attempt < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
                }
            }
        }
        throw lastError;
    }
}
