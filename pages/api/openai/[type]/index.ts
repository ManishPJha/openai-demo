import type { NextApiRequest, NextApiResponse } from "next";

import api from "@/utils/openaiConfigs";

const handler = (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    const r = JSON.parse(req.body);

    const query = req.query;

    if (req.method !== "POST") {
      return res.end("invalid request method!");
    }

    if (query.type === "complete") {
      try {
        const response = await api.createCompletion({
          model: "text-davinci-003", //['text-curie-001', 'text-babbage-001', 'text-ada-001']
          prompt: r.input,
          // temperature: 0.9,
          // max_tokens: 256,
          // // top_p: 1,
          // frequency_penalty: 0,
          // presence_penalty: 0,
          temperature: 0.9,
          max_tokens: 2147,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        });

        return res.json({
          success: true,
          data: response.data.choices[0].text,
        });
      } catch (error: any) {
        console.log(`>>>ERROR:`, error.message);

        if (error.response.status === 401) {
          resolve(error);
          res.status(401).end("Unauthorized request!");
          // reject("Unauthorized request!");
        }

        reject(error.message);
      }
    }

    if (query.type === "generate") {
      try {
        const response = await api.createImage({
          prompt: r.input,
          n: Number(query._total) || 1,
          size: "256x256",
          response_format: "url",
        });

        return res.json({
          success: true,
          data: response.data.data[0].url,
        });
      } catch (error: any) {
        console.log(`>>>ERROR:`, error.message);

        if (error.response.status === 401) {
          resolve(error);
          res.status(401).end("Unauthorized request!");
          // reject("Unauthorized request!");
        } 
        // else {
        //   res.json({
        //     success: false,
        //     message: "no result match!",
        //   });
        // }

        reject(error.message);
      }
    }
  });
};

export default handler;
