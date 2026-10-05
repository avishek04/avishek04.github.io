import type { SkillMapItem } from "@/content/portfolio";
import { skillBubbleSize, skillUsageScore } from "@/lib/skills";

export type SkillNetworkNode = {
  id: string;
  index: number;
  x: number;
  y: number;
  size: number;
  radius: number;
};

export type SkillEvidencePosition = {
  x: number;
  y: number;
  radius: number;
};

export type SkillNetworkEdge = {
  source: number;
  target: number;
  strong: boolean;
};

type NormalizedPoint = { x: number; y: number };

const widePlacements: NormalizedPoint[] = [
  { x: 0.1, y: 0.18 },
  { x: 0.34, y: 0.12 },
  { x: 0.61, y: 0.2 },
  { x: 0.88, y: 0.13 },
  { x: 0.21, y: 0.4 },
  { x: 0.49, y: 0.44 },
  { x: 0.77, y: 0.36 },
  { x: 0.09, y: 0.65 },
  { x: 0.35, y: 0.6 },
  { x: 0.64, y: 0.7 },
  { x: 0.91, y: 0.59 },
  { x: 0.22, y: 0.86 },
  { x: 0.5, y: 0.82 },
  { x: 0.79, y: 0.89 },
];

const mediumPlacements: NormalizedPoint[] = [
  { x: 0.15, y: 0.1 },
  { x: 0.5, y: 0.08 },
  { x: 0.84, y: 0.13 },
  { x: 0.25, y: 0.28 },
  { x: 0.62, y: 0.25 },
  { x: 0.87, y: 0.35 },
  { x: 0.12, y: 0.45 },
  { x: 0.45, y: 0.47 },
  { x: 0.8, y: 0.52 },
  { x: 0.25, y: 0.65 },
  { x: 0.62, y: 0.67 },
  { x: 0.88, y: 0.76 },
  { x: 0.17, y: 0.86 },
  { x: 0.54, y: 0.89 },
];

const narrowPlacements: NormalizedPoint[] = [
  { x: 0.26, y: 0.07 },
  { x: 0.73, y: 0.1 },
  { x: 0.34, y: 0.22 },
  { x: 0.75, y: 0.25 },
  { x: 0.24, y: 0.37 },
  { x: 0.68, y: 0.39 },
  { x: 0.32, y: 0.51 },
  { x: 0.76, y: 0.54 },
  { x: 0.23, y: 0.66 },
  { x: 0.67, y: 0.68 },
  { x: 0.34, y: 0.8 },
  { x: 0.77, y: 0.82 },
  { x: 0.22, y: 0.93 },
  { x: 0.62, y: 0.92 },
];

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum);
}

function distanceBetween(first: SkillNetworkNode, second: SkillNetworkNode) {
  return Math.hypot(second.x - first.x, second.y - first.y);
}

function placementsForWidth(width: number): NormalizedPoint[] {
  if (width < 520) return narrowPlacements;
  if (width < 900) return mediumPlacements;
  return widePlacements;
}

export function skillNetworkStageHeight(width: number): number {
  if (width < 520) return 1500;
  if (width < 900) return 1160;
  return 800;
}

function settleCollisions(
  nodes: SkillNetworkNode[],
  width: number,
  height: number,
  gap: number,
): SkillNetworkNode[] {
  const settled = nodes.map((node) => ({ ...node }));

  for (let iteration = 0; iteration < 48; iteration += 1) {
    for (let firstIndex = 0; firstIndex < settled.length; firstIndex += 1) {
      for (let secondIndex = firstIndex + 1; secondIndex < settled.length; secondIndex += 1) {
        const first = settled[firstIndex];
        const second = settled[secondIndex];
        let dx = second.x - first.x;
        let dy = second.y - first.y;
        let distance = Math.hypot(dx, dy);
        const minimumDistance = first.radius + second.radius + gap;

        if (distance >= minimumDistance) continue;
        if (distance < 0.001) {
          dx = firstIndex % 2 === 0 ? 1 : -1;
          dy = secondIndex % 2 === 0 ? 1 : -1;
          distance = Math.SQRT2;
        }

        const overlap = minimumDistance - distance;
        const pushX = (dx / distance) * overlap * 0.52;
        const pushY = (dy / distance) * overlap * 0.52;
        first.x -= pushX;
        first.y -= pushY;
        second.x += pushX;
        second.y += pushY;
      }
    }

    for (const node of settled) {
      const padding = node.radius + 8;
      node.x = clamp(node.x, padding, width - padding);
      node.y = clamp(node.y, padding, height - padding);
    }
  }

  return settled;
}

export function createSkillNetworkLayout(
  skills: SkillMapItem[],
  width: number,
): { height: number; nodes: SkillNetworkNode[] } {
  const height = skillNetworkStageHeight(width);
  const scores = skills.map(skillUsageScore);
  const minimumScore = Math.min(...scores);
  const maximumScore = Math.max(...scores);
  const scale = width < 520 ? 0.72 : width < 900 ? 0.88 : 1;
  const placements = placementsForWidth(width);
  const nodes = skills.map((skill, index) => {
    const size = skillBubbleSize(skill, minimumScore, maximumScore) * 16 * scale;
    const placement = placements[index % placements.length];

    return {
      id: skill.id,
      index,
      x: placement.x * width,
      y: placement.y * height,
      size,
      radius: size / 2,
    };
  });

  return {
    height,
    nodes: settleCollisions(nodes, width, height, width < 520 ? 12 : 20),
  };
}

