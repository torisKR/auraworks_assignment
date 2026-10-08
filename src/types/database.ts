export type Textbook = {
  id: string;
  title: string;
  category: "single" | "pass";
  subject: string;
  description: string;
  image_path: string;
  price: number;
  original_price: number | null;
  discount_percent: number;
  display_order: number;
};

export type Database = {
  public: {
    Tables: {
      textbooks: {
        Row: Textbook;
        Insert: Textbook;
        Update: Partial<Textbook>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
