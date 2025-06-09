export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface Logger {
  debug(message: string, ...args: any[]): void;
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
}

class McpSafeLogger implements Logger {
  private getTimestamp(): string {
    return new Date().toISOString();
  }

  private formatMessage(level: LogLevel, message: string, ...args: any[]): string {
    const timestamp = this.getTimestamp();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    return `${prefix} ${message}` + (args.length > 0 ? ` ${JSON.stringify(args)}` : '');
  }

  // For MCP stdio transport, we should avoid console.* methods as they interfere with JSON-RPC
  // Instead, we'll use stderr for error output only when absolutely necessary
  debug(message: string, ...args: any[]): void {
    // Suppress debug logs in MCP mode
  }

  info(message: string, ...args: any[]): void {
    // Suppress info logs in MCP mode
  }

  warn(message: string, ...args: any[]): void {
    // Suppress warn logs in MCP mode
  }

  error(message: string, ...args: any[]): void {
    // Only log critical errors to stderr (not stdout which is used for JSON-RPC)
    process.stderr.write(this.formatMessage('error', message, ...args) + '\n');
  }
}

export const logger: Logger = new McpSafeLogger();

export class ErrorHandler {
  static handle(error: unknown, context?: string): Error {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const fullMessage = context ? `${context}: ${message}` : message;
    
    logger.error(fullMessage, error);
    
    return new Error(fullMessage);
  }

  static async handleAsync<T>(
    operation: () => Promise<T>,
    context?: string
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      throw ErrorHandler.handle(error, context);
    }
  }
}