import OpenAI from "openai";

// Initialize OpenAI client outside the function (only once)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System instruction to limit chatbot to species/animal topics
const SYSTEM_INSTRUCTION = `You are a specialized chatbot that only answers questions about animals and species.

Your expertise includes:
- Animal habitats, diets, and behaviors
- Species conservation status
- Animal characteristics and comparisons
- Wildlife biology and ecology

If a user asks about anything unrelated to animals or species (like programming, math, history, etc.), politely respond that you are specialized for species-related queries only and cannot help with that topic.

Keep your responses concise, informative, and friendly.`;

export async function generateResponse(message: string): Promise<string> {
  console.log("=== DEBUG INFO ===");
  console.log("1. API Key exists:", !!process.env.OPENAI_API_KEY);
  console.log("2. API Key length:", process.env.OPENAI_API_KEY?.length);
  console.log("3. API Key first 10 chars:", process.env.OPENAI_API_KEY?.substring(0, 10));
  console.log("4. Received message:", message);

  try {
    console.log("5. Attempting to call OpenAI API...");

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: SYSTEM_INSTRUCTION },
        { role: "user", content: message },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    console.log("6. API call successful!");

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      console.log("7. No response content received");
      return "I'm sorry, I couldn't generate a response. Please try again.";
    }

    console.log("8. Response received:", response.substring(0, 50) + "...");
    return response;
  } catch (error) {
    console.error("=== ERROR DETAILS ===");
    console.error("Full error:", error);

    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    // Check for specific OpenAI errors with proper typing
    if (error && typeof error === "object" && "status" in error) {
      const apiError = error as { status?: number; error?: unknown };
      console.error("API status code:", apiError.status);
      console.error("API error details:", apiError.error);
    }

    return "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again in a moment.";
  }
}
