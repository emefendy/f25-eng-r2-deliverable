export interface Database {
  public: {
    Tables: {
      species: {
        Row: {
          id: number;
          scientific_name: string;
          common_name: string | null;
          kingdom: "Animalia" | "Plantae" | "Fungi" | "Protista" | "Archaea" | "Bacteria";
          total_population: number | null;
          image: string | null;
          description: string | null;
          author: string;
          created_at?: string;
        };
        Insert: {
          id?: number;
          scientific_name: string;
          common_name?: string | null;
          kingdom: "Animalia" | "Plantae" | "Fungi" | "Protista" | "Archaea" | "Bacteria";
          total_population?: number | null;
          image?: string | null;
          description?: string | null;
          author: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          scientific_name?: string;
          common_name?: string | null;
          kingdom?: "Animalia" | "Plantae" | "Fungi" | "Protista" | "Archaea" | "Bacteria";
          total_population?: number | null;
          image?: string | null;
          description?: string | null;
          author?: string;
          created_at?: string;
        };
      };
    };
  };
}
