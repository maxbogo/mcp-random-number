import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create server instance
const server = new McpServer({
  name: "mcp-random-number",
  version: "1.0.0",
});

// Register tools
server.tool(
  "get-random-number",
  "Get a random number within a specified range",
  {
    min: z.number().describe("Minimum value (inclusive)").default(1),
    max: z.number().describe("Maximum value (inclusive)").default(100),
  },
  async ({ min, max }) => {
    
    // Validate range
    if (min > max) {
      throw new Error("Minimum value cannot be greater than maximum value");
    }
    
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    return {
      content: [
        {
          type: "text",
          text: randomNumber.toString(),
        },
      ],
    };
  },
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Random Number MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
