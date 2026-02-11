import { NextResponse } from "next/server";
import Replicate from "replicate";

export async function POST(request: Request) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    console.log("Calling Replicate API...");

    // Use BLIP-2
    const output = await replicate.run(
      "andreasjansson/blip-2:4b32258c42e9efd4288bb9910bc532a69727f9acd26aa08e175713a0a857a608",
      {
        input: {
          image: image,
          question: "What animal or object is this? Be specific with the scientific name if it's an animal.",
        },
      },
    );

    console.log("Replicate output:", output);

    const identification = typeof output === "string" ? output : String(output);

    // Fetch Wikipedia info
    const wikiResponse = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(identification)}`,
    );

    let wikiData = null;
    if (wikiResponse.ok) {
      wikiData = await wikiResponse.json();
    }

    const result = {
      scientificName: identification,
      commonName: wikiData?.title || identification,
      confidence: 0.9,
      description: wikiData?.extract || "No description available",
      wikipediaUrl: wikiData?.content_urls?.desktop?.page,
      imageUrl: wikiData?.thumbnail?.source,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in identify API:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to identify" }, { status: 500 });
  }
}
