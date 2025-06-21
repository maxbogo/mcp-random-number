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
    
    const randomNumber = await getRandomNumber(min, max);

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

async function getRandomNumber(min: number, max: number): Promise<number> {
  const url = `https://www.random.org/integers/?num=1&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Random.org API error: ${response.status}`);
    }
    
    const text = await response.text();
    const number = parseInt(text.trim(), 10);
    
    if (isNaN(number)) {
      throw new Error('Invalid response from Random.org');
    }
    
    return number;
  } catch (error) {
    throw new Error(`Failed to get random number from Random.org: ${error}`);
  }
}

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
