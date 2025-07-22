import { NextResponse } from "next/server";
import { getGeminiContent } from "@/lib/gemini";

export async function POST(req) {
  const { text } = await req.json();
  try {
    const aiText = await getGeminiContent(text);
    return NextResponse.json({ result: aiText });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
} 