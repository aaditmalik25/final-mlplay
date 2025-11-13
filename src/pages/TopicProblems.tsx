import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, Circle, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: "easy" | "medium" | "hard";
  description: string;
  acceptance_rate: number;
}

interface Topic {
  name: string;
  description: string;
}

const TopicProblems = () => {
  const { slug } = useParams();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTopicAndProblems();
  }, [slug]);

  const fetchTopicAndProblems = async () => {
    try {
      // Fetch topic
      const { data: topicData, error: topicError } = await supabase
        .from('topics')
        .select('name, description')
        .eq('slug', slug)
        .single();

      if (topicError) throw topicError;
      setTopic(topicData);

      // Fetch problems for this topic
      const { data: problemsData, error: problemsError } = await supabase
        .from('problems')
        .select(`
          id,
          title,
          slug,
          difficulty,
          description,
          acceptance_rate,
          topic_id
        `)
        .eq('topic_id', (await supabase.from('topics').select('id').eq('slug', slug).single()).data?.id)
        .order('order_index');

      if (problemsError) throw problemsError;
      setProblems((problemsData || []) as Problem[]);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error loading problems",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-easy";
      case "medium": return "text-medium";
      case "hard": return "text-hard";
      default: return "";
    }
  };

  const getDifficultyBg = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-easy/10 text-easy border-easy/20";
      case "medium": return "bg-medium/10 text-medium border-medium/20";
      case "hard": return "bg-hard/10 text-hard border-hard/20";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/topics">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Topics
          </Link>
        </Button>

        {topic && (
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{topic.name}</h1>
            <p className="text-muted-foreground">{topic.description}</p>
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-4 animate-pulse">
                <div className="h-6 bg-muted rounded w-3/4"></div>
              </Card>
            ))}
          </div>
        ) : problems.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No problems available yet for this topic.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {problems.map((problem) => (
              <Card key={problem.id} className="p-4 hover:shadow-[var(--shadow-primary)] transition-shadow">
                <Link to={`/problem/${problem.slug}`}>
                  <div className="flex items-center gap-4">
                    <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-1">{problem.title}</h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className={getDifficultyBg(problem.difficulty)}>
                          {problem.difficulty}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {problem.acceptance_rate}% acceptance
                        </span>
                      </div>
                    </div>

                    <Button className="flex-shrink-0">
                      Solve
                    </Button>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicProblems;