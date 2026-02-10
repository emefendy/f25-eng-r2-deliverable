"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Database } from "@/lib/schema";
import Image from "next/image";

type Species = Database["public"]["Tables"]["species"]["Row"];

export default function SpeciesDetailsDialog({ species }: { species: Species }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-3 w-full">Learn More</Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{species.scientific_name}</DialogTitle>
        </DialogHeader>
        <div className="grid w-full gap-4">
          {species.image && (
            <div className="relative h-64 w-full">
              <Image
                src={species.image}
                alt={species.scientific_name}
                fill
                style={{ objectFit: "cover" }}
                className="rounded"
              />
            </div>
          )}

          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground">Scientific Name</h3>
              <p className="text-lg">{species.scientific_name}</p>
            </div>

            {species.common_name && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground">Common Name</h3>
                <p className="text-lg">{species.common_name}</p>
              </div>
            )}

            <div>
              <h3 className="text-sm font-semibold text-muted-foreground">Kingdom</h3>
              <p className="text-lg">{species.kingdom}</p>
            </div>

            {species.total_population !== null && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground">Total Population</h3>
                <p className="text-lg">{species.total_population.toLocaleString()}</p>
              </div>
            )}

            {species.description && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground">Description</h3>
                <p className="text-base leading-relaxed">{species.description}</p>
              </div>
            )}
          </div>

          <DialogClose asChild>
            <Button type="button" variant="secondary" className="w-full">
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
