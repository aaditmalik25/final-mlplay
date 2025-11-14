import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, TrendingUp, Award } from "lucide-react";

const Dashboard = () => {
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
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2 text-white">My Dashboard</h1>
            <p className="text-white/70">Track your ML learning progress</p>
          </div>

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
              <div className="text-3xl font-bold text-white">12</div>
              <p className="text-sm text-white/60 mt-1">of 45 total</p>
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
              <div className="text-3xl font-bold text-white">78%</div>
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
                <span className="text-white/70">Global Rank</span>
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <div className="text-3xl font-bold text-white">#342</div>
              <p className="text-sm text-white/60 mt-1">top 15%</p>
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
                <span className="text-white/70">Badges Earned</span>
                <Award className="h-5 w-5 text-white" />
              </div>
              <div className="text-3xl font-bold text-white">5</div>
              <p className="text-sm text-white/60 mt-1">achievements unlocked</p>
            </Card>
          </div>

          {/* Progress by Category */}
          <Card className="p-6 mb-8 bg-black/60 backdrop-blur-xl border-white/10" style={{
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          }}>
            <h2 className="text-xl font-semibold mb-6 text-white">Progress by Category</h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-white">Classification</span>
                  <span className="text-white/60">4/8 problems</span>
                </div>
                <Progress value={50} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-white">Regression</span>
                  <span className="text-white/60">6/10 problems</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-white">Clustering</span>
                  <span className="text-white/60">2/7 problems</span>
                </div>
                <Progress value={28} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-white">Deep Learning</span>
                  <span className="text-white/60">0/12 problems</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
            </div>
          </Card>

          {/* Recent Badges */}
          <Card className="p-6 bg-black/60 backdrop-blur-xl border-white/10" style={{
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          }}>
            <h2 className="text-xl font-semibold mb-6 text-white">Recent Achievements</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-white/10 border border-white/20 hover:bg-white/15 transition-colors">
                <Award className="h-8 w-8 text-white" />
                <div>
                  <div className="font-semibold text-white">First Solve</div>
                  <div className="text-sm text-white/60">Complete your first problem</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-white/10 border border-white/20 hover:bg-white/15 transition-colors">
                <Award className="h-8 w-8 text-white" />
                <div>
                  <div className="font-semibold text-white">10 Problems</div>
                  <div className="text-sm text-white/60">Solve 10 problems</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-white/10 border border-white/20 hover:bg-white/15 transition-colors">
                <Award className="h-8 w-8 text-white" />
                <div>
                  <div className="font-semibold text-white">Regression Master</div>
                  <div className="text-sm text-white/60">Complete 5 regression problems</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
