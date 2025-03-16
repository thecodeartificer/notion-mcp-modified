import { SvgGenerationParams } from "../types/index.js";
import { pollForCompletion, replicate } from "../services/replicate.js";
import { handleError } from "../utils/error.js";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { urlToSvg } from "../utils/image.js";
import { CONFIG } from "../config/index.js";

export const registerGenerateSvgTool = async (
  input: SvgGenerationParams
): Promise<CallToolResult> => {
  try {
    const prediction = await replicate.predictions.create({
      model: CONFIG.svgModelId,
      input,
    });

    await replicate.predictions.get(prediction.id);
    const completed = await pollForCompletion(prediction.id);

    const svg = await urlToSvg(completed?.output);

    return {
      content: [
        {
          type: "text",
          text: `This is a generated image link: ${completed?.output}`,
        },
        {
          type: "text",
          text: svg,
        },
        {
          type: "text",
          text: JSON.stringify(completed, null, 2),
        },
      ],
    };
  } catch (error) {
    handleError(error);
  }
};
