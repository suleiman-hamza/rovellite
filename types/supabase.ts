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

// export interface VirtualAccount {
//   id: string
//   user_id: string
//   provider: string
//   virtual_account_no: string
//   virtual_account_name: string
//   status: string
//   app_id: string
//   raw_response: string
//   created_at: string
// }

// export interface PalmpayResponse {
//   appId: string;
//   email: string;
//   status: string;
//   customerName: string;
//   identityType: string;
//   licenseNumber: string;
//   accountReference: string | null;
// }
// Type for inserting a new profile (omit auto-generated fields)
export type ProfileInsert = Omit<Profile, 'created_at' | 'updated_at'> & {
  // Make email required for insert
  email: string
}

// Type for updating an existing profile
export type ProfileUpdate = Partial<ProfileInsert>