export function createSkillEvidenceLayout(
  active: SkillNetworkNode,
  evidenceCount: number,
  width: number,
  height: number,
): SkillEvidencePosition[] {
  const evidenceRadius = width < 520 ? 35 : 40;
  const distance = active.radius + evidenceRadius + (width < 520 ? 12 : 16);
  const edgeClearance = distance + evidenceRadius + 8;
  const hasFullCircleSpace =
    active.x >= edgeClearance &&
    active.x <= width - edgeClearance &&
    active.y >= edgeClearance &&
    active.y <= height - edgeClearance;
  const directionToCenter = Math.atan2(
    height / 2 - active.y,
    width / 2 - active.x,
  );

  return Array.from({ length: evidenceCount }, (_, index) => {
    let angle: number;

    if (hasFullCircleSpace) {
      angle = -Math.PI / 2 + (index * Math.PI * 2) / evidenceCount;
    } else if (evidenceCount === 1) {
      angle = directionToCenter;
    } else {
      angle =
        directionToCenter -
        Math.PI / 2 +
        (index * Math.PI) / (evidenceCount - 1);
    }

    return {
      x: clamp(
        active.x + Math.cos(angle) * distance,
        evidenceRadius + 8,
        width - evidenceRadius - 8,
      ),
      y: clamp(
        active.y + Math.sin(angle) * distance,
        evidenceRadius + 8,
        height - evidenceRadius - 8,
      ),
      radius: evidenceRadius,
    };
  });
}

export function displaceSkillNetwork(
  baseNodes: SkillNetworkNode[],
  activeIndex: number,
  evidence: SkillEvidencePosition[],
  width: number,
  height: number,
): SkillNetworkNode[] {
  const nodes = baseNodes.map((node) => ({ ...node }));
  const maximumDisplacement = width < 520 ? 88 : 132;

  for (let iteration = 0; iteration < 28; iteration += 1) {
    for (let index = 0; index < nodes.length; index += 1) {
      if (index === activeIndex) continue;
      const node = nodes[index];

      for (let evidenceIndex = 0; evidenceIndex < evidence.length; evidenceIndex += 1) {
        const obstacle = evidence[evidenceIndex];
        let dx = node.x - obstacle.x;
        let dy = node.y - obstacle.y;
        let distance = Math.hypot(dx, dy);
        const minimumDistance = node.radius + obstacle.radius + 16;

        if (distance >= minimumDistance) continue;
        if (distance < 0.001) {
          const angle = ((index + evidenceIndex) * Math.PI * 2) / nodes.length;
          dx = Math.cos(angle);
          dy = Math.sin(angle);
          distance = 1;
        }

        const overlap = minimumDistance - distance;
        node.x += (dx / distance) * overlap * 0.6;
        node.y += (dy / distance) * overlap * 0.6;
      }
    }

    for (let firstIndex = 0; firstIndex < nodes.length; firstIndex += 1) {
      for (let secondIndex = firstIndex + 1; secondIndex < nodes.length; secondIndex += 1) {
        const first = nodes[firstIndex];
        const second = nodes[secondIndex];
        let dx = second.x - first.x;
        let dy = second.y - first.y;
        let distance = Math.hypot(dx, dy);
        const minimumDistance = first.radius + second.radius + 12;

        if (distance >= minimumDistance) continue;
        if (distance < 0.001) {
          dx = 1;
          dy = firstIndex % 2 === 0 ? 1 : -1;
          distance = Math.SQRT2;
        }

        const overlap = minimumDistance - distance;
        const pushX = (dx / distance) * overlap * 0.52;
        const pushY = (dy / distance) * overlap * 0.52;

        if (firstIndex === activeIndex) {
          second.x += pushX * 2;
          second.y += pushY * 2;
        } else if (secondIndex === activeIndex) {
          first.x -= pushX * 2;
          first.y -= pushY * 2;
        } else {
          first.x -= pushX;
          first.y -= pushY;
          second.x += pushX;
          second.y += pushY;
        }
      }
    }

    for (let index = 0; index < nodes.length; index += 1) {
      if (index === activeIndex) continue;
      const node = nodes[index];
      const base = baseNodes[index];
      const offsetX = node.x - base.x;
      const offsetY = node.y - base.y;
      const offset = Math.hypot(offsetX, offsetY);

      if (offset > maximumDisplacement) {
        node.x = base.x + (offsetX / offset) * maximumDisplacement;
        node.y = base.y + (offsetY / offset) * maximumDisplacement;
      }

      const padding = node.radius + 8;
      node.x = clamp(node.x, padding, width - padding);
      node.y = clamp(node.y, padding, height - padding);
    }
  }

  nodes[activeIndex] = { ...baseNodes[activeIndex] };
  return nodes;
}

export function createSkillNetworkEdges(
  nodes: SkillNetworkNode[],
): SkillNetworkEdge[] {
  const strongEdges = new Set<string>();

  for (const node of nodes) {
    const nearest = nodes
      .filter((candidate) => candidate.index !== node.index)
      .sort((first, second) =>
        distanceBetween(node, first) - distanceBetween(node, second),
      )
      .slice(0, 3);

    for (const neighbor of nearest) {
      const source = Math.min(node.index, neighbor.index);
      const target = Math.max(node.index, neighbor.index);
      strongEdges.add(`${source}-${target}`);
    }
  }

  const edges: SkillNetworkEdge[] = [];
  for (let source = 0; source < nodes.length; source += 1) {
    for (let target = source + 1; target < nodes.length; target += 1) {
      edges.push({
        source,
        target,
        strong: strongEdges.has(`${source}-${target}`),
      });
    }
  }

  return edges;
}
