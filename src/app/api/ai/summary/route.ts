import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize the Generative AI client
// It automatically looks for the GEMINI_API_KEY in your .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// POST /api/ai/summary
export async function POST(req: Request) {
  try {
    const { notes } = await req.json();

    if (!notes) {
      return NextResponse.json(
        { error: "Notes are required" },
        { status: 400 }
      );
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro"});

    const prompt = `Summarize these study notes into 2-3 key bullet points:\n\n${notes}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const summary = response.text();

    // Send the summary back to the frontend
    return NextResponse.json({ summary });

  } catch (error) {
    console.error("AI Summary Error:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}