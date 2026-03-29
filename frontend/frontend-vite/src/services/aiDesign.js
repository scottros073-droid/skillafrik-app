import OpenAI from "openai";

const openai = new OpenAI({ apiKey: import.meta.env.VITE_OPENAI_API_KEY });

export async function generateDesign({ type, description }) {
  const prompt = `Create a high-quality ${type} for: ${description}. Use professional design, vibrant colors, and make it visually appealing for digital use.`;

  const response = await openai.images.generate({
    model: "gpt-image-1",
    prompt,
    size: "1024x1024",
    n: 1
  });

  return response.data[0].url;
}
