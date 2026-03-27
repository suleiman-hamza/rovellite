export interface Profile {
  user_id: string // uuid
  email: string
  full_name?: string
  avatar_url?: string
  created_at?: string // timestamp with time zone
  updated_at?: string // timestamp with time zone
  phone?: string
  bio?: string
  location?: string
  role?: UserRole // Assuming you have a UserRole enum/type
}

// Strict enum for user roles
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

// Type for inserting a new profile (omit auto-generated fields)
export type ProfileInsert = Omit<Profile, 'created_at' | 'updated_at'> & {
  // Make email required for insert
  email: string
}

// Type for updating an existing profile
export type ProfileUpdate = Partial<ProfileInsert>
