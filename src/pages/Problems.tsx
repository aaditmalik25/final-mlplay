import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { BurningFlame } from "@/components/BurningFlame";
import {
  Code2,
  TrendingUp,
  CheckCircle2,
  Circle,
  Calendar,
  Flame,
  Search,
  Filter,
  Trophy
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Difficulty = "easy" | "medium" | "hard";

interface Problem {
  id: string;
  order_index: number;
  title: string;
  slug: string;
  difficulty: Difficulty;
  acceptance_rate: number;
  status?: "solved" | "unsolved";
  is_premium?: boolean;
  topics?: {
    name: string;
  };
}

const TOPICS = [
  "All Topics",
  "Supervised Learning",
  "Deep Learning",
  "NLP",
  "Reinforcement Learning"
];

const Problems = () => {
  const [filter, setFilter] = useState<Difficulty | "all">("all");
  const [selectedTopic, setSelectedTopic] = useState("All Topics");
  const [searchQuery, setSearchQuery] = useState("");
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Mock Calendar Data
  const activityDays = Array.from({ length: 28 }, (_, i) => ({
    date: i,
    count: Math.random() > 0.7 ? Math.floor(Math.random() * 5) : 0
  }));

  const [userStats, setUserStats] = useState({
    streak: 0,
    totalSolved: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0
  });

  useEffect(() => {
    fetchProblems();
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('created_at, problem:problems(id, difficulty)')
        .eq('user_id', session.user.id)
        .eq('status', 'accepted');

      if (error) throw error;

      if (!data) return;

      // 1. Calculate Solved Counts (Unique Problems)
      const solvedProblems = new Set();
      let easy = 0, medium = 0, hard = 0;

      data.forEach(sub => {
        // @ts-ignore
        const problemId = sub.problem?.id;
        // @ts-ignore
        const difficulty = sub.problem?.difficulty;

        if (problemId && !solvedProblems.has(problemId)) {
          solvedProblems.add(problemId);
          if (difficulty === 'easy') easy++;
          else if (difficulty === 'medium') medium++;
          else if (difficulty === 'hard') hard++;
        }
      });

      // 2. Calculate Streak
      // Get unique dates YYYY-MM-DD
      const dates = [...new Set(data.map(sub => new Date(sub.created_at).toISOString().split('T')[0]))].sort().reverse();

      let streak = 0;
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      // Streak logic: Needs to include today or yesterday to be "active"
      if (dates.length > 0) {
        let currentDateStr = dates[0];

        // If the latest submission is not today or yesterday, streak is broken (0), 
        // unless you want to show the specific streak record. 
        // Usually "Current Streak" implies it must be maintained.
        if (currentDateStr === today || currentDateStr === yesterday) {
          streak = 1;
          let checkDate = new Date(currentDateStr);

          for (let i = 1; i < dates.length; i++) {
            // Expected previous day
            checkDate.setDate(checkDate.getDate() - 1);
            const expectedDateStr = checkDate.toISOString().split('T')[0];

            if (dates[i] === expectedDateStr) {
              streak++;
            } else {
              break;
            }
          }
        }
      }

      setUserStats({
        streak: streak || 3, // Mock streak for demo functionality
        totalSolved: solvedProblems.size,
        easySolved: easy,
        mediumSolved: medium,
        hardSolved: hard
      });

    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const fetchProblems = async () => {
    try {
      const { data, error } = await supabase
        .from('problems')
        .select('id, order_index, title, slug, difficulty, acceptance_rate, is_premium, topics(name)')
        .order('order_index');

      if (error) throw error;

      // Transform data to include a mock status for UI demonstration
      const problemsWithStatus = (data || []).map((p, index) => ({
        ...p,
        status: index % 3 === 0 ? "solved" : "unsolved" // Mock: Every 3rd problem is solved
      })) as Problem[];

      setProblems(problemsWithStatus);
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

  const filteredProblems = problems.filter(p => {
    const matchesDifficulty = filter === "all" || p.difficulty === filter;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDifficulty && matchesSearch;
  });

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case "easy": return "text-green-400";
      case "medium": return "text-yellow-400";
      case "hard": return "text-red-400";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-neon-cyan/30">
      <Navigation />

      <main className="container mx-auto px-6 md:px-12 pt-24 pb-12 max-w-[1800px]">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

          {/* LEFT COLUMN: Problem List (9 cols - Wider) */}
          <div className="xl:col-span-9 flex flex-col gap-6">

            {/* 2-ROW HEADER */}
            <div className="flex flex-col gap-4">

              {/* Row 1: Topics (Simplified) */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {TOPICS.map((topic) => (
                    <button
                      key={topic}
                      onClick={() => setSelectedTopic(topic)}
                      className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${selectedTopic === topic
                        ? "bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                        : "bg-zinc-900/50 text-zinc-400 border-white/10 hover:border-white/30 hover:text-white"
                        }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>

                <Link
                  to="/topics"
                  className="hidden md:flex items-center gap-1 text-sm text-neon-cyan hover:text-neon-cyan/80 transition-colors font-medium ml-4"
                >
                  View all topics
                  <span className="text-lg leading-none">›</span>
                </Link>
              </div>

              {/* Row 2: Search + Filter + Stats */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-zinc-900/50 border border-white/5">

                {/* Left: Search */}
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <Input
                    placeholder="Search questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-zinc-900/50 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-neon-cyan focus-visible:border-neon-cyan"
                  />
                </div>

                {/* Right: Filters & Progress */}
                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">

                  {/* Difficulty Filter */}
                  <div className="flex items-center gap-1 bg-zinc-900 rounded-lg p-1 border border-white/5">
                    {(["all", "easy", "medium", "hard"] as const).map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setFilter(lvl)}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${filter === lvl
                          ? "bg-white/10 text-white shadow-sm"
                          : "text-zinc-500 hover:text-zinc-300"
                          }`}
                      >
                        {lvl === "all" ? "All" : lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                      </button>
                    ))}
                  </div>

                </div>
              </div>
            </div>

            {/* Problems Table */}
            <div className="rounded-xl border border-white/5 overflow-hidden bg-zinc-900/30">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 bg-white/5 text-sm font-medium text-zinc-400">
                <div className="col-span-1 text-center">Status</div>
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-5">Title</div>
                <div className="col-span-2">Topic</div>
                <div className="col-span-2">Difficulty</div>
                <div className="col-span-1 text-right">Acc.</div>
              </div>

              {/* Table Body */}
              {loading ? (
                <div className="p-12 text-center text-zinc-500">Loading problems...</div>
              ) : filteredProblems.length === 0 ? (
                <div className="p-12 text-center text-zinc-500">No problems found.</div>
              ) : (
                <div className="divide-y divide-white/5">
                  {filteredProblems.map((problem, i) => (
                    <div
                      key={problem.id}
                      className={`grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors group ${i % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.02]'}`}
                    >
                      {/* Status */}
                      <div className="col-span-1 flex justify-center">
                        {problem.status === 'solved' ? (
                          <CheckCircle2 className="h-5 w-5 text-neon-cyan shadow-[0_0_10px_rgba(0,243,255,0.4)]" />
                        ) : (
                          <Circle className="h-5 w-5 text-zinc-700 group-hover:text-zinc-500 transition-colors" />
                        )}
                      </div>

                      {/* ID */}
                      <div className="col-span-1 text-center text-zinc-500 font-mono text-sm">
                        {problem.order_index}
                      </div>

                      {/* Title */}
                      <div className="col-span-5">
                        <Link
                          to={`/problem/${problem.slug}`}
                          className="font-medium text-zinc-300 group-hover:text-white transition-colors flex items-center gap-2"
                        >
                          {problem.title}
                          {/* Premium Tag */}
                          {problem.is_premium && <Badge variant="secondary" className="text-[10px] h-4 px-1 bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Premium</Badge>}
                        </Link>
                      </div>

                      {/* Topic */}
                      <div className="col-span-2 text-sm text-zinc-400">
                        {problem.topics?.name || "General"}
                      </div>

                      {/* Difficulty */}
                      <div className={`col-span-2 text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                      </div>

                      {/* Acceptance */}
                      <div className="col-span-1 text-right text-sm text-zinc-500 group-hover:text-zinc-400">
                        {problem.acceptance_rate || 0}%
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar (3 cols - Compressed) */}
          <div className="xl:col-span-3 flex flex-col gap-6">


            {/* User Stats Card */}
            <Card className="p-6 bg-zinc-900/80 backdrop-blur-xl border-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.1)] hover:shadow-[0_0_30px_rgba(249,115,22,0.2)] hover:border-orange-500/40 transition-all duration-500 group">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative p-3 rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
                  <div className="absolute inset-0 bg-orange-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {userStats.streak > 0 ? (
                    <BurningFlame />
                  ) : (
                    <Flame className="relative h-8 w-8 text-zinc-600" />
                  )}
                </div>
                <div>
                  <div className="text-3xl font-black bg-gradient-to-r from-orange-400 via-red-500 to-rose-600 bg-clip-text text-transparent drop-shadow-sm">
                    {userStats.streak}
                  </div>
                  <div className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Day Streak</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-xs text-zinc-400 mb-1">
                  <span>Progress</span>
                  <span>{userStats.totalSolved} / {problems.length} Solved</span>
                </div>
                <Progress
                  value={problems.length > 0 ? (userStats.totalSolved / problems.length) * 100 : 0}
                  className="h-2 bg-zinc-800"
                  indicatorClassName="bg-gradient-to-r from-neon-cyan to-blue-500"
                />

                <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2">
                  <div className="p-2 rounded bg-zinc-800/50 border border-white/5 hover:bg-zinc-800 transition-colors">
                    <div className="text-green-400 mb-1 font-medium">Easy</div>
                    <div className="text-white font-bold text-lg">{userStats.easySolved}</div>
                  </div>
                  <div className="p-2 rounded bg-zinc-800/50 border border-white/5 hover:bg-zinc-800 transition-colors">
                    <div className="text-yellow-400 mb-1 font-medium">Med</div>
                    <div className="text-white font-bold text-lg">{userStats.mediumSolved}</div>
                  </div>
                  <div className="p-2 rounded bg-zinc-800/50 border border-white/5 hover:bg-zinc-800 transition-colors">
                    <div className="text-red-400 mb-1 font-medium">Hard</div>
                    <div className="text-white font-bold text-lg">{userStats.hardSolved}</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Activity Calendar (Mock) */}
            <Card className="p-6 bg-zinc-900/50 border-white/5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-zinc-200 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-neon-pink" />
                  Activity
                </h3>
              </div>

              <div className="grid grid-cols-7 gap-1">
                {activityDays.map((day, i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded-sm ${day.count > 0
                      ? 'bg-neon-cyan/50'
                      : 'bg-zinc-800'
                      }`}
                    style={{
                      opacity: day.count > 0 ? 0.3 + (day.count * 0.15) : 1
                    }}
                  />
                ))}
              </div>
            </Card>

            {/* Daily Challenge Card */}
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-neon-purple to-neon-pink rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity" />
              <Card className="relative p-6 bg-zinc-900/90 border-white/5 hover:bg-zinc-900 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="border-neon-purple/50 text-neon-purple bg-neon-purple/10">
                    Daily Challenge
                  </Badge>
                  <span className="text-xs text-zinc-400">Dec 18</span>
                </div>
                <h3 className="font-bold text-lg mb-1 group-hover:text-neon-pink transition-colors">
                  Binary Tree Maximum Path Sum
                </h3>
                <div className="text-sm text-red-400 font-medium">Hard</div>
              </Card>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Problems;
