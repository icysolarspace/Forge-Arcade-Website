
import { GoogleGenAI } from "@google/genai";

export interface ModerationResult {
  isSafe: boolean;
  reason?: string;
}

const MODERATION_SYSTEM_INSTRUCTION = `
Act as a strict content moderator for a family-friendly game arcade. 
Your task is to evaluate text or code for safety violations.
Violations include:
- Hate speech, discrimination, or offensive stereotypes.
- Graphic violence, gore, or extreme cruelty.
- Explicit sexual content, nudity, or highly suggestive material.
- Harassment, bullying, or threats.
- Promotion of illegal activities or dangerous behaviors.
- Rated-R or adult-only themes.
- Nasty, offensive, or excessively vulgar language.

Respond strictly in the following format:
SAFE - If the content is appropriate for all ages.
UNSAFE: [Specific Reason] - If the content is inappropriate.
`;

export const moderateContent = async (content: string, apiKey: string): Promise<ModerationResult> => {
  if (!apiKey) throw new Error("API Key required for moderation check.");

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Evaluate this content: \n\n ${content}`,
      config: {
        systemInstruction: MODERATION_SYSTEM_INSTRUCTION,
        temperature: 0,
        maxOutputTokens: 100,
      },
    });

    const result = response.text?.trim() || "";
    
    if (result.startsWith("SAFE")) {
      return { isSafe: true };
    } else if (result.startsWith("UNSAFE")) {
      const reason = result.split("UNSAFE:")[1]?.trim() || "Unspecified safety violation.";
      return { isSafe: false, reason };
    }

    return { isSafe: false, reason: "Inconclusive moderation result." };
  } catch (error) {
    console.error("Moderation Error:", error);
    throw error;
  }
};
