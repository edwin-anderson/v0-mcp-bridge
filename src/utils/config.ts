import { z } from 'zod';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env file manually since we're using ES modules
function loadEnvFile() {
  try {
    const envPath = resolve(process.cwd(), '.env');
    const envContent = readFileSync(envPath, 'utf8');
    
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    });
  } catch (error) {
    // .env file doesn't exist or can't be read, that's okay
  }
}

// Load environment variables from .env file
loadEnvFile();

const configSchema = z.object({
  V0_API_KEY: z.string().min(1, 'V0_API_KEY is required'),
});

export interface Config {
  v0ApiKey: string;
}

export function loadConfig(): Config {
  const env = {
    V0_API_KEY: process.env.V0_API_KEY,
  };

  try {
    const validated = configSchema.parse(env);
    return {
      v0ApiKey: validated.V0_API_KEY,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map(issue => issue.path.join('.')).join(', ');
      throw new Error(`Missing required environment variables: ${missingVars}`);
    }
    throw error;
  }
}

export function validateConfig(): void {
  try {
    loadConfig();
    // Configuration validated successfully (no output to avoid MCP JSON parsing issues)
  } catch (error) {
    // Use stderr to avoid interfering with MCP JSON-RPC on stdout
    process.stderr.write(`Configuration validation failed: ${error instanceof Error ? error.message : error}\n`);
    process.exit(1);
  }
}