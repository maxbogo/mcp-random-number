# MCP Random Number


## What?
As title says it is an MCP to get random number in defined rage. 
True random numbers are requested from random.org(the randomness comes from atmospheric noise).


## Why?
LLMs are very bad at generating random numbers. Below you can see a distrubution charts of 100 random numberts in range 1-100 requested from API of 3 popular LLMs. 

(add number_dist_data/chart_dist.png here)

## How?

### Step 1: **Copy, Install, Build:**

```bash
npm install
npm run build
```

### Step 2: Plug into Claude Desktop and Cline

Add the following configuration to your Claude Desktop or Cline settings:

```json
{
  "mcpServers": {
    "mcp-random-number": {
      "command": "node",
      "args": [
        "/ABSOLUTE/PATH/TO/PARENT/FOLDER/mcp-random-number/build/index.js"
      ]
    }
  }
}
```

> **Note:** Replace `/ABSOLUTE/PATH/TO/PARENT/FOLDER/mcp-random-number/` with the actual absolute path to this project directory.
