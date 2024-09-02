import axios from "axios";

export interface ExpectedAIResponseFormat {
  name: string;
  description: string;
}

export interface CleanedAiResponse {
  data: string | ExpectedAIResponseFormat[];
  isCached: boolean;
}

async function getFoodSuggestions(
  inputAddress: string
): Promise<CleanedAiResponse> {
  const res = await axios.get<CleanedAiResponse>(
    `http://${process.env.REACT_APP_BACKEND_HOST}/openai/food`,
    {
      params: {
        location: inputAddress,
      },
    }
  );
  return res.data;
}

async function getThingsToDoSuggestions(
  inputAddress: string
): Promise<CleanedAiResponse> {
  const res = await axios.get<CleanedAiResponse>(
    `http://${process.env.REACT_APP_BACKEND_HOST}/openai/toDo`,
    {
      params: {
        location: inputAddress,
      },
    }
  );
  return res.data;
}

export { getFoodSuggestions, getThingsToDoSuggestions };
