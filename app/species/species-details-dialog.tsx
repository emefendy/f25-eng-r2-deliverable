"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { createBrowserSupabaseClient } from "@/lib/client-utils";
import type { Database } from "@/lib/schema";
import Image from "next/image";
import { useEffect, useState } from "react";
import CommentsSection from "./comments-section";

type Species = Database["public"]["Tables"]["species"]["Row"];

type Comment = Database["public"]["Tables"]["comments"]["Row"] & {
  profiles: {
    display_name: string | null;
  } | null;
};

export default function SpeciesDetailsDialog({ species, currentUserId }: { species: Species; currentUserId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen]);

  const fetchComments = async () => {
    const { data } = await supabase
      .from("comments")
      .select(
        `
        *,
        profiles (
          display_name
        )
      `,
      )
      .eq("species_id", species.id)
      .order("created_at", { ascending: false });

    if (data) {
      setComments(data as Comment[]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-peach hover:bg-peach/90 mt-3 w-full rounded-full">Learn More ✨</Button>
      </DialogTrigger>
      <DialogContent className="border-softPink/30 max-h-screen overflow-y-auto rounded-3xl border-2 sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="font-handwritten text-brown text-3xl">{species.scientific_name}</DialogTitle>
        </DialogHeader>
        <div className="grid w-full gap-4">
          {species.image && (
            <div className="relative h-64 w-full">
              <Image
                src={species.image}
                alt={species.scientific_name}
                fill
                style={{ objectFit: "cover" }}
                className="border-softPink/20 rounded-2xl border-2"
              />
            </div>
          )}

          <div className="space-y-3">
            <div>
              <h3 className="text-brown/70 text-sm font-semibold">Scientific Name</h3>
              <p className="text-brown text-lg">{species.scientific_name}</p>
            </div>

            {species.common_name && (
              <div>
                <h3 className="text-brown/70 text-sm font-semibold">Common Name</h3>
                <p className="text-brown text-lg">{species.common_name}</p>
              </div>
            )}

            <div>
              <h3 className="text-brown/70 text-sm font-semibold">Kingdom</h3>
              <p className="text-brown text-lg">{species.kingdom}</p>
            </div>

            {species.total_population !== null && (
              <div>
                <h3 className="text-brown/70 text-sm font-semibold">Total Population</h3>
                <p className="text-brown text-lg">{species.total_population.toLocaleString()}</p>
              </div>
            )}

            {species.description && (
              <div>
                <h3 className="text-brown/70 text-sm font-semibold">Description</h3>
                <p className="text-brown text-base leading-relaxed">{species.description}</p>
              </div>
            )}
          </div>

          <CommentsSection speciesId={species.id} currentUserId={currentUserId} initialComments={comments} />

          <DialogClose asChild>
            <Button type="button" variant="secondary" className="w-full rounded-full">
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
