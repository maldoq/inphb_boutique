export const APPLICATION_STATUSES = [
  "received",
  "reviewing",
  "shortlisted",
  "accepted",
  "rejected",
] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export type NewApplicationRow = {
  full_name: string;
  whatsapp: string;
  email: string;
  school: string;
  education_level: string;
  specialty: string;
  years_experience: number;
  design_level: "Intermediate" | "Advanced" | "Expert";
  experience_areas: string[];
  software_skills: string[];
  main_software: string;
  has_physical_product_experience: boolean;
  product_types: string[];
  has_professional_mockups: boolean;
  portfolio_url: string | null;
  portfolio_file_path: string | null;
  commitment: boolean;
  candidate_score: number;
};

export type ApplicationRow = NewApplicationRow & {
  id: string;
  status: ApplicationStatus;
  submitted_at: string;
  updated_at: string;
};

export type ListParams = {
  page?: number;
  pageSize?: number;
  status?: ApplicationStatus;
  minScore?: number;
  sort?: "score" | "date";
};
export type Page<T> = { rows: T[]; total: number; page: number; pageSize: number };
