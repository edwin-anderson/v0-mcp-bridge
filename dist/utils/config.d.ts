export interface Config {
    v0ApiKey: string;
}
export declare function loadConfig(): Config;
export declare function validateConfig(): void;
