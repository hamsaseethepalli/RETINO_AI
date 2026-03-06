import { DRGrade, Language } from "../types";

const GATEWAY_URL = process.env.VITE_API_GATEWAY_URL || "";

export const getMedicalExplanation = async (grade: DRGrade) => {
  const GATEWAY_URL = process.env.VITE_API_GATEWAY_URL || "";
  if (!GATEWAY_URL) throw new Error("Gateway URL missing");

  // Notice we only send the grade now, not the language!
  const response = await fetch(`${GATEWAY_URL}/explain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ grade }) 
  });

  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.error || "Backend Error");
  }
  return await response.json();
};
export const speakText = async (text: string, language: string) => {
  // 🚨 EMERGENCY: Hardcode the URL here if process.env is failing
  const API_URL = "https://hennhp58mb.execute-api.ap-south-1.amazonaws.com"; 

  try {
    const response = await fetch(`${API_URL}/speak`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, language }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "Backend Error");
    }

    const data = await response.json();
    if (data.audio) {
      // Direct play from Base64 string
      const audio = new Audio(`data:audio/mp3;base64,${data.audio}`);
      return await audio.play();
    }
  } catch (error) {
    console.error("Audio Critical Error:", error);
    throw error;
  }
};