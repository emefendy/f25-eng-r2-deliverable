import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    console.log("Calling Python backend...");

    // Call Python Flask API
    const pythonResponse = await fetch("http://localhost:5000/classify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image }),
    });

    if (!pythonResponse.ok) {
      throw new Error("Python API error");
    }

    const pythonData = await pythonResponse.json();
    const animalName = pythonData.label;

    console.log("Identified as:", animalName);

    // Fetch Wikipedia info
    const wikiResponse = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(animalName)}`,
    );

    let wikiData = null;
    if (wikiResponse.ok) {
      wikiData = await wikiResponse.json();
    }

    const result = {
      scientificName: animalName,
      commonName: wikiData?.title || animalName,
      confidence: pythonData.confidence,
      description: wikiData?.extract || "No description available",
      wikipediaUrl: wikiData?.content_urls?.desktop?.page,
      imageUrl: wikiData?.thumbnail?.source,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in identify API:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to identify animal" },
      { status: 500 },
    );
  }
}
