import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code2, Brain, TrendingUp, ArrowRight, Filter, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Difficulty = "easy" | "medium" | "hard";

interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: Difficulty;
  acceptance_rate: number;
}

const Problems = () => {
  const [filter, setFilter] = useState<Difficulty | "all">("all");
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const { data, error } = await supabase
        .from('problems')
        .select('id, title, slug, difficulty, acceptance_rate')
        .order('order_index');

      if (error) throw error;
      setProblems((data || []) as Problem[]);
    } catch (error) {
      console.error('Error fetching problems:', error);
      toast({
        title: "Error loading problems",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProblems = filter === "all" 
    ? problems 
    : problems.filter(p => p.difficulty === filter);

  const getDifficultyBg = (difficulty: Difficulty) => {
    switch (difficulty) {
      case "easy":
        return "bg-easy/10 text-easy border-easy/20";
      case "medium":
        return "bg-medium/10 text-medium border-medium/20";
      case "hard":
        return "bg-hard/10 text-hard border-hard/20";
    }
  };

  const getDifficultyGradient = (difficulty: Difficulty) => {
    switch (difficulty) {
      case "easy":
        return "from-easy/20 to-easy/5";
      case "medium":
        return "from-medium/20 to-medium/5";
      case "hard":
        return "from-hard/20 to-hard/5";
    }
  };

  const stats = {
    total: problems.length,
    easy: problems.filter(p => p.difficulty === "easy").length,
    medium: problems.filter(p => p.difficulty === "medium").length,
    hard: problems.filter(p => p.difficulty === "hard").length,
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <Navigation />
      
      {/* Animated 3D background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-white/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:scale-110 transition-transform duration-300 hover:rotate-3">
                <Code2 className="h-6 w-6 text-white" />
              </div>
              <Badge variant="outline" className="border-white/20 text-white bg-white/5 backdrop-blur-sm">
                <Sparkles className="h-3 w-3 mr-1" />
                ML Challenges
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight text-center">
              <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                Master ML Algorithms
              </span>
              <br />
              <span className="bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent">
                Through Practice
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-8 text-center">
              Solve curated machine learning problems, from regression to deep learning. 
              Build real-world skills with hands-on challenges.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <Card className="p-4 bg-black/60 backdrop-blur-xl border-white/10 hover:scale-105 transition-transform duration-300 hover:border-white/20" style={{
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
              }}>
                <div className="text-2xl font-bold text-white">{stats.total}</div>
                <div className="text-sm text-white/60">Total Problems</div>
              </Card>
              <Card className="p-4 bg-black/60 backdrop-blur-xl border-white/10 hover:scale-105 transition-transform duration-300 hover:border-white/20" style={{
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
              }}>
                <div className="text-2xl font-bold text-white">{stats.easy}</div>
                <div className="text-sm text-white/60">Easy</div>
              </Card>
              <Card className="p-4 bg-black/60 backdrop-blur-xl border-white/10 hover:scale-105 transition-transform duration-300 hover:border-white/20" style={{
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
              }}>
                <div className="text-2xl font-bold text-white">{stats.medium}</div>
                <div className="text-sm text-white/60">Medium</div>
              </Card>
              <Card className="p-4 bg-black/60 backdrop-blur-xl border-white/10 hover:scale-105 transition-transform duration-300 hover:border-white/20" style={{
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
              }}>
                <div className="text-2xl font-bold text-white">{stats.hard}</div>
                <div className="text-sm text-white/60">Hard</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-7xl mx-auto">
        {/* Filters */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-white/70" />
            <span className="text-sm font-medium text-white/70">Filter by Difficulty</span>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              className={`relative overflow-hidden group transition-all duration-300 ${
                filter === "all" 
                  ? "bg-white text-black border-white hover:bg-white/90 hover:scale-105 shadow-lg shadow-white/20" 
                  : "bg-black/50 border-white/20 text-white hover:border-white/40 hover:scale-105"
              }`}
            >
              {filter === "all" && (
                <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 animate-pulse" />
              )}
              <span className="relative z-10 font-semibold">All</span>
            </Button>
            <Button
              variant={filter === "easy" ? "default" : "outline"}
              onClick={() => setFilter("easy")}
              className={`relative overflow-hidden group transition-all duration-300 ${
                filter === "easy" 
                  ? "bg-white text-black border-white hover:bg-white/90 hover:scale-105 shadow-lg shadow-white/20" 
                  : "bg-black/50 border-white/20 text-white hover:border-white/40 hover:scale-105"
              }`}
            >
              {filter === "easy" && (
                <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 animate-pulse" />
              )}
              <span className="relative z-10 font-semibold">Easy</span>
            </Button>
            <Button
              variant={filter === "medium" ? "default" : "outline"}
              onClick={() => setFilter("medium")}
              className={`relative overflow-hidden group transition-all duration-300 ${
                filter === "medium" 
                  ? "bg-white text-black border-white hover:bg-white/90 hover:scale-105 shadow-lg shadow-white/20" 
                  : "bg-black/50 border-white/20 text-white hover:border-white/40 hover:scale-105"
              }`}
            >
              {filter === "medium" && (
                <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 animate-pulse" />
              )}
              <span className="relative z-10 font-semibold">Medium</span>
            </Button>
            <Button
              variant={filter === "hard" ? "default" : "outline"}
              onClick={() => setFilter("hard")}
              className={`relative overflow-hidden group transition-all duration-300 ${
                filter === "hard" 
                  ? "bg-white text-black border-white hover:bg-white/90 hover:scale-105 shadow-lg shadow-white/20" 
                  : "bg-black/50 border-white/20 text-white hover:border-white/40 hover:scale-105"
              }`}
            >
              {filter === "hard" && (
                <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 animate-pulse" />
              )}
              <span className="relative z-10 font-semibold">Hard</span>
            </Button>
          </div>
        </div>

        {/* Problems List */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="p-6 animate-pulse border-white/10 bg-black/60 backdrop-blur-xl">
                <div className="h-6 bg-white/10 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-white/10 rounded w-1/2"></div>
              </Card>
            ))}
          </div>
        ) : filteredProblems.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-2 border-white/20 bg-black/40 backdrop-blur-xl">
            <Brain className="h-12 w-12 mx-auto mb-4 text-white/30" />
            <p className="text-lg font-medium text-white/70 mb-2">
              {filter === "all" 
                ? "No problems available yet." 
                : `No ${filter} problems available.`}
            </p>
            <p className="text-sm text-white/50">
              Check back soon for new challenges!
            </p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProblems.map((problem, index) => (
              <Card 
                key={problem.id} 
                className="group relative overflow-hidden border-white/10 bg-black/60 backdrop-blur-xl hover:border-white/30 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:rotate-1"
                style={{
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                  transform: `perspective(1000px) rotateY(0deg)`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'perspective(1000px) rotateY(2deg) rotateX(-2deg) translateY(-8px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0px)';
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Link to={`/problem/${problem.slug}`} className="block p-6 relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 rounded-lg bg-white/10 border border-white/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 group-hover:bg-white/20">
                      <Code2 className="h-5 w-5 text-white" />
                    </div>
                    <Badge 
                      variant="outline" 
                      className="bg-white/10 border-white/20 text-white font-medium backdrop-blur-sm"
                    >
                      {problem.difficulty}
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-3 text-white group-hover:text-white transition-colors line-clamp-2">
                    {problem.title}
                  </h3>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <TrendingUp className="h-4 w-4" />
                      <span>{problem.acceptance_rate || 0}% acceptance</span>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-white/10 text-white border border-white/20 hover:bg-white hover:text-black transition-all duration-300 group-hover:scale-110"
                      variant="ghost"
                    >
                      Solve
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Problems;
