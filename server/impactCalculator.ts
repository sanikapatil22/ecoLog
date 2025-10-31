type ActionCategory = "energy_saving" | "recycling" | "upcycling" | "sustainable_commute";

interface ImpactMetrics {
  co2Reduced: string;
  waterSaved: string;
  wasteDiverted: string;
  pointsEarned: number;
}

// Impact calculation formulas based on action category and quantity
export function calculateImpact(
  category: ActionCategory,
  quantity: string | null | undefined
): ImpactMetrics {
  const qty = parseFloat(quantity || "1");

  switch (category) {
    case "energy_saving":
      // Energy saving: 1 kWh = 0.5 kg CO2, 10L water, 5 points per kWh
      return {
        co2Reduced: (qty * 0.5).toFixed(2),
        waterSaved: (qty * 10).toFixed(2),
        wasteDiverted: "0",
        pointsEarned: Math.round(qty * 5),
      };

    case "recycling":
      // Recycling: 1 kg = 2 kg CO2 saved, 50L water, 1 kg waste diverted, 10 points per kg
      return {
        co2Reduced: (qty * 2).toFixed(2),
        waterSaved: (qty * 50).toFixed(2),
        wasteDiverted: qty.toFixed(2),
        pointsEarned: Math.round(qty * 10),
      };

    case "upcycling":
      // Upcycling: 1 kg = 3 kg CO2 saved, 75L water, 1 kg waste diverted, 15 points per kg
      return {
        co2Reduced: (qty * 3).toFixed(2),
        waterSaved: (qty * 75).toFixed(2),
        wasteDiverted: qty.toFixed(2),
        pointsEarned: Math.round(qty * 15),
      };

    case "sustainable_commute":
      // Sustainable commute: 1 km = 0.15 kg CO2 saved, 2L water, 3 points per km
      return {
        co2Reduced: (qty * 0.15).toFixed(2),
        waterSaved: (qty * 2).toFixed(2),
        wasteDiverted: "0",
        pointsEarned: Math.round(qty * 3),
      };

    default:
      return {
        co2Reduced: "0",
        waterSaved: "0",
        wasteDiverted: "0",
        pointsEarned: 0,
      };
  }
}
