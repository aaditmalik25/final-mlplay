-- Add is_premium to profiles
ALTER TABLE "public"."profiles" 
ADD COLUMN IF NOT EXISTS "is_premium" boolean DEFAULT false;

-- Create problem_statements table
CREATE TABLE IF NOT EXISTS "public"."problem_statements" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    "problem_id" uuid NOT NULL REFERENCES "public"."problems"("id") ON DELETE CASCADE,
    "description" text,
    "constraints" text,
    "input_format" text,
    "expected_output" text,
    "starter_code" text,
    "solution_code" text,
    "solution_explanation" text,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE "public"."problem_statements" ENABLE ROW LEVEL SECURITY;

-- Create Policy: No public access (Service Role only)
CREATE POLICY "No public access" 
ON "public"."problem_statements" 
FOR ALL 
USING (false);

-- Data Migration: Move data from problems to problem_statements
INSERT INTO "public"."problem_statements" (
    "problem_id", 
    "description", 
    "constraints", 
    "input_format", 
    "expected_output", 
    "starter_code", 
    "solution_code", 
    "solution_explanation"
)
SELECT 
    "id", 
    "description", 
    "constraints", 
    "input_format", 
    "expected_output", 
    "starter_code", 
    "solution_code", 
    "solution_explanation"
FROM "public"."problems";

-- Drop columns from problems table
ALTER TABLE "public"."problems" DROP COLUMN IF EXISTS "description";
ALTER TABLE "public"."problems" DROP COLUMN IF EXISTS "constraints";
ALTER TABLE "public"."problems" DROP COLUMN IF EXISTS "input_format";
ALTER TABLE "public"."problems" DROP COLUMN IF EXISTS "expected_output";
ALTER TABLE "public"."problems" DROP COLUMN IF EXISTS "starter_code";
ALTER TABLE "public"."problems" DROP COLUMN IF EXISTS "solution_code";
ALTER TABLE "public"."problems" DROP COLUMN IF EXISTS "solution_explanation";
