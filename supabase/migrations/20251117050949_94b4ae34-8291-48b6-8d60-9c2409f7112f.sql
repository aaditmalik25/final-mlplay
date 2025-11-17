-- Create a function to get leaderboard data
CREATE OR REPLACE FUNCTION public.get_leaderboard()
RETURNS TABLE (
  user_id uuid,
  full_name text,
  username text,
  avatar_url text,
  solved_count bigint,
  total_score bigint,
  rank bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH user_stats AS (
    SELECT 
      s.user_id,
      COUNT(DISTINCT s.problem_id) FILTER (WHERE s.status = 'accepted') as solved_count,
      COUNT(DISTINCT s.problem_id) FILTER (WHERE s.status = 'accepted') * 100 as total_score
    FROM submissions s
    GROUP BY s.user_id
  )
  SELECT 
    p.user_id,
    p.full_name,
    p.username,
    p.avatar_url,
    COALESCE(us.solved_count, 0) as solved_count,
    COALESCE(us.total_score, 0) as total_score,
    ROW_NUMBER() OVER (ORDER BY COALESCE(us.total_score, 0) DESC, COALESCE(us.solved_count, 0) DESC) as rank
  FROM profiles p
  LEFT JOIN user_stats us ON p.user_id = us.user_id
  WHERE us.solved_count > 0
  ORDER BY total_score DESC, solved_count DESC
  LIMIT 100;
$$;

-- Create a function to get user dashboard statistics
CREATE OR REPLACE FUNCTION public.get_user_dashboard_stats(p_user_id uuid)
RETURNS TABLE (
  total_problems bigint,
  solved_problems bigint,
  acceptance_rate numeric,
  total_submissions bigint,
  recent_submissions jsonb
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    (SELECT COUNT(*) FROM problems)::bigint as total_problems,
    (SELECT COUNT(DISTINCT problem_id) FROM submissions WHERE user_id = p_user_id AND status = 'accepted')::bigint as solved_problems,
    (SELECT CASE 
      WHEN COUNT(*) = 0 THEN 0 
      ELSE ROUND((COUNT(*) FILTER (WHERE status = 'accepted')::numeric / COUNT(*)::numeric) * 100, 2)
    END FROM submissions WHERE user_id = p_user_id)::numeric as acceptance_rate,
    (SELECT COUNT(*) FROM submissions WHERE user_id = p_user_id)::bigint as total_submissions,
    (SELECT jsonb_agg(row_to_json(recent_subs)) 
     FROM (
       SELECT 
         s.id,
         s.problem_id,
         p.title as problem_title,
         s.status,
         s.created_at,
         s.execution_time
       FROM submissions s
       JOIN problems p ON s.problem_id = p.id
       WHERE s.user_id = p_user_id
       ORDER BY s.created_at DESC
       LIMIT 10
     ) recent_subs) as recent_submissions;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_leaderboard() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_dashboard_stats(uuid) TO authenticated;