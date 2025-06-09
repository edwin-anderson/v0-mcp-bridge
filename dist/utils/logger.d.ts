export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export interface Logger {
    debug(message: string, ...args: any[]): void;
    info(message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
    error(message: string, ...args: any[]): void;
}
export declare const logger: Logger;
export declare class ErrorHandler {
    static handle(error: unknown, context?: string): Error;
    static handleAsync<T>(operation: () => Promise<T>, context?: string): Promise<T>;
}
