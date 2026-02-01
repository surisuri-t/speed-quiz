
import { GoogleGenAI, Type } from "@google/genai";
import { Question, HintDifficulty } from "../types";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchQuestions = async (
  category: string, 
  count: number, 
  difficulty: HintDifficulty
): Promise<Question[]> => {
  const difficultyPrompt = {
    '쉬움': '초등학생도 바로 맞출 수 있을 정도로 아주 쉽고 직관적이며 명확한 힌트를 제공해줘.',
    '보통': '일반적인 상식을 가진 성인이 생각하면 맞출 수 있는 적절한 수준의 힌트를 제공해줘.',
    '어려움': '매우 추상적이거나, 은유적이거나, 연상하기 까다로운 고난도의 힌트를 제공해줘.'
  }[difficulty];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `카테고리: ${category}. 힌트 난이도: ${difficulty}. 
      ${difficultyPrompt}
      이 카테고리에 해당하는 단어와 그에 대한 아주 짧은 힌트 ${count}개를 한국어로 생성해줘. 
      스피드 게임용이므로 힌트는 반드시 한 문장(15자 내외)이어야 함.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              word: { type: Type.STRING, description: "정답 단어" },
              hint: { type: Type.STRING, description: "단어에 대한 힌트" },
            },
            required: ["word", "hint"],
          },
        },
      },
    });

    // The GenerateContentResponse object features a text property (not a method, so do not call text())
    if (!response.text) {
      throw new Error("No content received from Gemini");
    }

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Error fetching questions:", error);
    return Array(count).fill(null).map((_, i) => ({
      word: `오류 ${i + 1}`,
      hint: "데이터를 불러오는 중 오류가 발생했습니다. 다시 시도해 주세요."
    }));
  }
};
