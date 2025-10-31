import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Medal } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface LeaderboardItemProps {
  rank: number;
  name: string;
  impact: string;
  percentage: number;
  type: "individual" | "corporate";
}

export default function LeaderboardItem({
  rank,
  name,
  impact,
  percentage,
  type
}: LeaderboardItemProps) {
  const getMedalIcon = () => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return null;
  };

  const initials = name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="p-4 hover-elevate">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 flex-shrink-0">
          {rank <= 3 ? (
            getMedalIcon()
          ) : (
            <div className="w-8 h-8 flex items-center justify-center text-sm font-semibold text-muted-foreground">
              {rank}
            </div>
          )}
          <Avatar>
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-semibold text-foreground truncate">{name}</h3>
            <span className="text-sm font-semibold text-primary flex-shrink-0">{impact}</span>
          </div>
          <Progress value={percentage} className="h-1.5" />
        </div>
      </div>
    </Card>
  );
}