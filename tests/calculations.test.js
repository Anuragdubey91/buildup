const test = require("node:test");
const assert = require("node:assert/strict");

// Calculation test logic for financial runway and break-even
function calculateRunway(initialCash, funding, setupCosts, monthlyExpenses, monthlyRevenues) {
  const effectiveCash = initialCash + funding - setupCosts;
  const netMonthlyBurn = monthlyExpenses - monthlyRevenues;

  if (netMonthlyBurn <= 0) {
    return "Profitable";
  }
  if (effectiveCash <= 0) {
    return 0;
  }
  return Math.floor((effectiveCash / netMonthlyBurn) * 10) / 10;
}

function calculateBreakEvenUnits(fixedMonthlyExpenses, unitPrice, variableCostPerUnit) {
  const margin = unitPrice - variableCostPerUnit;
  if (margin <= 0) return null;
  return Math.ceil(fixedMonthlyExpenses / margin);
}

// Equity normalization
function calculateTestEquity(founders, optionPool = 10) {
  const availablePool = 100 - optionPool;
  const totalWeight = founders.reduce((acc, f) => acc + f.weight, 0);
  const shares = founders.map((f) => {
    const raw = (f.weight / totalWeight) * availablePool;
    return Math.round(raw * 10) / 10;
  });
  return { shares, optionPool, totalAllocated: shares.reduce((a, b) => a + b, 0) + optionPool };
}

test("Finance: Accurate runway calculation with setup cost deduction", () => {
  // ₹1,00,000 cash, ₹50,000 funding, ₹30,000 one-time setup costs -> Effective: ₹1,20,000
  // Monthly expenses: ₹25,000, Monthly revenues: ₹5,000 -> Net burn: ₹20,000/month
  // Runway = 1,20,000 / 20,000 = 6.0 months
  const runway = calculateRunway(100000, 50000, 30000, 25000, 5000);
  assert.equal(runway, 6);
});

test("Finance: Cash-flow positive indicates Profitable / Infinite runway", () => {
  // Monthly revenue ₹30,000 > Expenses ₹20,000
  const runway = calculateRunway(50000, 0, 10000, 20000, 30000);
  assert.equal(runway, "Profitable");
});

test("Finance: Break-even unit calculation", () => {
  // Fixed monthly expenses = ₹50,000. Customer pays ₹1,200 with ₹200 variable cost.
  // Contribution margin = ₹1,000.
  // Break-even units = 50,000 / 1,000 = 50 customers.
  const units = calculateBreakEvenUnits(50000, 1200, 200);
  assert.equal(units, 50);
});

test("Equity: Normalizes across multiple founders and respects reserved option pool", () => {
  const founders = [
    { name: "Founder A", weight: 60 },
    { name: "Founder B", weight: 40 },
  ];
  const { shares, optionPool, totalAllocated } = calculateTestEquity(founders, 10);

  // Available pool: 90%. Founder A gets 60% of 90% = 54%, Founder B gets 40% of 90% = 36%
  assert.equal(optionPool, 10);
  assert.equal(shares[0], 54);
  assert.equal(shares[1], 36);
  assert.equal(totalAllocated, 100);
});
