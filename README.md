# Replicate Flux MCP

![MCP Compatible](https://img.shields.io/badge/MCP-Compatible-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-blue)
![Model Context Protocol](https://img.shields.io/badge/MCP-Enabled-purple)
[![smithery badge](https://smithery.ai/badge/@awkoy/replicate-flux-mcp)](https://smithery.ai/server/@awkoy/replicate-flux-mcp)

A powerful Model Context Protocol (MCP) server that provides AI assistants with the ability to generate images using [Black Forest Labs' Flux Schnell model](https://replicate.com/black-forest-labs/flux-schnell) via Replicate's API.

[Installation](#installation) • [Features](#features) • [Usage](#usage) • [Documentation](#documentation) • [Contributing](#contributing)

---

## 🌟 Features

- **🖼️ High-Quality Image Generation**: Access to Flux Schnell, a state-of-the-art image generation model
- **🤖 Seamless AI Integration**: Enable AI assistants like Claude to generate images directly
- **🎛️ Customizable Parameters**: Control aspect ratio, quality, inference steps, and more
- **🔌 MCP Compatible**: Works with any MCP client (Cursor, Claude Desktop, Cline, Zed, etc.)
- **🔒 Local Processing**: All requests are processed locally and securely
- **🔍 Prediction Management**: View and retrieve your generation history

## 📦 Installation

### NPM Global Installation

```bash
npm install -g replicate-flux-mcp
```

### Direct Usage with NPX

```bash
REPLICATE_API_TOKEN=your_token npx -y replicate-flux-mcp
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

## 📚 Documentation

### Available Tools

#### `generate_image`

Generates an image based on a text prompt using the Flux Schnell model.

```typescript
{
  prompt: string;                // Required: Text description of the image to generate
  seed?: number;                 // Optional: Random seed for reproducible generation
  go_fast?: boolean;             // Optional: Run faster predictions with optimized model (default: true)
  megapixels?: "1" | "0.25";     // Optional: Image resolution (default: "1")
  num_outputs?: number;          // Optional: Number of images to generate (1-4) (default: 1)
  aspect_ratio?: string;         // Optional: Aspect ratio (e.g., "16:9", "4:3") (default: "1:1")
  output_format?: string;        // Optional: Output format ("webp", "jpg", "png") (default: "webp")
  output_quality?: number;       // Optional: Image quality (0-100) (default: 80)
  num_inference_steps?: number;  // Optional: Number of denoising steps (1-4) (default: 4)
  disable_safety_checker?: boolean; // Optional: Disable safety filter (default: false)
}
```

#### `prediction_list`

Retrieves a list of your recent predictions from Replicate.

```typescript
{
  limit?: number;  // Optional: Maximum number of predictions to return (1-100) (default: 50)
}
```

#### `get_prediction`

Gets detailed information about a specific prediction.

```typescript
{
  predictionId: string;  // Required: ID of the prediction to retrieve
}
```

## 🔧 Usage

### CLI Usage

Start the MCP server directly:

```bash
replicate-flux-mcp
```

Or via npx:

```bash
npx -y replicate-flux-mcp
```

### Environment Setup

Provide your Replicate API token directly when running the server:

```bash
REPLICATE_API_TOKEN=YOUR_TOKEN npx -y replicate-flux-mcp
```

### Cursor Integration

#### Method 1: Using mcp.json

1. Create or edit the `.cursor/mcp.json` file in your project directory:

```json
{
  "mcpServers": {
    "replicate-flux-mcp": {
      "command": "env REPLICATE_API_TOKEN=YOUR_TOKEN npx",
      "args": ["-y", "replicate-flux-mcp"]
    }
  }
}
```

2. Replace `your_replicate_api_token` with your actual Replicate API token
3. Restart Cursor to apply the changes

#### Method 2: Using Cursor MCP Settings

1. Open Cursor and go to Settings
2. Navigate to the "MCP" or "Model Context Protocol" section
3. Click "Add Server" or equivalent
4. Enter the following command in the appropriate field:

```
env REPLICATE_API_TOKEN=YOUR_TOKEN npx -y replicate-flux-mcp
```

5. Replace `your_replicate_api_token` with your actual Replicate API token
6. Save the settings and restart Cursor if necessary

### Claude Desktop Integration

1. Locate your Claude Desktop configuration file:  
   * macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`  
   * Windows: `%APPDATA%/Claude/claude_desktop_config.json`  
   * Linux: `~/.config/Claude/claude_desktop_config.json`
2. Add the following configuration to your `mcpServers` object:

```json
{
  "mcpServers": {
    "replicate-flux-mcp": {
      "command": "env REPLICATE_API_TOKEN=YOUR_TOKEN npx",
      "args": ["-y", "replicate-flux-mcp"]
    }
  }
}
```

## 💻 Local Development

1. Clone the repository:

```bash
git clone https://github.com/yourusername/replicate-flux-mcp.git
cd replicate-flux-mcp
```

2. Install dependencies:

```bash
npm install
```

3. Start development mode:

```bash
npm run dev
```

4. Build the project:

```bash
npm run build
```

## 🛠 Technical Stack

* Model Context Protocol SDK - Core MCP functionality
* Replicate API - Image generation service
* TypeScript - Type safety and modern JavaScript features
* Zod - Runtime type validation

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
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Resources

- [Model Context Protocol Documentation](https://modelcontextprotocol.io)
- [Replicate API Documentation](https://replicate.com/docs)
- [Flux Schnell Model](https://replicate.com/black-forest-labs/flux-schnell)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [Smithery Documentation](https://smithery.ai/docs)

---

Made with ❤️ by [Your Name/Organization]

