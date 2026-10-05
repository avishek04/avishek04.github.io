"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
} from "react";
import type { SkillMapItem } from "@/content/portfolio";
import {
  createSkillEvidenceLayout,
  createSkillNetworkEdges,
  createSkillNetworkLayout,
  displaceSkillNetwork,
} from "@/lib/skill-network";
import { skillUsageScore } from "@/lib/skills";

type SkillMapProps = {
  skills: SkillMapItem[];
};

const skillColorIndexes = [1, 2, 3, 4, 5, 1, 2, 6, 3, 4, 5, 2, 6, 1];

function handleNetworkBlur(
  event: FocusEvent<HTMLDivElement>,
  close: () => void,
) {
  if (!event.currentTarget.contains(event.relatedTarget)) close();
}

export function SkillMap({ skills }: SkillMapProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [stageWidth, setStageWidth] = useState<number | null>(null);
  const [activeSkillId, setActiveSkillId] = useState<string | null>(null);

  function cancelScheduledClose() {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  }

  function scheduleClose() {
    cancelScheduledClose();
    closeTimerRef.current = setTimeout(() => setActiveSkillId(null), 900);
  }

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const updateWidth = () => {
      const width = Math.round(stage.getBoundingClientRect().width);
      if (width > 0) setStageWidth((current) => (current === width ? current : width));
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(stage);
    return () => {
      observer.disconnect();
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const network = useMemo(() => {
    if (!stageWidth) return null;

    const base = createSkillNetworkLayout(skills, stageWidth);
    const activeIndex = skills.findIndex((skill) => skill.id === activeSkillId);
    const activeSkill = activeIndex >= 0 ? skills[activeIndex] : null;
    const evidence = activeSkill
      ? createSkillEvidenceLayout(
          base.nodes[activeIndex],
          activeSkill.evidence.length,
          stageWidth,
          base.height,
        )
      : [];
    const nodes = activeSkill
      ? displaceSkillNetwork(
          base.nodes,
          activeIndex,
          evidence,
          stageWidth,
          base.height,
        )
      : base.nodes;

    return {
      activeIndex,
      activeSkill,
      evidence,
      height: base.height,
      nodes,
      edges: createSkillNetworkEdges(nodes),
    };
  }, [activeSkillId, skills, stageWidth]);

  return (
    <div
      ref={stageRef}
      className="skill-network"
      style={network ? { height: `${network.height}px` } : undefined}
      aria-busy={!network}
      onMouseLeave={() => {
        cancelScheduledClose();
        setActiveSkillId(null);
      }}
      onBlurCapture={(event) =>
        handleNetworkBlur(event, () => setActiveSkillId(null))
      }
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          const activeButton = event.currentTarget.querySelector<HTMLButtonElement>(
            `[data-skill-id="${activeSkillId}"]`,
          );
          setActiveSkillId(null);
          activeButton?.focus();
        }
      }}
    >
      {network && stageWidth ? (
        <>
          <svg
            className="skill-network-lines"
            viewBox={`0 0 ${stageWidth} ${network.height}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {network.edges.map((edge) => {
              const source = network.nodes[edge.source];
              const target = network.nodes[edge.target];
              const depth = (source.depth + target.depth) / 2;
              return (
                <line
                  key={`${edge.source}-${edge.target}`}
                  className={edge.strong ? "skill-network-line skill-network-line--strong" : "skill-network-line"}
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  opacity={edge.strong ? 0.24 + depth * 0.22 : 0.05 + depth * 0.1}
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
            {network.activeSkill
              ? network.evidence.map((evidence, index) => {
                  const active = network.nodes[network.activeIndex];
                  return (
                    <line
                      key={`evidence-${index}`}
                      className="skill-network-line skill-network-line--evidence"
                      x1={active.x}
                      y1={active.y}
                      x2={evidence.x}
                      y2={evidence.y}
                      vectorEffect="non-scaling-stroke"
                    />
                  );
                })
              : null}
          </svg>

          <ul
            className="skill-network-nodes"
            aria-label="Interactive network of skills and supporting evidence"
          >
            {network.nodes.map((node, index) => {
              const skill = skills[index];
              const score = skillUsageScore(skill);
              const isActive = network.activeIndex === index;
              const colorIndex = skillColorIndexes[index % skillColorIndexes.length];
              const evidenceListId = `skill-evidence-${skill.id}`;

              return (
                <li
                  key={skill.id}
                  className={`skill-network-node${isActive ? " skill-network-node--active" : ""}`}
                  style={
                    {
                      left: `${node.x}px`,
                      top: `${node.y}px`,
                      "--skill-size": `${node.size}px`,
                      "--skill-color": `var(--skill-color-${colorIndex})`,
                      "--skill-ink": `var(--skill-ink-${colorIndex})`,
                      "--skill-depth-layer": `${10 + Math.round(node.depth * 20)}`,
                      "--skill-depth-opacity": `${0.88 + node.depth * 0.12}`,
                    } as CSSProperties
                  }
                  data-skill-node={skill.id}
                  onMouseLeave={scheduleClose}
                >
                  <button
                    type="button"
                    className="skill-bubble"
                    aria-expanded={isActive}
                    aria-controls={evidenceListId}
                    aria-label={`${skill.label}: evidence weight ${score}, with ${skill.evidence.length} supporting items`}
                    data-testid={`skill-bubble-${skill.id}`}
                    data-skill-id={skill.id}
                    onMouseEnter={() => {
                      cancelScheduledClose();
                      setActiveSkillId(skill.id);
                    }}
                    onClick={(event) => {
                      if (event.detail === 0) {
                        setActiveSkillId((current) =>
                          current === skill.id ? null : skill.id,
                        );
                        return;
                      }

                      setActiveSkillId(skill.id);
                    }}
                  >
                    <span className="skill-bubble__category">{skill.category}</span>
                    <span className="skill-bubble__label">{skill.label}</span>
                    <span className="skill-bubble__score">{score}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {network.activeSkill ? (
            <ul
              id={`skill-evidence-${network.activeSkill.id}`}
              className="skill-evidence-nodes"
              aria-label={`Evidence for ${network.activeSkill.label}`}
            >
              {network.activeSkill.evidence.map((evidence, index) => {
                const position = network.evidence[index];
                return (
                  <li
                    key={`${evidence.kind}-${evidence.title}`}
                    className={`skill-evidence-node skill-evidence-node--${evidence.kind.toLowerCase()}`}
                    style={
                      {
                        left: `${position.x}px`,
                        top: `${position.y}px`,
                        "--evidence-size": `${position.radius * 2}px`,
                      } as CSSProperties
                    }
                    onMouseEnter={cancelScheduledClose}
                    onMouseLeave={scheduleClose}
                  >
                    <Link
                      href={evidence.href}
                      className="skill-evidence-bubble"
                      aria-label={`${evidence.kind}: ${evidence.title}`}
                    >
                      <span>{evidence.kind}</span>
                      <strong>{evidence.title}</strong>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : null}

          <p className="sr-only" aria-live="polite">
            {network.activeSkill
              ? `${network.activeSkill.label} evidence expanded. Nearby skills moved aside.`
              : ""}
          </p>
        </>
      ) : (
        <p className="sr-only">Preparing the interactive skill network.</p>
      )}
    </div>
  );
}
