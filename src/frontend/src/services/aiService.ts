import axios from "axios";
import { PlacesNearbyResponse } from "../types/types";

export interface ExpectedAIResponseFormat {
  name: string;
  description: string;
}

export interface CleanedAiResponse {
  data: string | ExpectedAIResponseFormat[];
}

async function getFoodSuggestions(
  inputAddress: string
): Promise<CleanedAiResponse> {
  const res = await axios.get<CleanedAiResponse>(
    "http://localhost:4000/openai/food",
    {
      params: {
        location: inputAddress,
      },
    }
  );
  return res.data;
}

export { getFoodSuggestions };
