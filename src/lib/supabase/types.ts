// Hand-written types mirroring supabase/migrations/0001_init.sql.
// If the schema changes, update this file alongside the migration.
// (A later phase can replace this with `supabase gen types typescript`.)

export type AssignmentStatus = "todo" | "in_progress" | "done";
export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";
export type LearnStatus = "someday" | "in_progress" | "done";

export interface Database {
  public: {
    Tables: {
      meals: {
        Row: {
          id: string;
          user_id: string;
          description: string;
          calories: number | null;
          protein: number | null;
          carbs: number | null;
          fat: number | null;
          macros_estimated: boolean;
          eaten_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          description: string;
          calories?: number | null;
          protein?: number | null;
          carbs?: number | null;
          fat?: number | null;
          macros_estimated?: boolean;
          eaten_at?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["meals"]["Insert"]>;
        Relationships: [];
      };
      workouts: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          title: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date?: string;
          title: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["workouts"]["Insert"]>;
        Relationships: [];
      };
      workout_sets: {
        Row: {
          id: string;
          user_id: string;
          workout_id: string;
          exercise: string;
          reps: number | null;
          weight: number | null;
          set_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          workout_id: string;
          exercise: string;
          reps?: number | null;
          weight?: number | null;
          set_order?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["workout_sets"]["Insert"]>;
        Relationships: [];
      };
      courses: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          code: string | null;
          semester: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          code?: string | null;
          semester?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["courses"]["Insert"]>;
        Relationships: [];
      };
      assignments: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          title: string;
          due_at: string | null;
          status: AssignmentStatus;
          notes: string | null;
          google_event_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          title: string;
          due_at?: string | null;
          status?: AssignmentStatus;
          notes?: string | null;
          google_event_id?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["assignments"]["Insert"]>;
        Relationships: [];
      };
      tasks: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          due_at: string | null;
          priority: TaskPriority;
          status: TaskStatus;
          recurring: string | null;
          notes: string | null;
          google_event_id: string | null;
          google_task_id: string | null;
          archived_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          due_at?: string | null;
          priority?: TaskPriority;
          status?: TaskStatus;
          recurring?: string | null;
          notes?: string | null;
          google_event_id?: string | null;
          google_task_id?: string | null;
          archived_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["tasks"]["Insert"]>;
        Relationships: [];
      };
      learn_items: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          status: LearnStatus;
          resource_url: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          status?: LearnStatus;
          resource_url?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["learn_items"]["Insert"]>;
        Relationships: [];
      };
      google_calendar_connections: {
        Row: {
          id: string;
          user_id: string;
          access_token: string;
          refresh_token: string;
          token_expires_at: string;
          calendar_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          access_token: string;
          refresh_token: string;
          token_expires_at: string;
          calendar_id?: string;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["google_calendar_connections"]["Insert"]
        >;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
