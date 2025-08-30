// everything.ts
import "dotenv/config";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ErrorCode,
  type Tool,
} from "@modelcontextprotocol/sdk/types.js";

const NAME = process.env.MCP_SERVER_NAME?.trim() || "flupp-mcp-server";
const VERSION =
  process.env.npm_package_version?.trim() ||
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

// Utilities
type Json = unknown;
type ToolResponse =
  | { content: Array<{ type: "text"; text: string }> }
  | { content: Array<{ type: string; [k: string]: unknown }> };

function toToolResponse(result: Json): ToolResponse {
  if (
    typeof result === "object" &&
    result !== null &&
    "content" in (result as any) &&
    Array.isArray((result as any).content)
  ) {
    return result as ToolResponse;
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

// Optional dynamic Flupp module shape
type FluppToolDecl = {
  name: string;
  description?: string;
  inputSchema?: Record<string, unknown>;
};
type FluppModule =
  | {
      tools?: FluppToolDecl[];
      handlers?: Record<
        string,
        (args: Json, ctx: { baseUrl: string; fetch: typeof fetch }) => Promise<Json | ToolResponse>
      >;
      run?: (
        name: string,
        args: Json,
        ctx: { baseUrl: string; fetch: typeof fetch }
      ) => Promise<Json | ToolResponse>;
      cleanup?: () => Promise<void> | void;
    }
  | undefined;

async function tryLoadFlupp(): Promise<FluppModule> {
  try {
    const mod = (await import("./tools.flupp.js")) as FluppModule;
    console.error(`[${NAME}] Loaded tools from tools.flupp.js`);
    return mod;
  } catch {
    // Silent: tools.flupp.js is optional
    return undefined;
  }
}

// The exported factory used by stdio.ts and mcp-server.ts
export function createServer() {
  const server = new Server(
    { name: NAME, version: VERSION },
    { capabilities: { tools: {} } }
  );

  const tools: Tool[] = [];
  const handlers: Record<string, (args: Json) => Promise<ToolResponse>> = {};
  let externalCleanup: (() => Promise<void> | void) | undefined;

  // Core tools
  tools.push({
    name: "ping",
    description: "Liveness check",
    inputSchema: { type: "object", properties: {}, additionalProperties: false } as any,
  });
  handlers["ping"] = async () =>
    toToolResponse({ ok: true, pong: new Date().toISOString(), baseUrl: FLUPP_BASE_URL });

  tools.push({
    name: "flupp_health",
    description: "Check Flupp backend health",
    inputSchema: { type: "object", properties: {}, additionalProperties: false } as any,
  });
  handlers["flupp_health"] = async () => {
    const res = await fetch(`${FLUPP_BASE_URL}/health`).catch((e) => {
      return {
        ok: false,
        status: 0,
        text: async () => String(e),
      } as unknown as Response;
    });
    const raw = await (res as Response).text();
    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch {
      body = raw;
    }
    return toToolResponse({ ok: (res as Response).ok, status: (res as Response).status, body });
  };

  // Wire MCP handlers
  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));

  server.setRequestHandler(CallToolRequestSchema, async (req) => {
    const name = req.params.name;
    const args = (req.params.arguments ?? {}) as Json;

    const handler = handlers[name];
    if (!handler) throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);

    return await handler(args);
  });

  // Load optional external tools without blocking creation
  (async () => {
    const mod = await tryLoadFlupp();
    if (!mod) return;

    externalCleanup = mod.cleanup;

    const fluppTools: FluppToolDecl[] = mod.tools ?? [];
    const fluppHandlers = mod.handlers;
    const fluppRun = mod.run;

    for (const t of fluppTools) {
      const schema =
        (t.inputSchema && (t.inputSchema as any).type
          ? t.inputSchema
          : { type: "object", properties: {}, additionalProperties: true }) as any;

      tools.push({
        name: t.name,
        description: t.description || "Flupp tool",
        inputSchema: schema,
      });

      handlers[t.name] = async (inputArgs: Json) => {
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
        } catch (err) {
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
      if (externalCleanup) await externalCleanup();
    } catch (err) {
      console.error(`[${NAME}] cleanup error:`, err);
    }
  }

  return { server, cleanup };
}



