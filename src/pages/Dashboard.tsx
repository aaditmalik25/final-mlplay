import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, TrendingUp, Award } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
          <p className="text-muted-foreground">Track your ML learning progress</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Problems Solved</span>
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div className="text-3xl font-bold">12</div>
            <p className="text-sm text-muted-foreground mt-1">of 45 total</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Success Rate</span>
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <div className="text-3xl font-bold">78%</div>
            <p className="text-sm text-muted-foreground mt-1">submissions accepted</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Global Rank</span>
              <Trophy className="h-5 w-5 text-warning" />
            </div>
            <div className="text-3xl font-bold">#342</div>
            <p className="text-sm text-muted-foreground mt-1">top 15%</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Badges Earned</span>
              <Award className="h-5 w-5 text-accent" />
            </div>
            <div className="text-3xl font-bold">5</div>
            <p className="text-sm text-muted-foreground mt-1">achievements unlocked</p>
          </Card>
        </div>

        {/* Progress by Category */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Progress by Category</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Classification</span>
                <span className="text-muted-foreground">4/8 problems</span>
              </div>
              <Progress value={50} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Regression</span>
                <span className="text-muted-foreground">6/10 problems</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Clustering</span>
                <span className="text-muted-foreground">2/7 problems</span>
              </div>
              <Progress value={28} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Deep Learning</span>
                <span className="text-muted-foreground">0/12 problems</span>
              </div>
              <Progress value={0} className="h-2" />
            </div>
          </div>
        </Card>

        {/* Recent Badges */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Recent Achievements</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-success/10 border border-success/20">
              <Award className="h-8 w-8 text-success" />
              <div>
                <div className="font-semibold">First Solve</div>
                <div className="text-sm text-muted-foreground">Complete your first problem</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20">
              <Award className="h-8 w-8 text-primary" />
              <div>
                <div className="font-semibold">10 Problems</div>
                <div className="text-sm text-muted-foreground">Solve 10 problems</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-medium/10 border border-medium/20">
              <Award className="h-8 w-8 text-medium" />
              <div>
                <div className="font-semibold">Regression Master</div>
                <div className="text-sm text-muted-foreground">Complete 5 regression problems</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
