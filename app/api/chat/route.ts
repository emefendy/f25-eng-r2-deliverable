import { generateResponse } from "@/lib/services/species-chat";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();

    // Validate input
    if (!body || typeof body.message !== "string" || !body.message.trim()) {
      return NextResponse.json({ error: "Invalid or missing message in request body" }, { status: 400 });
    }

    const message = body.message.trim();

    // Generate response using the species chat service
    const response = await generateResponse(message);

    return NextResponse.json({ response }, { status: 200 });
  } catch (error) {
    console.error("Error in chat API route:", error);

    // Check if it's an upstream/provider issue
    if (error instanceof Error && error.message.includes("API")) {
      return NextResponse.json({ error: "Upstream service error. Please try again later." }, { status: 502 });
    }

    // Generic error
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
