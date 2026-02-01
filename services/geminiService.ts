
import { GoogleGenAI, Type } from "@google/genai";
import { Question, HintDifficulty } from "../types";

// 저장된 API Key를 가져오는 헬퍼 함수
const getEffectiveApiKey = (): string => {
  try {
    const saved = localStorage.getItem('user_gemini_api_key');
    if (saved) {
      return atob(saved); // 저장 시 btoa로 인코딩된 값을 디코딩
    }
  } catch (e) {
    console.error("Failed to decode saved API key", e);
  }
  return process.env.API_KEY || '';
};

// API Key 유효성 테스트 함수
export const testApiKey = async (tempKey: string): Promise<boolean> => {
  try {
    const testAi = new GoogleGenAI({ apiKey: tempKey });
    const response = await testAi.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Hi, simple test. respond with only 'OK'.",
    });
    return response.text?.includes('OK') || false;
  } catch (error) {
    console.error("API Key Test Failed:", error);
    return false;
  }
};

export const fetchQuestions = async (
  category: string, 
  count: number, 
  difficulty: HintDifficulty
): Promise<Question[]> => {
  const apiKey = getEffectiveApiKey();
  if (!apiKey) {
    throw new Error("API_KEY_MISSING");
  }

  const ai = new GoogleGenAI({ apiKey });

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

    if (!response.text) {
      throw new Error("No content received from Gemini");
    }

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};
