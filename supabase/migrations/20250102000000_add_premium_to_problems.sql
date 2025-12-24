-- Add is_premium column to problems table
ALTER TABLE "public"."problems" 
ADD COLUMN IF NOT EXISTS "is_premium" boolean DEFAULT false;

-- Optional: Set 'Hard' problems to premium by default for initial setup
UPDATE "public"."problems" 
SET "is_premium" = true 
WHERE "difficulty" = 'hard';
