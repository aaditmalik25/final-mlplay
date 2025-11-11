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
        return <Trophy className="h-6 w-6 text-warning" />;
      case 2:
        return <Medal className="h-6 w-6 text-muted-foreground" />;
      case 3:
        return <Medal className="h-6 w-6 text-medium" />;
      default:
        return <span className="text-muted-foreground font-semibold">#{rank}</span>;
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "platinum":
        return "bg-primary/10 text-primary border-primary/20";
      case "gold":
        return "bg-warning/10 text-warning border-warning/20";
      case "silver":
        return "bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20";
      case "bronze":
        return "bg-medium/10 text-medium border-medium/20";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Leaderboard</h1>
          <p className="text-muted-foreground">
            Top ML practitioners ranked by solved problems and accuracy
          </p>
        </div>

        {/* Top 3 Podium */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {leaderboardData.slice(0, 3).map((user, idx) => (
            <Card 
              key={user.rank} 
              className={`p-6 text-center ${
                idx === 0 ? 'md:order-2 bg-[image:var(--gradient-hero)]' : 
                idx === 1 ? 'md:order-1' : 'md:order-3'
              }`}
            >
              <div className="flex justify-center mb-4">
                {getRankIcon(user.rank)}
              </div>
              <Avatar className="h-20 w-20 mx-auto mb-3">
                <AvatarFallback className="text-2xl">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-bold text-xl mb-1">{user.name}</h3>
              <Badge variant="outline" className={getBadgeColor(user.badge)}>
                {user.badge}
              </Badge>
              <div className="mt-4 space-y-1">
                <div className="text-2xl font-bold text-primary">{user.score}</div>
                <div className="text-sm text-muted-foreground">
                  {user.solved} problems solved
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Full Leaderboard */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-semibold">Rank</th>
                  <th className="text-left p-4 font-semibold">User</th>
                  <th className="text-left p-4 font-semibold">Badge</th>
                  <th className="text-right p-4 font-semibold">Solved</th>
                  <th className="text-right p-4 font-semibold">Score</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((user) => (
                  <tr 
                    key={user.rank} 
                    className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getRankIcon(user.rank)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className={getBadgeColor(user.badge)}>
                        {user.badge}
                      </Badge>
                    </td>
                    <td className="p-4 text-right font-medium">{user.solved}</td>
                    <td className="p-4 text-right font-bold text-primary">{user.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;
