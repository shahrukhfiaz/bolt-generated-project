export interface Database {
  public: {
    Tables: {
      popular_websites: {
        Row: {
          id: string;
          url: string;
          name: string | null;
          position: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          url: string;
          name?: string | null;
          position?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          url?: string;
          name?: string | null;
          position?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      // ... existing table definitions
    };
    // ... rest of the schema
  };
}
