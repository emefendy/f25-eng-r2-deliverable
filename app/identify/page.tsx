"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useState } from "react";

interface IdentificationResult {
  scientificName: string;
  commonName: string;
  confidence: number;
  taxonomy?: {
    kingdom?: string;
    phylum?: string;
    class?: string;
    order?: string;
    family?: string;
  };
  wikipediaUrl?: string;
  imageUrl?: string;
  description?: string;
}

export default function IdentifyPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<IdentificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be smaller than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const identifyAnimal = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/identify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: selectedImage,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to identify animal");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError("Failed to identify animal. Please try again.");
      console.error("Error identifying animal:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl py-10">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-4xl font-bold">Animal Identifier 🔍</h1>
        <p className="text-muted-foreground">Upload an image of an animal and we'll identify it for you!</p>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors hover:border-primary">
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
              <label htmlFor="image-upload" className="flex cursor-pointer flex-col items-center">
                <svg
                  className="mb-2 h-12 w-12 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <span className="text-sm text-muted-foreground">Click to upload an image</span>
                <span className="mt-1 text-xs text-muted-foreground">PNG, JPG up to 5MB</span>
              </label>
            </div>

            {selectedImage && (
              <div className="space-y-4">
                <div className="relative h-64 w-full overflow-hidden rounded-lg">
                  <Image src={selectedImage} alt="Selected animal" fill className="object-contain" />
                </div>
                <Button onClick={identifyAnimal} disabled={isLoading} className="w-full" size="lg">
                  {isLoading ? "Identifying..." : "Identify Animal 🔍"}
                </Button>
              </div>
            )}

            {error && <div className="rounded-lg bg-destructive/10 px-4 py-3 text-destructive">{error}</div>}
          </div>
        </Card>

        {/* Results Section */}
        {result && (
          <Card className="p-6">
            <h2 className="mb-4 text-2xl font-bold">Identification Results</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold">{result.commonName}</h3>
                <p className="italic text-muted-foreground">{result.scientificName}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Confidence: {(result.confidence * 100).toFixed(1)}%
                </p>
              </div>

              {result.taxonomy && (
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {result.taxonomy.kingdom && (
                    <div>
                      <span className="font-semibold">Kingdom:</span> {result.taxonomy.kingdom}
                    </div>
                  )}
                  {result.taxonomy.phylum && (
                    <div>
                      <span className="font-semibold">Phylum:</span> {result.taxonomy.phylum}
                    </div>
                  )}
                  {result.taxonomy.class && (
                    <div>
                      <span className="font-semibold">Class:</span> {result.taxonomy.class}
                    </div>
                  )}
                  {result.taxonomy.order && (
                    <div>
                      <span className="font-semibold">Order:</span> {result.taxonomy.order}
                    </div>
                  )}
                  {result.taxonomy.family && (
                    <div>
                      <span className="font-semibold">Family:</span> {result.taxonomy.family}
                    </div>
                  )}
                </div>
              )}

              {result.description && (
                <div>
                  <h4 className="mb-1 font-semibold">Description:</h4>
                  <p className="text-sm">{result.description}</p>
                </div>
              )}

              {result.wikipediaUrl && (
                <Button asChild variant="outline" className="w-full">
                  <a href={result.wikipediaUrl} target="_blank" rel="noopener noreferrer">
                    Learn More on Wikipedia →
                  </a>
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
