import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import Replicate from "replicate";

// Configuration
const CONFIG = {
  serverName: "replicate-flux-mcp",
  serverVersion: "0.0.1",
  modelId: "black-forest-labs/flux-schnell",
  pollingAttempts: 5,
  pollingInterval: 2000, // ms
};

// Initialize MCP server
const server = new McpServer({
  name: CONFIG.serverName,
  version: CONFIG.serverVersion,
});

// Environment validation
function getReplicateApiToken(): string {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) {
    throw new Error("REPLICATE_API_TOKEN environment variable is required");
  }
  return token;
}

// Initialize Replicate client
const replicate = new Replicate({
  auth: getReplicateApiToken(),
});

// Schema definitions
const imageGenerationSchema = {
  prompt: z.string().min(1).describe("Prompt for generated image"),
  seed: z
    .number()
    .int()
    .optional()
    .describe("Random seed. Set for reproducible generation"),
  go_fast: z
    .boolean()
    .default(true)
    .describe(
      "Run faster predictions with model optimized for speed (currently fp8 quantized); disable to run in original bf16"
    ),
  megapixels: z
    .enum(["1", "0.25"])
    .default("1")
    .describe("Approximate number of megapixels for generated image"),
  num_outputs: z
    .number()
    .int()
    .min(1)
    .max(4)
    .default(1)
    .describe("Number of outputs to generate"),
  aspect_ratio: z
    .enum([
      "1:1",
      "16:9",
      "21:9",
      "3:2",
      "2:3",
      "4:5",
      "5:4",
      "3:4",
      "4:3",
      "9:16",
      "9:21",
    ])
    .default("1:1")
    .describe("Aspect ratio for the generated image"),
  output_format: z
    .enum(["webp", "jpg", "png"])
    .default("webp")
    .describe("Format of the output images"),
  output_quality: z
    .number()
    .int()
    .min(0)
    .max(100)
    .default(80)
    .describe(
      "Quality when saving the output images, from 0 to 100. 100 is best quality, 0 is lowest quality. Not relevant for .png outputs"
    ),
  num_inference_steps: z
    .number()
    .int()
    .min(1)
    .max(4)
    .default(4)
    .describe(
      "Number of denoising steps. 4 is recommended, and lower number of steps produce lower quality outputs, faster."
    ),
  disable_safety_checker: z
    .boolean()
    .default(false)
    .describe("Disable safety checker for generated images."),
};

// Helper functions
async function pollForCompletion(predictionId: string) {
  for (let i = 0; i < CONFIG.pollingAttempts; i++) {
    const latest = await replicate.predictions.get(predictionId);
    if (latest.status !== "starting" && latest.status !== "processing") {
      return latest;
    }
    await new Promise((resolve) => setTimeout(resolve, CONFIG.pollingInterval));
  }
  return null;
}

function handleError(error: unknown): never {
  if (error instanceof Error) {
    throw new McpError(ErrorCode.InternalError, error.message);
  }
  throw new McpError(ErrorCode.InternalError, String(error));
}

// Register tools
server.tool(
  "generate_image",
  "Generate an image from a text prompt using Flux Schnell model",
  imageGenerationSchema,
  async (input) => {
    try {
      const prediction = await replicate.predictions.create({
        model: CONFIG.modelId,
        input,
      });

      // Initial check
      await replicate.predictions.get(prediction.id);

      // Poll for completion
      const completed = await pollForCompletion(prediction.id);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(completed || "Processing timed out", null, 2),
          },
        ],
      };
    } catch (error) {
      handleError(error);
    }
  }
);

server.tool(
  "prediction_list",
  "Get a list of recent predictions from Replicate",
  {
    limit: z
      .number()
      .int()
      .min(1)
      .max(100)
      .default(50)
      .describe("Maximum number of predictions to return"),
  },
  async ({ limit }) => {
    try {
      const predictions = [];
      for await (const page of replicate.paginate(replicate.predictions.list)) {
        predictions.push(...page);
        if (predictions.length >= limit) {
          break;
        }
      }

      // Trim to exact limit
      const limitedPredictions = predictions.slice(0, limit);
      const totalPages = Math.ceil(predictions.length / limit);

      return {
        content: [
          {
            type: "text",
            text: `Found ${limitedPredictions.length} predictions (showing ${limitedPredictions.length} of ${predictions.length} total, page 1 of ${totalPages})`,
          },
          {
            type: "text",
            text: JSON.stringify(limitedPredictions, null, 2),
          },
        ],
      };
    } catch (error) {
      handleError(error);
    }
  }
);

server.tool(
  "get_prediction",
  "Get details of a specific prediction by ID",
  {
    predictionId: z
      .string()
      .min(1)
      .describe("ID of the prediction to retrieve"),
  },
  async ({ predictionId }) => {
    try {
      const prediction = await replicate.predictions.get(predictionId);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(prediction, null, 2),
          },
        ],
      };
    } catch (error) {
      handleError(error);
    }
  }
);

// Server initialization
async function main() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error(
      `${CONFIG.serverName} v${CONFIG.serverVersion} running on stdio`
    );
  } catch (error) {
    console.error(
      "Server initialization error:",
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }
}

main().catch((error: unknown) => {
  console.error(
    "Unhandled server error:",
    error instanceof Error ? error.message : String(error)
  );
  process.exit(1);
});
