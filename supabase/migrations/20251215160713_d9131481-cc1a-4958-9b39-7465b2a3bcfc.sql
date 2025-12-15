-- Fix 1: Profiles - require authentication to view
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Authenticated users can view profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- Fix 2: Problems - create public view without solutions and restrict main table
CREATE OR REPLACE VIEW public.problems_public AS
SELECT 
  id,
  topic_id,
  title,
  slug,
  difficulty,
  description,
  constraints,
  input_format,
  expected_output,
  starter_code,
  acceptance_rate,
  order_index,
  created_at,
  updated_at
FROM public.problems;

-- Grant access to the view for both anonymous and authenticated users
GRANT SELECT ON public.problems_public TO anon, authenticated;

-- Update problems table policy to only allow authenticated users
DROP POLICY IF EXISTS "Problems are viewable by everyone" ON public.problems;

CREATE POLICY "Authenticated users can view problems"
  ON public.problems FOR SELECT
  TO authenticated
  USING (true);