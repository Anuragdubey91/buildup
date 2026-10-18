import { BudgetPlanType } from "@/types";

export interface FinancialCalculationResult {
  initialSetupCost: number;
  totalMonthlyExpenses: number;
  totalMonthlyRevenues: number;
  netMonthlyBurn: number; // > 0 means burning cash, < 0 means net profit
  effectiveCashBalance: number;
  runwayMonths: number | "Profitable / Infinite";
  breakEvenMonthlyRevenue: number;
  breakEvenCustomers: number | null;
  contributionMarginPerUnit: number | null;
  formulas: { name: string; formula: string; explanation: string }[];
  disclaimer: string;
}

export function calculateFinancialProjections(plan: BudgetPlanType): FinancialCalculationResult {
  const initialSetupCost = (plan.oneTimeCosts || []).reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalMonthlyExpenses = (plan.monthlyExpenses || []).reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalMonthlyRevenues = (plan.monthlyRevenues || []).reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalFunding = (plan.fundingReceived || []).reduce((sum, item) => sum + (item.amount || 0), 0);

  const effectiveCashBalance = Math.max(0, (plan.initialCash || 0) + totalFunding - initialSetupCost);
  const netMonthlyBurn = totalMonthlyExpenses - totalMonthlyRevenues;

  let runwayMonths: number | "Profitable / Infinite" = 0;
  if (netMonthlyBurn <= 0) {
    runwayMonths = "Profitable / Infinite";
  } else if (effectiveCashBalance <= 0) {
    runwayMonths = 0;
  } else {
    runwayMonths = Math.floor((effectiveCashBalance / netMonthlyBurn) * 10) / 10;
  }

  // Unit Economics Break-Even
  let breakEvenCustomers: number | null = null;
  let contributionMarginPerUnit: number | null = null;

  if (plan.targetAveragePricePerCustomer && plan.targetAveragePricePerCustomer > 0) {
    const varCost = plan.variableCostPerCustomer || 0;
    contributionMarginPerUnit = plan.targetAveragePricePerCustomer - varCost;

    if (contributionMarginPerUnit > 0) {
      breakEvenCustomers = Math.ceil(totalMonthlyExpenses / contributionMarginPerUnit);
    }
  }

  const formulas = [
    {
      name: "Effective Available Cash",
      formula: "Initial Cash + Total Funding - Initial Setup Costs",
      explanation: "Current usable treasury balance after deducting non-recurring startup formation expenses.",
    },
    {
      name: "Net Monthly Cash Burn",
      formula: "Total Recurring Monthly Expenses - Total Projected Monthly Revenue",
      explanation: "Net liquid cash exiting the startup each calendar month.",
    },
    {
      name: "Runway (Months)",
      formula: "Effective Available Cash / Net Monthly Burn",
      explanation: "Number of operational months remaining before capital depletion under current cost assumptions.",
    },
    {
      name: "Break-Even Sales Units",
      formula: "Fixed Monthly Expenses / (Average Revenue per Customer - Variable Cost per Customer)",
      explanation: "Monthly customer count required to achieve zero net cash drain.",
    },
  ];

  const disclaimer =
    "FINANCIAL DISCLAIMER: All projections, runway numbers, and break-even calculations are mathematical simulations derived exclusively from user-supplied assumptions. They do not constitute financial advice, performance guarantees, or formal investment prospectuses.";

  return {
    initialSetupCost,
    totalMonthlyExpenses,
    totalMonthlyRevenues,
    netMonthlyBurn,
    effectiveCashBalance,
    runwayMonths,
    breakEvenMonthlyRevenue: totalMonthlyExpenses,
    breakEvenCustomers,
    contributionMarginPerUnit,
    formulas,
    disclaimer,
  };
}
