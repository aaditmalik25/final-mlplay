-- Fix security definer view warning by recreating with SECURITY INVOKER
DROP VIEW IF EXISTS public.problems_public;

CREATE VIEW public.problems_public 
WITH (security_invoker = true)
AS
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

-- Re-grant access
GRANT SELECT ON public.problems_public TO anon, authenticated;