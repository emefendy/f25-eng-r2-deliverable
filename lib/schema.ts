export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          biography: string | null;
          email: string | null;
          created_at: string | null;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          biography?: string | null;
          email?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          biography?: string | null;
          email?: string | null;
          created_at?: string | null;
        };
      };
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
          created_at: string | null;
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
          created_at?: string | null;
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
          created_at?: string | null;
        };
      };
      comments: {
        Row: {
          id: number;
          content: string;
          author: string;
          species_id: number;
          created_at: string | null;
        };
        Insert: {
          id?: number;
          content: string;
          author: string;
          species_id: number;
          created_at?: string | null;
        };
        Update: {
          id?: number;
          content?: string;
          author?: string;
          species_id?: number;
          created_at?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
