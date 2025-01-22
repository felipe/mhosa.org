export type Database = {
  public: {
    Tables: {
      divisions: {
        Row: {
          created_at: string
          description: string | null
          id: number
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string
          slug?: string
        }
        Relationships: []
      }
      drivers: {
        Row: {
          bio: string | null
          color: string | null
          created_at: string
          id: number
          image_url: string | null
          joined_year: number | null
          name: string
          nickname: string | null
          wins: number
        }
        Insert: {
          bio?: string | null
          color?: string | null
          created_at?: string
          id?: number
          image_url?: string | null
          joined_year?: number | null
          name: string
          nickname?: string | null
          wins?: number
        }
        Update: {
          bio?: string | null
          color?: string | null
          created_at?: string
          id?: number
          image_url?: string | null
          joined_year?: number | null
          name?: string
          nickname?: string | null
          wins?: number
        }
        Relationships: []
      }
      "keep-alive": {
        Row: {
          id: number
          name: string | null
          random: string | null
        }
        Insert: {
          id?: number
          name?: string | null
          random?: string | null
        }
        Update: {
          id?: number
          name?: string | null
          random?: string | null
        }
        Relationships: []
      }
      race_results: {
        Row: {
          created_at: string
          driver_id: number
          id: number
          position: number
          race_id: number
          time: string
        }
        Insert: {
          created_at?: string
          driver_id: number
          id?: number
          position: number
          race_id: number
          time: string
        }
        Update: {
          created_at?: string
          driver_id?: number
          id?: number
          position?: number
          race_id?: number
          time?: string
        }
        Relationships: [
          {
            foreignKeyName: "race_results_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "race_results_schedule_id_fkey"
            columns: ["race_id"]
            isOneToOne: false
            referencedRelation: "races"
            referencedColumns: ["id"]
          },
        ]
      }
      race_splits: {
        Row: {
          blue_hl: number | null
          blue_laps: number | null
          created_at: string
          division_id: number
          driver_id: number
          final_sections: number | null
          green_hl: number | null
          green_laps: number | null
          heat: number | null
          id: number
          not_for_points: boolean
          orange_hl: number | null
          orange_laps: number | null
          purple_hl: number | null
          purple_laps: number | null
          race_id: number
          red_hl: number | null
          red_laps: number | null
          total_laps: number | null
          white_hl: number | null
          white_laps: number | null
          yellow_hl: number | null
          yellow_laps: number | null
        }
        Insert: {
          blue_hl?: number | null
          blue_laps?: number | null
          created_at?: string
          division_id: number
          driver_id: number
          final_sections?: number | null
          green_hl?: number | null
          green_laps?: number | null
          heat?: number | null
          id?: number
          not_for_points?: boolean
          orange_hl?: number | null
          orange_laps?: number | null
          purple_hl?: number | null
          purple_laps?: number | null
          race_id: number
          red_hl?: number | null
          red_laps?: number | null
          total_laps?: number | null
          white_hl?: number | null
          white_laps?: number | null
          yellow_hl?: number | null
          yellow_laps?: number | null
        }
        Update: {
          blue_hl?: number | null
          blue_laps?: number | null
          created_at?: string
          division_id?: number
          driver_id?: number
          final_sections?: number | null
          green_hl?: number | null
          green_laps?: number | null
          heat?: number | null
          id?: number
          not_for_points?: boolean
          orange_hl?: number | null
          orange_laps?: number | null
          purple_hl?: number | null
          purple_laps?: number | null
          race_id?: number
          red_hl?: number | null
          red_laps?: number | null
          total_laps?: number | null
          white_hl?: number | null
          white_laps?: number | null
          yellow_hl?: number | null
          yellow_laps?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "race_splits_division_id_fkey"
            columns: ["division_id"]
            isOneToOne: false
            referencedRelation: "divisions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "race_splits_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "race_splits_schedule_id_fkey"
            columns: ["race_id"]
            isOneToOne: false
            referencedRelation: "races"
            referencedColumns: ["id"]
          },
        ]
      }
      races: {
        Row: {
          category: string | null
          created_at: string
          date: string
          description: string | null
          id: number
          name: string
          season_id: number
          status: string
          time: string | null
          track_id: number
        }
        Insert: {
          category?: string | null
          created_at?: string
          date: string
          description?: string | null
          id?: number
          name: string
          season_id: number
          status?: string
          time?: string | null
          track_id: number
        }
        Update: {
          category?: string | null
          created_at?: string
          date?: string
          description?: string | null
          id?: number
          name?: string
          season_id?: number
          status?: string
          time?: string | null
          track_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "schedules_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedules_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      seasons: {
        Row: {
          created_at: string
          end: string
          id: number
          name: string
          slug: string
          start: string
        }
        Insert: {
          created_at?: string
          end: string
          id?: number
          name: string
          slug: string
          start: string
        }
        Update: {
          created_at?: string
          end?: string
          id?: number
          name?: string
          slug?: string
          start?: string
        }
        Relationships: []
      }
      track_records: {
        Row: {
          created_at: string
          date: string
          division_id: number
          driver_id: number
          id: number
          time: string
          track_id: number
        }
        Insert: {
          created_at?: string
          date: string
          division_id: number
          driver_id: number
          id?: number
          time: string
          track_id: number
        }
        Update: {
          created_at?: string
          date?: string
          division_id?: number
          driver_id?: number
          id?: number
          time?: string
          track_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "track_records_division_id_fkey"
            columns: ["division_id"]
            isOneToOne: false
            referencedRelation: "divisions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "track_records_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "track_records_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: true
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      tracks: {
        Row: {
          created_at: string
          description: string
          id: number
          image_url: string
          length: string
          location: string
          name: string
          turns: number
        }
        Insert: {
          created_at?: string
          description: string
          id?: number
          image_url: string
          length: string
          location: string
          name: string
          turns: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          image_url?: string
          length?: string
          location?: string
          name?: string
          turns?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
