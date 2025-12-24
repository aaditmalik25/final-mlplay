import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useUserXP = () => {
  const [xp, setXp] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchXP();

    // Subscribe to auth changes to reset/fetch XP
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) fetchXP();
      else setXp(0);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchXP = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setXp(0);
      setLoading(false);
      return;
    }

    try {
      // Fetch accepted submissions with problem details
      const { data, error } = await supabase
        .from('submissions')
        .select('problem_id, problem:problems(id, difficulty)')
        .eq('user_id', session.user.id)
        .eq('status', 'accepted');

      if (error) throw error;

      if (data) {
        const uniqueSolved = new Set<string>();
        let totalXP = 0;

        data.forEach((sub: any) => {
          const problemId = sub.problem?.id;
          const difficulty = sub.problem?.difficulty;

          if (problemId && !uniqueSolved.has(problemId)) {
            uniqueSolved.add(problemId);
            
            // XP Values
            if (difficulty === 'easy') totalXP += 10;
            else if (difficulty === 'medium') totalXP += 30;
            else if (difficulty === 'hard') totalXP += 50;
          }
        });

        setXp(totalXP);
      }
    } catch (error) {
      console.error("Error fetching XP:", error);
    } finally {
      setLoading(false);
    }
  };

  return { xp, loading };
};

