import { errorMessage } from "../lib/utils";
import { ZombieSurvival } from "../simulators/zombie-survival";
import { claude35sonnet } from "./claude-3-5-sonnet";
import { gemini15pro } from "./gemini-1.5-pro";
import { gpt4o } from "./gpt-4o";
import { perplexityModel } from "./perplexity-llama";

export type ModelHandler = (
  prompt: string,
  map: string[][],
) => Promise<{
  boxCoordinates: number[][];
  playerCoordinates: number[];
  reasoning: string;
}>;

export async function runModel(
  modelId: string,
  map: string[][],
  prompt: string,
): Promise<{
  solution?: string[][];
  reasoning: string;
  error?: string;
}> {
  let result;

  try {
    switch (modelId) {
      case "gemini-1.5-pro": {
        result = await gemini15pro(prompt, map);
        break;
      }
      case "gpt-4o": {
        result = await gpt4o(prompt, map);
        break;
      }
      case "claude-3.5-sonnet": {
        result = await claude35sonnet(prompt, map);
        break;
      }
      case "perplexity-llama-3.1": {
        result = await perplexityModel(prompt, map);
        break;
      }
      default: {
        throw new Error(`Tried running unknown model '${modelId}'`);
      }
    }

    const originalMap = ZombieSurvival.cloneMap(map);
    const [playerRow, playerCol] = result.playerCoordinates;

    if (originalMap[playerRow][playerCol] !== " ") {
      return {
        reasoning: result.reasoning,
        error: "Tried to place player in a non-empty space",
      };
    }

    originalMap[playerRow][playerCol] = "P";

    for (const block of result.boxCoordinates) {
      const [blockRow, blockCol] = block;

      if (originalMap[blockRow][blockCol] !== " ") {
        return {
          reasoning: result.reasoning,
          error: "Tried to place block in a non-empty space",
        };
      }

      originalMap[blockRow][blockCol] = "B";
    }

    return {
      solution: originalMap,
      reasoning: result.reasoning,
    };
  } catch (error) {
    return {
      reasoning: "Internal error",
      error: errorMessage(error),
    };
  }
}
