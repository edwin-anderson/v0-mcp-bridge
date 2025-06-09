class McpSafeLogger {
    getTimestamp() {
        return new Date().toISOString();
    }
    formatMessage(level, message, ...args) {
        const timestamp = this.getTimestamp();
        const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
        return `${prefix} ${message}` + (args.length > 0 ? ` ${JSON.stringify(args)}` : '');
    }
    // For MCP stdio transport, we should avoid console.* methods as they interfere with JSON-RPC
    // Instead, we'll use stderr for error output only when absolutely necessary
    debug(message, ...args) {
        // Suppress debug logs in MCP mode
    }
    info(message, ...args) {
        // Suppress info logs in MCP mode
    }
    warn(message, ...args) {
        // Suppress warn logs in MCP mode
    }
    error(message, ...args) {
        // Only log critical errors to stderr (not stdout which is used for JSON-RPC)
        process.stderr.write(this.formatMessage('error', message, ...args) + '\n');
    }
}
export const logger = new McpSafeLogger();
export class ErrorHandler {
    static handle(error, context) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        const fullMessage = context ? `${context}: ${message}` : message;
        logger.error(fullMessage, error);
        return new Error(fullMessage);
    }
    static async handleAsync(operation, context) {
        try {
            return await operation();
        }
        catch (error) {
            throw ErrorHandler.handle(error, context);
        }
    }
}
