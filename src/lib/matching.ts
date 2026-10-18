import { UserProfileType, CompatibilityResult, CompatibilityFactor } from "@/types";

export function calculateCompatibility(
  userA: UserProfileType,
  userB: UserProfileType
): CompatibilityResult {
  // 1. Complementary Skills Factor (Weight: 30%)
  const technicalKeywords = [
    "engineer",
    "development",
    "developer",
    "react",
    "next.js",
    "python",
    "architecture",
    "backend",
    "frontend",
    "devops",
    "cloud",
    "ai",
  ];
  const businessKeywords = [
    "marketing",
    "growth",
    "sales",
    "finance",
    "financial",
    "accounting",
    "legal",
    "operations",
    "compliance",
    "research",
    "product",
  ];

  const userASkills = userA.skills.map((s) => s.name.toLowerCase());
  const userBSkills = userB.skills.map((s) => s.name.toLowerCase());

  const aIsTech = userASkills.some((s) => technicalKeywords.some((k) => s.includes(k)));
  const aIsBiz = userASkills.some((s) => businessKeywords.some((k) => s.includes(k)));
  const bIsTech = userBSkills.some((s) => technicalKeywords.some((k) => s.includes(k)));
  const bIsBiz = userBSkills.some((s) => businessKeywords.some((k) => s.includes(k)));

  let skillScore = 65;
  const complementarySkills: string[] = [];

  if ((aIsTech && bIsBiz) || (aIsBiz && bIsTech)) {
    skillScore = 94;
    userBSkills.forEach((s) => {
      if (!userASkills.includes(s)) complementarySkills.push(s);
    });
  } else if (aIsTech && bIsTech) {
    skillScore = 75; // Strong co-engineering, but lacks marketing
    complementarySkills.push("Shared Engineering Capability (may need outside commercial support)");
  } else if (aIsBiz && bIsBiz) {
    skillScore = 70; // Two business minds, but lacks tech execution
    complementarySkills.push("Shared Commercial Capability (may need technical contract or co-founder)");
  }

  // 2. Domain Alignment Factor (Weight: 20%)
  const aDomains = (userA.preferredDomains || []).map((d) => d.toLowerCase());
  const bDomains = (userB.preferredDomains || []).map((d) => d.toLowerCase());
  const sharedDomains = aDomains.filter((d) => bDomains.includes(d));

  let domainScore = 40;
  if (sharedDomains.length >= 2) domainScore = 95;
  else if (sharedDomains.length === 1) domainScore = 80;
  else domainScore = 50;

  // 3. Shared Interests & Goals (Weight: 15%)
  const aInterests = (userA.interests || []).map((i) => i.toLowerCase());
  const bInterests = (userB.interests || []).map((i) => i.toLowerCase());
  const sharedInterests = aInterests.filter((i) => bInterests.includes(i));

  let interestsScore = 55;
  if (sharedInterests.length >= 2) interestsScore = 90;
  else if (sharedInterests.length === 1) interestsScore = 75;

  // 4. Role Synergy (Weight: 15%)
  const aRoles = (userA.preferredRoles || []).map((r) => r.toLowerCase());
  const bRoles = (userB.preferredRoles || []).map((r) => r.toLowerCase());
  const roleOverlap = aRoles.filter((r) => bRoles.includes(r));

  let roleScore = 85;
  const potentialFrictions: string[] = [];

  if (roleOverlap.includes("ceo") && aRoles.length === 1 && bRoles.length === 1) {
    roleScore = 50;
    potentialFrictions.push("Both founders primarily target sole CEO position; clarify decision hierarchy early.");
  } else if (
    (aRoles.some((r) => r.includes("cto") || r.includes("tech")) &&
      bRoles.some((r) => r.includes("ceo") || r.includes("product") || r.includes("growth"))) ||
    (bRoles.some((r) => r.includes("cto") || r.includes("tech")) &&
      aRoles.some((r) => r.includes("ceo") || r.includes("product") || r.includes("growth")))
  ) {
    roleScore = 98;
  }

  // 5. Availability & Commitment (Weight: 10%)
  const hoursDiff = Math.abs(userA.weeklyHours - userB.weeklyHours);
  let availabilityScore = 90;
  if (hoursDiff > 20) {
    availabilityScore = 55;
    potentialFrictions.push(`Weekly commitment delta (${userA.weeklyHours}h vs ${userB.weeklyHours}h/week) may cause pacing differences.`);
  } else if (hoursDiff > 10) {
    availabilityScore = 75;
  }

  // 6. Working Style & Collaboration Mode (Weight: 10%)
  let workingStyleScore = 75;
  if (userA.workingStyle === userB.workingStyle) workingStyleScore += 15;
  if (userA.collaborationMode === userB.collaborationMode) workingStyleScore += 10;
  else if (userA.collaborationMode === "in_person" && userB.collaborationMode === "remote") {
    workingStyleScore -= 20;
    potentialFrictions.push("Location mismatch: One prefers in-person while the other prefers fully remote.");
  }
  workingStyleScore = Math.min(100, Math.max(40, workingStyleScore));

  // Compute weighted overall score
  const factors: CompatibilityFactor[] = [
    {
      name: "Complementary Skills",
      score: skillScore,
      weight: 30,
      description: "Balance between technical development and commercial/growth capabilities.",
      matchedItems: complementarySkills.slice(0, 3),
    },
    {
      name: "Domain Alignment",
      score: domainScore,
      weight: 20,
      description: "Overlap in target industries and vertical market focus.",
      matchedItems: sharedDomains,
    },
    {
      name: "Interests & Culture",
      score: interestsScore,
      weight: 15,
      description: "Shared startup interests, problem spaces, and thematic curiosity.",
      matchedItems: sharedInterests,
    },
    {
      name: "Role Synergy",
      score: roleScore,
      weight: 15,
      description: "Harmony between preferred leadership roles (e.g., CTO + CEO/Product).",
      matchedItems: roleOverlap.length > 0 ? [`Shared titles: ${roleOverlap.join(", ")}`] : ["Distinct complementary roles"],
    },
    {
      name: "Time Commitment",
      score: availabilityScore,
      weight: 10,
      description: `Weekly bandwidth alignment (${userA.weeklyHours}h vs ${userB.weeklyHours}h per week).`,
      matchedItems: [`Commitment difference: ${hoursDiff}h/week`],
    },
    {
      name: "Working Style & Location",
      score: workingStyleScore,
      weight: 10,
      description: `Operating cadence (${userA.workingStyle} & ${userB.workingStyle}) and collaboration setup (${userA.collaborationMode} & ${userB.collaborationMode}).`,
      matchedItems: [userA.workingStyle, userA.collaborationMode],
    },
  ];

  const totalWeighted = factors.reduce((sum, f) => sum + f.score * (f.weight / 100), 0);
  const overallScore = Math.round(totalWeighted);

  let rating: "Exceptional" | "Strong" | "Moderate" | "Exploratory" = "Exploratory";
  if (overallScore >= 85) rating = "Exceptional";
  else if (overallScore >= 70) rating = "Strong";
  else if (overallScore >= 55) rating = "Moderate";

  const strengths: string[] = [];
  if (skillScore >= 85) strengths.push("Strong complementary skill balance between technical and commercial roles");
  if (domainScore >= 80) strengths.push(`Shared enthusiasm for ${sharedDomains.join(", ") || "target domains"}`);
  if (roleScore >= 85) strengths.push("Clear role delineation with minimal leadership overlap");
  if (availabilityScore >= 85) strengths.push("Closely matched weekly time investment");

  let recommendation = `Estimated compatibility is ${rating.toLowerCase()} (${overallScore}%). `;
  if (rating === "Exceptional") {
    recommendation += "Skills, roles, and domain interests are well-aligned. Connect to discuss vision and work on a lightweight weekend trial project.";
  } else if (rating === "Strong") {
    recommendation += "High synergy across core dimensions with a few minor differences in working rhythm or time commitment.";
  } else {
    recommendation += "Different backgrounds could provide fresh perspectives, but align early on roles and weekly commitments.";
  }

  return {
    overallScore,
    rating,
    factors,
    strengths,
    complementarySkills,
    sharedDomains,
    potentialFrictions,
    recommendation,
  };
}
