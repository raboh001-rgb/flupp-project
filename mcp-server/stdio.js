#!/usr/bin/env node
// stdio.ts
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer } from "./everything.js";
console.error("Starting default (STDIO) server...");
async function main() {
    const transport = new StdioServerTransport();
    const { server, cleanup } = createServer();
    await server.connect(transport);
    const shutdown = async (code = 0) => {
        try {
            await cleanup();
            await server.close();
        }
        catch (err) {
            console.error("Error during shutdown:", err);
        }
        finally {
            process.exit(code);
        }
    };
    process.on("SIGINT", () => shutdown(0));
    process.on("SIGTERM", () => shutdown(0));
    process.on("uncaughtException", (err) => {
        console.error("Uncaught exception:", err);
        shutdown(1);
    });
    process.on("unhandledRejection", (reason) => {
        console.error("Unhandled rejection:", reason);
        shutdown(1);
    });
}
main().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
});
