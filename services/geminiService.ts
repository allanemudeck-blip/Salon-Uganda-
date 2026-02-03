
import { GoogleGenAI } from "@google/genai";

export async function generateStylePreview(prompt: string, base64Image?: string): Promise<string | null> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;

  const ai = new GoogleGenAI({ apiKey });
  const modelName = 'gemini-2.5-flash-image';

  try {
    const parts: any[] = [{ text: `A professional visualization of a person with the following hairstyle: ${prompt}. The result should look like a high-quality fashion photography portrait.` }];
    
    if (base64Image) {
      parts.push({
        inlineData: {
          data: base64Image.split(',')[1] || base64Image,
          mimeType: 'image/jpeg'
        }
      });
      parts[0].text = `Visualize the following hairstyle on this person: ${prompt}. Maintain the unique facial features but realistically change the hair.`;
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    return null;
  } catch (error) {
    return null;
  }
}
