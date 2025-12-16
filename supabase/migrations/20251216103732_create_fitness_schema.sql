/*
  # Fitness Training Platform Database Schema

  ## Overview
  This migration creates the complete database schema for an online fitness training platform,
  including programs, workouts, diet plans, testimonials, and contact submissions.

  ## New Tables

  ### 1. `programs`
  Stores fitness programs offered (e.g., Weight Loss, Muscle Building, Body Transformation)
  - `id` (uuid, primary key) - Unique program identifier
  - `name` (text) - Program name
  - `description` (text) - Detailed program description
  - `duration_weeks` (integer) - Program duration in weeks
  - `price` (numeric) - Program price
  - `features` (jsonb) - List of program features
  - `image_url` (text) - Program image URL
  - `category` (text) - Program category (weight_loss, muscle_gain, transformation, etc.)
  - `is_active` (boolean) - Whether program is currently offered
  - `created_at` (timestamptz) - Creation timestamp

  ### 2. `workouts`
  Stores individual workout plans and exercises
  - `id` (uuid, primary key) - Unique workout identifier
  - `name` (text) - Workout name
  - `description` (text) - Workout description
  - `difficulty` (text) - Difficulty level (beginner, intermediate, advanced)
  - `duration_minutes` (integer) - Workout duration
  - `exercises` (jsonb) - List of exercises with sets, reps, etc.
  - `target_muscles` (text[]) - Array of target muscle groups
  - `equipment_needed` (text[]) - Required equipment
  - `image_url` (text) - Workout image URL
  - `created_at` (timestamptz) - Creation timestamp

  ### 3. `diet_plans`
  Stores nutrition and diet plans
  - `id` (uuid, primary key) - Unique diet plan identifier
  - `name` (text) - Diet plan name
  - `description` (text) - Diet plan description
  - `goal` (text) - Diet goal (weight_loss, muscle_gain, maintenance)
  - `calories_per_day` (integer) - Daily calorie target
  - `macros` (jsonb) - Macronutrient breakdown (protein, carbs, fats)
  - `meal_plan` (jsonb) - Sample meal plan with meals and recipes
  - `restrictions` (text[]) - Dietary restrictions (vegetarian, vegan, etc.)
  - `created_at` (timestamptz) - Creation timestamp

  ### 4. `testimonials`
  Stores client success stories and testimonials
  - `id` (uuid, primary key) - Unique testimonial identifier
  - `client_name` (text) - Client name
  - `transformation_title` (text) - Transformation headline
  - `story` (text) - Full success story
  - `before_image_url` (text) - Before photo URL
  - `after_image_url` (text) - After photo URL
  - `weight_lost_kg` (numeric) - Weight lost in kilograms
  - `duration_weeks` (integer) - Transformation duration
  - `program_id` (uuid) - Associated program (foreign key)
  - `is_featured` (boolean) - Whether to feature on homepage
  - `created_at` (timestamptz) - Creation timestamp

  ### 5. `contact_submissions`
  Stores contact form submissions from potential clients
  - `id` (uuid, primary key) - Unique submission identifier
  - `name` (text) - Submitter name
  - `email` (text) - Submitter email
  - `phone` (text) - Phone number (optional)
  - `message` (text) - Message content
  - `preferred_program` (text) - Interested program
  - `status` (text) - Submission status (new, contacted, converted)
  - `created_at` (timestamptz) - Submission timestamp

  ## Security
  - Row Level Security (RLS) is enabled on all tables
  - Public read access for programs, workouts, diet_plans, and testimonials (public content)
  - Contact submissions are write-only for public (insert only, no read access)
  - Administrative access would require authentication (to be added later if needed)

  ## Notes
  - All tables use UUID primary keys with automatic generation
  - Timestamps use `timestamptz` for proper timezone handling
  - JSONB is used for flexible structured data (features, exercises, meal plans)
  - Boolean fields have sensible defaults
  - All tables are created with `IF NOT EXISTS` for safe reapplication
*/

-- Create programs table
CREATE TABLE IF NOT EXISTS programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  duration_weeks integer NOT NULL,
  price numeric(10, 2) NOT NULL,
  features jsonb DEFAULT '[]'::jsonb,
  image_url text,
  category text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create workouts table
CREATE TABLE IF NOT EXISTS workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  duration_minutes integer NOT NULL,
  exercises jsonb DEFAULT '[]'::jsonb,
  target_muscles text[] DEFAULT ARRAY[]::text[],
  equipment_needed text[] DEFAULT ARRAY[]::text[],
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Create diet_plans table
CREATE TABLE IF NOT EXISTS diet_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  goal text NOT NULL CHECK (goal IN ('weight_loss', 'muscle_gain', 'maintenance', 'general_health')),
  calories_per_day integer NOT NULL,
  macros jsonb DEFAULT '{}'::jsonb,
  meal_plan jsonb DEFAULT '[]'::jsonb,
  restrictions text[] DEFAULT ARRAY[]::text[],
  created_at timestamptz DEFAULT now()
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  transformation_title text NOT NULL,
  story text NOT NULL,
  before_image_url text,
  after_image_url text,
  weight_lost_kg numeric(5, 1),
  duration_weeks integer,
  program_id uuid REFERENCES programs(id) ON DELETE SET NULL,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  preferred_program text,
  status text DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted')),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE diet_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access to content tables
CREATE POLICY "Public can view active programs"
  ON programs FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Public can view all workouts"
  ON workouts FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can view all diet plans"
  ON diet_plans FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can view featured testimonials"
  ON testimonials FOR SELECT
  TO public
  USING (is_featured = true);

-- RLS Policy for contact submissions (insert only for public)
CREATE POLICY "Public can submit contact forms"
  ON contact_submissions FOR INSERT
  TO public
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_programs_category ON programs(category);
CREATE INDEX IF NOT EXISTS idx_programs_is_active ON programs(is_active);
CREATE INDEX IF NOT EXISTS idx_workouts_difficulty ON workouts(difficulty);
CREATE INDEX IF NOT EXISTS idx_diet_plans_goal ON diet_plans(goal);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(is_featured);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
