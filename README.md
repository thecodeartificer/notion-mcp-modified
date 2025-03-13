# Replicate Flux MCP

![MCP Compatible](https://img.shields.io/badge/MCP-Compatible-blue)
![License](https://img.shields.io/badge/license-MIT-green)

A Model Context Protocol (MCP) server that provides AI assistants with the ability to generate images using [Black Forest Labs' Flux Schnell model](https://replicate.com/black-forest-labs/flux-schnell) via Replicate's API.

## 🌟 Highlights

- **Seamless AI Integration**: Enable AI assistants like Claude to generate images directly
- **High-Quality Image Generation**: Access to Flux Schnell, a state-of-the-art image generation model
- **Customizable Parameters**: Control aspect ratio, quality, inference steps, and more
- **MCP Compatible**: Works with any MCP client (Cursor, Claude Desktop, Cline, Zed, etc.)
- **Local Processing**: All requests are processed locally and securely

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
  - [Setting Up Environment](#setting-up-environment)
  - [Running the Server](#running-the-server)
  - [Connecting with Cursor](#connecting-with-cursor)
    - [Method 1: Using mcp.json](#method-1-using-mcpjson)
    - [Method 2: Using Cursor MCP Settings](#method-2-using-cursor-mcp-settings)
  - [Connecting with Other MCP Clients](#connecting-with-other-mcp-clients)
- [Available Tools](#available-tools)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## 🔍 Overview

This MCP server implements the [Model Context Protocol](https://modelcontextprotocol.io) to provide AI assistants with the ability to generate images using Replicate's Flux Schnell model. It allows AI models to create high-quality images from text prompts with various customization options.

## 🏗️ Architecture

```
┌─────────────┐     ┌──────────────┐     ┌───────────────┐
│  MCP Client │ ──► │  This MCP    │ ──► │   Replicate   │
│  (e.g.      │ ◄── │  Server      │ ◄── │   API         │
│   Cursor)   │     │              │     │               │
└─────────────┘     └──────────────┘     └───────────────┘
```

- **MCP Client**: Any application that supports the Model Context Protocol (Cursor, Claude Desktop, etc.)
- **MCP Server**: This repository, which handles requests from the client and communicates with Replicate
- **Replicate API**: The service that hosts and runs the Flux Schnell model

## 📋 Prerequisites

- Node.js v16.0.0 or higher
- npm or yarn
- A Replicate API token ([Get one here](https://replicate.com/account/api-tokens))

## 🚀 Installation

### From npm

```bash
npm install replicate-flux-mcp
```

### From Source

```bash
# Clone the repository
git clone https://github.com/yourusername/replicate-flux-mcp.git
cd replicate-flux-mcp

# Install dependencies
npm install

# Build the project
npm run build
```

## 🔧 Usage

### Setting Up Environment

Create a `.env` file in the root directory with your Replicate API token:

```
REPLICATE_API_TOKEN=your_replicate_api_token
```

### Running the Server

```bash
# Using npx
npx replicate-flux-mcp

# Or if installed globally
replicate-flux-mcp

# Or from source
npm start
```

### Connecting with Cursor

There are two ways to connect this MCP server with Cursor:

#### Method 1: Using mcp.json

1. Create or edit the `.cursor/mcp.json` file in your project directory:

```json
{
  "mcpServers": {
    "replicate-flux-mcp": {
      "command": "env REPLICATE_API_TOKEN=your_replicate_api_token node",
      "args": [
        "/path/to/replicate-flux-mcp/build/index.js"
      ]
    }
  }
}
```

2. Replace `your_replicate_api_token` with your actual Replicate API token
3. Update the path in `args` to point to your built index.js file
4. Restart Cursor to apply the changes

#### Method 2: Using Cursor MCP Settings

1. Open Cursor and go to Settings
2. Navigate to the "MCP" or "Model Context Protocol" section
3. Click "Add Server" or equivalent
4. Enter the following command in the appropriate field:

```
env REPLICATE_API_TOKEN=your_replicate_api_token node /path/to/replicate-flux-mcp/build/index.js
```

5. Replace `your_replicate_api_token` with your actual Replicate API token
6. Update the path to point to your built index.js file
7. Save the settings and restart Cursor if necessary

### Connecting with Other MCP Clients

Configure your MCP client to connect to this server. The exact steps depend on your client, but typically involve:

1. Opening your MCP client settings
2. Adding a new MCP server
3. Pointing it to this server's endpoint (usually a local port or stdio)

## 🛠️ Available Tools

This MCP server provides the following tools:

### 1. `generate_image`

Generates an image based on a text prompt.

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `prompt` | string | (required) | Text description of the image to generate |
| `seed` | number | (optional) | Random seed for reproducible generation |
| `go_fast` | boolean | true | Run faster predictions with optimized model |
| `megapixels` | string | "1" | Image resolution ("1" or "0.25") |
| `num_outputs` | number | 1 | Number of images to generate (1-4) |
| `aspect_ratio` | string | "1:1" | Aspect ratio (e.g., "16:9", "4:3") |
| `output_format` | string | "webp" | Output format ("webp", "jpg", "png") |
| `output_quality` | number | 80 | Image quality (0-100) |
| `num_inference_steps` | number | 4 | Number of denoising steps (1-4) |
| `disable_safety_checker` | boolean | false | Disable safety filter |

**Example:**

```javascript
// In your MCP client
const result = await mcp.generate_image({
  prompt: "A beautiful sunset over mountains",
  aspect_ratio: "16:9",
  output_format: "png"
});
```

### 2. `prediction_list`

Retrieves a list of your recent predictions from Replicate.

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | number | 50 | Maximum number of predictions to return (1-100) |

### 3. `get_prediction`

Gets detailed information about a specific prediction.

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `predictionId` | string | (required) | ID of the prediction to retrieve |

## ⚙️ Configuration

The server can be configured by modifying the `CONFIG` object in `src/index.ts`:

```javascript
const CONFIG = {
  serverName: "replicate-flux-mcp",
  serverVersion: "0.0.1",
  modelId: "black-forest-labs/flux-schnell",
  pollingAttempts: 5,
  pollingInterval: 2000, // ms
};
```

## 🔍 Troubleshooting

### Common Issues

#### Authentication Error
- Ensure your `REPLICATE_API_TOKEN` is correctly set in the environment
- Verify your token is valid by testing it with the Replicate API directly

#### Timeout Error
- The server polls for completion 5 times by default
- For larger images or busy servers, try increasing `pollingAttempts` or `pollingInterval`

#### Safety Filter Triggered
- The model has a built-in safety filter that may block certain prompts
- Try modifying your prompt to avoid potentially problematic content

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Resources

- [Model Context Protocol Documentation](https://modelcontextprotocol.io)
- [Replicate API Documentation](https://replicate.com/docs)
- [Flux Schnell Model](https://replicate.com/black-forest-labs/flux-schnell)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) 

