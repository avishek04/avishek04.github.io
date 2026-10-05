import type { SkillEvidenceKind, SkillMapItem } from "@/content/portfolio";

export const skillEvidenceWeights: Record<SkillEvidenceKind, number> = {
  Experience: 4,
  Project: 2,
  Course: 1,
};

export function skillUsageScore(skill: SkillMapItem): number {
  return skill.evidence.reduce(
    (score, evidence) => score + skillEvidenceWeights[evidence.kind],
    0,
  );
}

export function skillBubbleSize(
  skill: SkillMapItem,
  minimumScore: number,
  maximumScore: number,
): number {
  const minimumSize = 7.25;
  const maximumSize = 11.25;
  const range = maximumScore - minimumScore;

  if (range <= 0) return (minimumSize + maximumSize) / 2;

  const normalizedScore = (skillUsageScore(skill) - minimumScore) / range;
  return minimumSize + normalizedScore * (maximumSize - minimumSize);
}
