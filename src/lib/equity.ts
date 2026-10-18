import { EquityFounderContribution } from "@/types";

export interface EquityCalculationResult {
  foundersWithShares: EquityFounderContribution[];
  optionPoolPct: number;
  unallocatedPct: number;
  methodologyNotes: string[];
  disclaimer: string;
}

/**
 * Calculates equitable founder ownership shares based on 5 weighted pillars:
 * 1. Time Commitment (35% weight)
 * 2. Execution Responsibility (20% weight)
 * 3. Cash Invested (20% weight)
 * 4. Intellectual Property / Ideation (15% weight)
 * 5. Opportunity Risk (10% weight)
 */
export function calculateEquitySplit(
  founders: Omit<EquityFounderContribution, "calculatedSharePct">[],
  optionPoolPct: number = 10
): EquityCalculationResult {
  if (founders.length === 0) {
    return {
      foundersWithShares: [],
      optionPoolPct,
      unallocatedPct: 100 - optionPoolPct,
      methodologyNotes: [],
      disclaimer: "No founders provided.",
    };
  }

  const pool = Math.max(0, Math.min(30, optionPoolPct));
  const availableFounderPool = 100 - pool;

  // Find max values to normalize
  const totalCash = founders.reduce((sum, f) => sum + Math.max(0, f.cashInvested), 0);
  const totalHours = founders.reduce((sum, f) => sum + Math.max(0, f.timeCommitmentHoursPerWeek), 0);

  // Compute raw score for each founder
  const rawScores = founders.map((founder) => {
    // 1. Time (0 - 100 scale based on 40h standard or relative share)
    const timeScore = totalHours > 0 ? (founder.timeCommitmentHoursPerWeek / totalHours) * 100 : 50;

    // 2. Responsibilities (scale 1-5 -> 20-100)
    const respScore = (founder.responsibilitiesScore / 5) * 100;

    // 3. Cash invested
    let cashScore = 0;
    if (totalCash > 0) {
      cashScore = (founder.cashInvested / totalCash) * 100;
    } else {
      // If nobody put cash in, weight gets redistributed evenly
      cashScore = 50;
    }

    // 4. IP Contribution (1-5 -> 20-100)
    const ipScore = (founder.ipContributionScore / 5) * 100;

    // 5. Risk (1-5 -> 20-100)
    const riskScore = (founder.executionRiskScore / 5) * 100;

    // Weighted composite: Time 35%, Resp 20%, Cash 20%, IP 15%, Risk 10%
    const compositeScore =
      timeScore * 0.35 +
      respScore * 0.2 +
      cashScore * 0.2 +
      ipScore * 0.15 +
      riskScore * 0.1;

    return Math.max(1, compositeScore);
  });

  const sumOfRawScores = rawScores.reduce((a, b) => a + b, 0);

  const foundersWithShares: EquityFounderContribution[] = founders.map((founder, index) => {
    const rawShare = (rawScores[index] / sumOfRawScores) * availableFounderPool;
    const roundedShare = Math.round(rawShare * 10) / 10;

    return {
      ...founder,
      calculatedSharePct: roundedShare,
    };
  });

  // Rebalance any rounding discrepancy
  const allocated = foundersWithShares.reduce((s, f) => s + f.calculatedSharePct, 0);
  const diff = Math.round((availableFounderPool - allocated) * 10) / 10;
  if (foundersWithShares.length > 0 && Math.abs(diff) > 0) {
    foundersWithShares[0].calculatedSharePct = Math.round((foundersWithShares[0].calculatedSharePct + diff) * 10) / 10;
  }

  const methodologyNotes = [
    "Weighted Contribution Matrix: Time (35%), Responsibilities (20%), Cash Invested (20%), IP/Inception (15%), Opportunity Risk (10%).",
    `Dedicated Option Pool: ${pool}% reserved for initial key hires, advisors, and future employees.`,
    "Vesting Recommendation: Standard 4-year vesting schedule with a 1-year cliff is strongly recommended for all founders.",
  ];

  const disclaimer =
    "LEGAL DISCLAIMER: This equity model is an objective discussion aid and framework for founder alignment. It does not constitute legal, tax, or financial advice. Founder equity agreements, vesting cliffs, IP assignments, and tax elections (e.g. 83(b)) require formal drafting and review by qualified startup corporate attorneys.";

  return {
    foundersWithShares,
    optionPoolPct: pool,
    unallocatedPct: 0,
    methodologyNotes,
    disclaimer,
  };
}
