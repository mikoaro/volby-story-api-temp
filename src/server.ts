import express, { Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import OpenAI from "openai";

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const createServer = () => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(express.urlencoded({ extended: true }))
    .use(express.json())
    .use(cors());

  app.get("/health", (req: Request, res: Response) => {
    res.json({ ok: true });
  });

  app.post("/chat", async (req: Request, res: Response) => {
    try {
      // Parse the request body
      const { prompt } = await req.body;

      console.log("Received prompt: ", prompt);

      // Validate the prompt
      if (!prompt || typeof prompt !== "string") {
        res.status(400).json({ message: "Invalid prompt" });
      }

      // Generate the image using OpenAI API
      const response = await openai.images.generate({
        model: "dall-e-2",
        prompt: prompt,
        n: 1,
        size: "512x512",
      });

      // Extract the image URL from the response
      const imageUrl = response.data[0].url;

      console.log("Image URL: ", imageUrl);

      // Return the image URL
      //return res.json({ imageUrl });
      return res
        .status(200)
        .json({ message: "Data received and processed", imageUrl: imageUrl });
    } catch (error) {
      console.error("Error generating image:", error);
      return res
        .status(500)
        .json({ message: "Internal server error - Failed to generate image" });
    }
  });

  return app;
};
