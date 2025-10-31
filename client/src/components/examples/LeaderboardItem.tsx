import LeaderboardItem from '../LeaderboardItem';

export default function LeaderboardItemExample() {
  return (
    <div className="p-8 bg-background space-y-2">
      <LeaderboardItem
        rank={1}
        name="Sarah Johnson"
        impact="1,250 kg CO₂"
        percentage={100}
        type="individual"
      />
      <LeaderboardItem
        rank={2}
        name="Michael Chen"
        impact="980 kg CO₂"
        percentage={78}
        type="individual"
      />
    </div>
  );
}