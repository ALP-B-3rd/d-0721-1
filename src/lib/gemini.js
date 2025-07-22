const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function getGeminiContent(userText) {
  const res = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: userText }
          ]
        }
      ]
    })
  });

  if (!res.ok) {
    throw new Error("Gemini API 호출 실패");
  }

  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
} 