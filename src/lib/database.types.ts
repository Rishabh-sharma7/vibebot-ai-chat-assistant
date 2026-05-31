export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      chat_sessions: {
        Row: {
          id: string
          user_id: string | null
          title: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          title?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      messages: {
        Row: {
          id: string
          session_id: string
          role: string
          content: string
          created_at: string | null
        }
        Insert: {
          id?: string
          session_id: string
          role: string
          content: string
          created_at?: string | null
        }
        Update: {
          id?: string
          session_id?: string
          role?: string
          content?: string
          created_at?: string | null
        }
      }
      uploaded_files: {
        Row: {
          id: string
          session_id: string
          filename: string
          file_type: string
          file_path: string
          extracted_text: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          session_id: string
          filename: string
          file_type: string
          file_path: string
          extracted_text?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          session_id?: string
          filename?: string
          file_type?: string
          file_path?: string
          extracted_text?: string | null
          created_at?: string | null
        }
      }
    }
  }
}
