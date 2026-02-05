export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: 'user' | 'admin';
          subscription_tier: 'free' | 'pro' | 'team';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'user' | 'admin';
          subscription_tier?: 'free' | 'pro' | 'team';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'user' | 'admin';
          subscription_tier?: 'free' | 'pro' | 'team';
          created_at?: string;
          updated_at?: string;
        };
      };
      sessions: {
        Row: {
          id: string;
          user_id: string;
          topic: string;
          duration_seconds: number;
          messages_count: number;
          corrections_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          topic: string;
          duration_seconds?: number;
          messages_count?: number;
          corrections_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          topic?: string;
          duration_seconds?: number;
          messages_count?: number;
          corrections_count?: number;
          created_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          session_id: string;
          role: 'user' | 'assistant';
          content: string;
          audio_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          role: 'user' | 'assistant';
          content: string;
          audio_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          role?: 'user' | 'assistant';
          content?: string;
          audio_url?: string | null;
          created_at?: string;
        };
      };
      corrections: {
        Row: {
          id: string;
          session_id: string;
          message_id: string;
          original_text: string;
          corrected_text: string;
          explanation: string;
          correction_type: 'grammar' | 'vocabulary' | 'pronunciation';
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          message_id: string;
          original_text: string;
          corrected_text: string;
          explanation: string;
          correction_type: 'grammar' | 'vocabulary' | 'pronunciation';
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          message_id?: string;
          original_text?: string;
          corrected_text?: string;
          explanation?: string;
          correction_type?: 'grammar' | 'vocabulary' | 'pronunciation';
          created_at?: string;
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
