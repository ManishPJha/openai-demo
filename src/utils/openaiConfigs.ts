import { Configuration, OpenAIApi } from "openai";

const config = new Configuration({
  apiKey: process.env.API_KEY,
});

const api = new OpenAIApi(config);

export default api;
