// app/api/translate/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text, targetLanguage } = await req.json();

    // Call your local backend translation server
    const response = await fetch('http://127.0.0.1:5000/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, target: targetLanguage })
    });

    const data = await response.json();

    return NextResponse.json({ translatedText: data.translatedText });
  } catch (error: any) {
    console.error(error.message);
    // Fallback: return the original text if translation fails
    return NextResponse.json({ translatedText: error.message ? error.message : 'Translation failed' }, { status: 500 });
  }
}
