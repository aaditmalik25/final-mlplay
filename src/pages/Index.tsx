import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { Brain, Code2, TrendingUp, Users, Award, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [startPath, setStartPath] = useState("/auth");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setStartPath(session ? "/problems" : "/auth");
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setStartPath(session ? "/problems" : "/auth");
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[image:var(--gradient-hero)] opacity-50" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Master Machine Learning
              <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                One Problem at a Time
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Practice real-world ML algorithms, compete with others, and level up your data science skills with curated challenges.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg">
                <Link to={startPath}>Start Learning</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg">
                <Link to="/auth">Sign Up Free</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why ML Playground?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-[var(--shadow-primary)] transition-shadow">
              <Brain className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Real ML Problems</h3>
              <p className="text-muted-foreground">
                Tackle classification, regression, clustering, and more with real datasets and industry-relevant scenarios.
              </p>
            </Card>
            
            <Card className="p-6 hover:shadow-[var(--shadow-primary)] transition-shadow">
              <Code2 className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Interactive Code Editor</h3>
              <p className="text-muted-foreground">
                Write, test, and submit your solutions directly in the browser with instant feedback.
              </p>
            </Card>
            
            <Card className="p-6 hover:shadow-[var(--shadow-primary)] transition-shadow">
              <TrendingUp className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Track Your Progress</h3>
              <p className="text-muted-foreground">
                Monitor your improvement with detailed statistics, solve rates, and skill assessments.
              </p>
            </Card>
            
            <Card className="p-6 hover:shadow-[var(--shadow-primary)] transition-shadow">
              <Users className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Competitive Leaderboards</h3>
              <p className="text-muted-foreground">
                Compete with data scientists worldwide and see how you rank on problem-solving challenges.
              </p>
            </Card>
            
            <Card className="p-6 hover:shadow-[var(--shadow-primary)] transition-shadow">
              <Award className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Earn Badges</h3>
              <p className="text-muted-foreground">
                Unlock achievements as you solve problems and reach new milestones in your ML journey.
              </p>
            </Card>
            
            <Card className="p-6 hover:shadow-[var(--shadow-primary)] transition-shadow">
              <BookOpen className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Curated Content</h3>
              <p className="text-muted-foreground">
                Learn from problems designed by ML experts, with difficulty levels from beginner to advanced.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="p-8 md:p-12 bg-[image:var(--gradient-primary)] text-primary-foreground">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Level Up Your ML Skills?
              </h2>
              <p className="text-lg mb-8 opacity-90">
                Join thousands of data scientists practicing and improving their machine learning skills every day.
              </p>
              <Button asChild size="lg" variant="secondary" className="text-lg">
                <Link to="/auth">Start Your Journey</Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Code2 className="h-5 w-5 text-primary" />
              <span className="font-semibold">ML Playground</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 ML Playground. Built for ML enthusiasts.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
