import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award } from "lucide-react";

const leaderboardData = [
  { rank: 1, name: "Alex Chen", solved: 45, score: 4850, badge: "platinum" },
  { rank: 2, name: "Sarah Kim", solved: 42, score: 4620, badge: "gold" },
  { rank: 3, name: "Michael Zhang", solved: 40, score: 4500, badge: "gold" },
  { rank: 4, name: "Emily Watson", solved: 38, score: 4280, badge: "silver" },
  { rank: 5, name: "David Lee", solved: 35, score: 4100, badge: "silver" },
  { rank: 6, name: "Jessica Moore", solved: 33, score: 3950, badge: "bronze" },
  { rank: 7, name: "Ryan Park", solved: 32, score: 3820, badge: "bronze" },
  { rank: 8, name: "Sophie Taylor", solved: 30, score: 3650, badge: "bronze" },
  { rank: 9, name: "James Wilson", solved: 28, score: 3480, badge: "bronze" },
  { rank: 10, name: "Lisa Anderson", solved: 27, score: 3350, badge: "bronze" },
];

const Leaderboard = () => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-white" />;
      case 2:
        return <Medal className="h-6 w-6 text-white/80" />;
      case 3:
        return <Medal className="h-6 w-6 text-white/60" />;
      default:
        return <span className="text-white/70 font-semibold">#{rank}</span>;
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "platinum":
        return "bg-white/10 text-white border-white/20";
      case "gold":
        return "bg-white/10 text-white border-white/20";
      case "silver":
        return "bg-white/10 text-white/80 border-white/20";
      case "bronze":
        return "bg-white/10 text-white/60 border-white/20";
      default:
        return "";
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
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">Leaderboard</h1>
            <p className="text-white/70">
              Top ML practitioners ranked by solved problems and accuracy
            </p>
          </div>

          {/* Top 3 Podium */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {leaderboardData.slice(0, 3).map((user, idx) => (
              <Card 
                key={user.rank} 
                className={`p-6 text-center bg-black/60 backdrop-blur-xl border-white/10 hover:border-white/30 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
                  idx === 0 ? 'md:order-2' : idx === 1 ? 'md:order-1' : 'md:order-3'
                }`}
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
                <div className="flex justify-center mb-4">
                  {getRankIcon(user.rank)}
                </div>
                <Avatar className="h-20 w-20 mx-auto mb-3 border-2 border-white/20">
                  <AvatarFallback className="text-2xl bg-white/10 text-white">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-bold text-xl mb-1 text-white">{user.name}</h3>
                <Badge variant="outline" className={getBadgeColor(user.badge)}>
                  {user.badge}
                </Badge>
                <div className="mt-4 space-y-1">
                  <div className="text-2xl font-bold text-white">{user.score}</div>
                  <div className="text-sm text-white/60">
                    {user.solved} problems solved
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Full Leaderboard */}
          <Card className="bg-black/60 backdrop-blur-xl border-white/10" style={{
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 font-semibold text-white">Rank</th>
                    <th className="text-left p-4 font-semibold text-white">User</th>
                    <th className="text-left p-4 font-semibold text-white">Badge</th>
                    <th className="text-right p-4 font-semibold text-white">Solved</th>
                    <th className="text-right p-4 font-semibold text-white">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((user) => (
                    <tr 
                      key={user.rank} 
                      className="border-b border-white/10 last:border-0 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {getRankIcon(user.rank)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="border border-white/20">
                            <AvatarFallback className="bg-white/10 text-white">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-white">{user.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className={getBadgeColor(user.badge)}>
                          {user.badge}
                        </Badge>
                      </td>
                      <td className="p-4 text-right font-medium text-white">{user.solved}</td>
                      <td className="p-4 text-right font-bold text-white">{user.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
