import { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle } from "lucide-react";

type Difficulty = "easy" | "medium" | "hard";

interface Problem {
  id: number;
  title: string;
  difficulty: Difficulty;
  category: string;
  solved: boolean;
  acceptance: number;
}

const mockProblems: Problem[] = [
  {
    id: 1,
    title: "Linear Regression Basics",
    difficulty: "easy",
    category: "Regression",
    solved: true,
    acceptance: 87.5,
  },
  {
    id: 2,
    title: "Binary Classification with Logistic Regression",
    difficulty: "easy",
    category: "Classification",
    solved: true,
    acceptance: 82.3,
  },
  {
    id: 3,
    title: "K-Means Clustering Implementation",
    difficulty: "medium",
    category: "Clustering",
    solved: false,
    acceptance: 68.9,
  },
  {
    id: 4,
    title: "Random Forest Feature Importance",
    difficulty: "medium",
    category: "Feature Engineering",
    solved: false,
    acceptance: 64.2,
  },
  {
    id: 5,
    title: "Gradient Descent Optimization",
    difficulty: "hard",
    category: "Optimization",
    solved: false,
    acceptance: 45.7,
  },
  {
    id: 6,
    title: "Neural Network from Scratch",
    difficulty: "hard",
    category: "Deep Learning",
    solved: false,
    acceptance: 38.4,
  },
];

const Problems = () => {
  const [filter, setFilter] = useState<Difficulty | "all">("all");

  const filteredProblems = filter === "all" 
    ? mockProblems 
    : mockProblems.filter(p => p.difficulty === filter);

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case "easy":
        return "text-easy";
      case "medium":
        return "text-medium";
      case "hard":
        return "text-hard";
    }
  };

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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Problems</h1>
          <p className="text-muted-foreground">
            Practice machine learning algorithms with curated problems
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            variant={filter === "easy" ? "default" : "outline"}
            onClick={() => setFilter("easy")}
          >
            Easy
          </Button>
          <Button
            variant={filter === "medium" ? "default" : "outline"}
            onClick={() => setFilter("medium")}
          >
            Medium
          </Button>
          <Button
            variant={filter === "hard" ? "default" : "outline"}
            onClick={() => setFilter("hard")}
          >
            Hard
          </Button>
        </div>

        {/* Problems List */}
        <div className="space-y-3">
          {filteredProblems.map((problem) => (
            <Card key={problem.id} className="p-4 hover:shadow-[var(--shadow-primary)] transition-shadow">
              <Link to={`/problem/${problem.id}`}>
                <div className="flex items-center gap-4">
                  {problem.solved ? (
                    <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1">{problem.title}</h3>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className={getDifficultyBg(problem.difficulty)}>
                        {problem.difficulty}
                      </Badge>
                      <Badge variant="outline">{problem.category}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {problem.acceptance}% acceptance
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
      </div>
    </div>
  );
};

export default Problems;
