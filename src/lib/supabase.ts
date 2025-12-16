import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Program {
  id: string;
  name: string;
  description: string;
  duration_weeks: number;
  price: number;
  features: string[];
  image_url: string;
  category: string;
  is_active: boolean;
  created_at: string;
}

export interface Workout {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration_minutes: number;
  exercises: Array<{
    name: string;
    sets: number;
    reps?: number;
    duration?: string;
  }>;
  target_muscles: string[];
  equipment_needed: string[];
  image_url: string;
  created_at: string;
}

export interface DietPlan {
  id: string;
  name: string;
  description: string;
  goal: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'general_health';
  calories_per_day: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  meal_plan: Array<{
    meal: string;
    foods: string[];
  }>;
  restrictions: string[];
  created_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  transformation_title: string;
  story: string;
  before_image_url: string;
  after_image_url: string;
  weight_lost_kg: number;
  duration_weeks: number;
  program_id?: string;
  is_featured: boolean;
  created_at: string;
}

export interface ContactSubmission {
  name: string;
  email: string;
  phone?: string;
  message: string;
  preferred_program?: string;
}
