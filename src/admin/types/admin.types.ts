export interface FieldConfig {
  key: string;
  label: string;
  type:
    | "text"
    | "textarea"
    | "image"
    | "date"
    | "number"
    | "select"
    | "rich-text"
    | "boolean";
  required?: boolean;
  options?: { label: string; value: string }[]; // For select inputs
  placeholder?: string;
}

export interface AdminEntityConfig {
  name: string;
  slug: string; // URL slug, e.g., 'events'
  apiPath: string; // API endpoint, e.g., '/events'
  fields: FieldConfig[];
  listFields: string[]; // Keys to show in the table
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "moderator" | "user";
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: AdminUser;
}
