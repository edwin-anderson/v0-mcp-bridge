#!/usr/bin/env node
// This line tells the system this file can be run directly as a script
// Import our custom modules
import { V0McpServer } from "./server/index.js"; // Our main MCP server class
import { validateConfig } from "./utils/config.js"; // Configuration validator
import { logger } from "./utils/logger.js"; // Logging utility
/**
 * Main function that starts the v0 MCP Server
 * This is an async function because starting servers involves waiting for operations to complete
 */
async function main() {
    try {
        // Log that we're starting up (helps with debugging)
        logger.info("Starting v0 MCP Server...");
        // Check if all required environment variables (like API keys) are present
        // This will throw an error if V0_API_KEY is missing
        validateConfig();
        // Create a new instance of our MCP server
        const server = new V0McpServer();
        // Set up graceful shutdown handlers
        // These listen for system signals to shut down the server cleanly
        // SIGINT is sent when user presses Ctrl+C
        process.on("SIGINT", async () => {
            logger.info("Received SIGINT, shutting down gracefully...");
            await server.stop(); // Clean up server resources
            process.exit(0); // Exit with success code
        });
        // SIGTERM is sent by process managers when they want to stop the service
        process.on("SIGTERM", async () => {
            logger.info("Received SIGTERM, shutting down gracefully...");
            await server.stop(); // Clean up server resources
            process.exit(0); // Exit with success code
        });
        // Actually start the server (this will keep running until stopped)
        await server.start();
    }
    catch (error) {
        // If anything goes wrong during startup, log the error and exit
        logger.error("Failed to start server:", error);
        process.exit(1); // Exit with error code 1 (indicates failure)
    }
}
// This check ensures the main() function only runs when this file is executed directly
// (not when it's imported as a module by another file)
if (import.meta.url === `file://${process.argv[1]}`) {
    // Start the main function and catch any unhandled errors
    main().catch((error) => {
        logger.error("Unhandled error:", error);
        process.exit(1); // Exit with error code if something unexpected happens
    });
}
