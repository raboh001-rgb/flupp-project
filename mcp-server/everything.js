// everything.ts
import "dotenv/config";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { CallToolRequestSchema, ListToolsRequestSchema, McpError, ErrorCode, } from "@modelcontextprotocol/sdk/types.js";
const NAME = process.env.MCP_SERVER_NAME?.trim() || "flupp-mcp-server";
const VERSION = process.env.npm_package_version?.trim() ||
    process.env.MCP_SERVER_VERSION?.trim() ||
    "1.0.0";
const FLUPP_BASE_URL = process.env.FLUPP_BASE_URL?.trim() || "http://localhost:8787";
// Basic Node version guard
const minNode = 18;
const nodeMajor = parseInt(process.versions.node.split(".")[0] || "0", 10);
if (Number.isNaN(nodeMajor) || nodeMajor < minNode) {
    console.error(`${NAME} requires Node ${minNode}+; detected ${process.version}`);
    // Don't exit here since this module can be imported by tools — leave decision to callers.
}
function toToolResponse(result) {
    if (typeof result === "object" &&
        result !== null &&
        "content" in result &&
        Array.isArray(result.content)) {
        return result;
    }
    return {
        content: [
            {
                type: "text",
                text: typeof result === "string" ? result : JSON.stringify(result, null, 2),
            },
        ],
    };
}
async function tryLoadFlupp() {
    try {
        const mod = (await import("./tools.flupp.js"));
        console.error(`[${NAME}] Loaded tools from tools.flupp.js`);
        return mod;
    }
    catch {
        // Silent: tools.flupp.js is optional
        return undefined;
    }
}
// The exported factory used by stdio.ts and mcp-server.ts
export function createServer() {
    const server = new Server({ name: NAME, version: VERSION }, { capabilities: { tools: {} } });
    const tools = [];
    const handlers = {};
    let externalCleanup;
    // Core tools
    tools.push({
        name: "ping",
        description: "Liveness check",
        inputSchema: { type: "object", properties: {}, additionalProperties: false },
    });
    handlers["ping"] = async () => toToolResponse({ ok: true, pong: new Date().toISOString(), baseUrl: FLUPP_BASE_URL });
    tools.push({
        name: "flupp_health",
        description: "Check Flupp backend health",
        inputSchema: { type: "object", properties: {}, additionalProperties: false },
    });
    handlers["flupp_health"] = async () => {
        const res = await fetch(`${FLUPP_BASE_URL}/health`).catch((e) => {
            return {
                ok: false,
                status: 0,
                text: async () => String(e),
            };
        });
        const raw = await res.text();
        let body;
        try {
            body = JSON.parse(raw);
        }
        catch {
            body = raw;
        }
        return toToolResponse({ ok: res.ok, status: res.status, body });
    };
    // Wire MCP handlers
    server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));
    server.setRequestHandler(CallToolRequestSchema, async (req) => {
        const name = req.params.name;
        const args = (req.params.arguments ?? {});
        const handler = handlers[name];
        if (!handler)
            throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
        return await handler(args);
    });
    // Load optional external tools without blocking creation
    (async () => {
        const mod = await tryLoadFlupp();
        if (!mod)
            return;
        externalCleanup = mod.cleanup;
        const fluppTools = mod.tools ?? [];
        const fluppHandlers = mod.handlers;
        const fluppRun = mod.run;
        for (const t of fluppTools) {
            const schema = (t.inputSchema && t.inputSchema.type
                ? t.inputSchema
                : { type: "object", properties: {}, additionalProperties: true });
            tools.push({
                name: t.name,
                description: t.description || "Flupp tool",
                inputSchema: schema,
            });
            handlers[t.name] = async (inputArgs) => {
                try {
                    if (fluppHandlers && typeof fluppHandlers[t.name] === "function") {
                        const out = await fluppHandlers[t.name](inputArgs, { baseUrl: FLUPP_BASE_URL, fetch });
                        return toToolResponse(out);
                    }
                    if (typeof fluppRun === "function") {
                        const out = await fluppRun(t.name, inputArgs, { baseUrl: FLUPP_BASE_URL, fetch });
                        return toToolResponse(out);
                    }
                    throw new Error(`No handler found for Flupp tool "${t.name}".`);
                }
                catch (err) {
                    const msg = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
                    return toToolResponse({ ok: false, tool: t.name, error: msg });
                }
            };
        }
        console.error(`[${NAME}] Registered tools: ${tools.map((t) => t.name).join(", ")}`);
    })().catch((err) => {
        console.error(`[${NAME}] Error loading external tools:`, err);
    });
    async function cleanup() {
        try {
            if (externalCleanup)
                await externalCleanup();
        }
        catch (err) {
            console.error(`[${NAME}] cleanup error:`, err);
        }
    }
    return { server, cleanup };
}
