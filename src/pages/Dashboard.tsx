import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, TrendingUp, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DashboardStats {
  totalProblems: number;
  solvedProblems: number;
  acceptanceRate: number;
  totalSubmissions: number;
}

interface RecentSubmission {
  id: string;
  problem_id: string;
  problem_title: string;
  status: string;
  created_at: string;
  execution_time: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProblems: 0,
    solvedProblems: 0,
    acceptanceRate: 0,
    totalSubmissions: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch user statistics using RPC function
      const { data: dashboardData, error: statsError } = await supabase
        .rpc('get_user_dashboard_stats', { p_user_id: user.id });

      if (statsError) throw statsError;

      if (dashboardData && dashboardData.length > 0) {
        const data = dashboardData[0];
        setStats({
          totalProblems: Number(data.total_problems || 0),
          solvedProblems: Number(data.solved_problems || 0),
          acceptanceRate: Number(data.acceptance_rate || 0),
          totalSubmissions: Number(data.total_submissions || 0)
        });

        // Parse recent submissions from jsonb
        const recentSubs = (data.recent_submissions || []) as unknown as RecentSubmission[];
        setRecentActivity(recentSubs);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error loading dashboard",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "accepted": return "text-green-500";
      case "wrong_answer": return "text-red-500";
      case "time_limit_exceeded": return "text-yellow-500";
      default: return "text-white/60";
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
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
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2 text-white">My Dashboard</h1>
            <p className="text-white/70">Track your ML learning progress</p>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6 animate-pulse bg-black/60 backdrop-blur-xl border-white/10">
                  <div className="h-6 bg-white/10 rounded w-3/4"></div>
                </Card>
              ))}
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card 
                  className="p-6 bg-black/60 backdrop-blur-xl border-white/10 hover:border-white/30 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                  style={{
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'perspective(1000px) rotateY(2deg) rotateX(-2deg) translateY(-8px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0px)';
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/70">Problems Solved</span>
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white">{stats.solvedProblems}</div>
                  <p className="text-sm text-white/60 mt-1">of {stats.totalProblems} total</p>
                </Card>

                <Card 
                  className="p-6 bg-black/60 backdrop-blur-xl border-white/10 hover:border-white/30 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                  style={{
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'perspective(1000px) rotateY(2deg) rotateX(-2deg) translateY(-8px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0px)';
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/70">Success Rate</span>
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white">{stats.acceptanceRate}%</div>
                  <p className="text-sm text-white/60 mt-1">submissions accepted</p>
                </Card>

                <Card 
                  className="p-6 bg-black/60 backdrop-blur-xl border-white/10 hover:border-white/30 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                  style={{
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'perspective(1000px) rotateY(2deg) rotateX(-2deg) translateY(-8px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0px)';
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/70">Total Submissions</span>
                    <Trophy className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white">{stats.totalSubmissions}</div>
                  <p className="text-sm text-white/60 mt-1">code submissions</p>
                </Card>

                <Card 
                  className="p-6 bg-black/60 backdrop-blur-xl border-white/10 hover:border-white/30 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                  style={{
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'perspective(1000px) rotateY(2deg) rotateX(-2deg) translateY(-8px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0px)';
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/70">Current Rank</span>
                    <Award className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white">-</div>
                  <p className="text-sm text-white/60 mt-1">on leaderboard</p>
                </Card>
              </div>

              {/* Progress Section */}
              <Card 
                className="p-6 mb-8 bg-black/60 backdrop-blur-xl border-white/10"
                style={{
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                }}
              >
                <h2 className="text-xl font-bold mb-4 text-white">Overall Progress</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-white/70">Problems Solved</span>
                      <span className="text-sm font-medium text-white">{stats.solvedProblems} / {stats.totalProblems}</span>
                    </div>
                    <Progress value={stats.totalProblems > 0 ? (stats.solvedProblems / stats.totalProblems) * 100 : 0} className="h-2" />
                  </div>
                </div>
              </Card>

              {/* Recent Activity */}
              <Card 
                className="p-6 bg-black/60 backdrop-blur-xl border-white/10"
                style={{
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                }}
              >
                <h2 className="text-xl font-bold mb-4 text-white">Recent Activity</h2>
                {recentActivity.length === 0 ? (
                  <p className="text-white/60">No submissions yet. Start solving problems!</p>
                ) : (
                  <div className="space-y-3">
                    {recentActivity.map((activity) => (
                      <div 
                        key={activity.id} 
                        className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                      >
                        <div className="flex-1">
                          <h3 className="font-medium text-white">{activity.problem_title}</h3>
                          <div className="flex gap-2 mt-1">
                            <span className={`text-sm ${getStatusColor(activity.status)}`}>
                              {activity.status}
                            </span>
                            {activity.execution_time && (
                              <span className="text-sm text-white/60">
                                {activity.execution_time}ms
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-white/60">
                          {new Date(activity.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
