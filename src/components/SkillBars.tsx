import { useEffect, useMemo, useRef, useState } from 'react';
import { skills, tierConfig, type Skill, type SkillTier } from '../lib/data';

// Deterministic pseudo-random from string seed
function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const TIER_STYLE: Record<SkillTier, { r: number; fill: string; stroke: string; glow: string; pulse: boolean }> = {
  core: {
    r: 22,
    fill: 'rgba(34, 211, 238, 0.25)',
    stroke: '#22d3ee',
    glow: 'rgba(34, 211, 238, 0.5)',
    pulse: true,
  },
  proficient: {
    r: 16,
    fill: 'rgba(74, 222, 128, 0.2)',
    stroke: '#4ade80',
    glow: 'rgba(74, 222, 128, 0.35)',
    pulse: false,
  },
  familiar: {
    r: 11,
    fill: 'rgba(148, 163, 184, 0.15)',
    stroke: '#94a3b8',
    glow: 'rgba(148, 163, 184, 0.2)',
    pulse: false,
  },
};

const CATEGORY_CLUSTERS: Record<string, { cx: number; cy: number }> = {
  Backend:  { cx: 0.25, cy: 0.30 },
  Frontend: { cx: 0.75, cy: 0.28 },
  Database: { cx: 0.20, cy: 0.72 },
  DevOps:   { cx: 0.52, cy: 0.68 },
  Tools:    { cx: 0.80, cy: 0.72 },
};

type NodeData = Skill & { x: number; y: number; style: typeof TIER_STYLE.core };

function layoutNodes(w: number, h: number): NodeData[] {
  const pad = 40;
  const usableW = w - pad * 2;
  const usableH = h - pad * 2;

  return skills.map((s) => {
    const cluster = CATEGORY_CLUSTERS[s.category] || { cx: 0.5, cy: 0.5 };
    const hash = hashStr(s.name);
    const angle = ((hash % 360) / 360) * Math.PI * 2;
    const spread = 35 + (hash % 40);
    const x = pad + cluster.cx * usableW + Math.cos(angle) * spread;
    const y = pad + cluster.cy * usableH + Math.sin(angle) * spread;
    return { ...s, x, y, style: TIER_STYLE[s.tier] };
  });
}

function getEdges(nodes: NodeData[]): [number, number][] {
  const edges: [number, number][] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (nodes[i].category === nodes[j].category) {
        edges.push([i, j]);
      }
    }
  }
  return edges;
}

export default function SkillGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 500, h: 400 });
  const [hovered, setHovered] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      setSize({ w: width, h: Math.max(340, width * 0.72) });
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setVisible(true)),
      { threshold: 0.15 },
    );
    io.observe(containerRef.current);
    return () => io.disconnect();
  }, []);

  const nodes = useMemo(() => layoutNodes(size.w, size.h), [size.w, size.h]);
  const edges = useMemo(() => getEdges(nodes), [nodes]);

  const hoveredNode = hovered !== null ? nodes[hovered] : null;

  return (
    <div ref={containerRef} className="relative w-full select-none">
      <svg
        width={size.w}
        height={size.h}
        viewBox={`0 0 ${size.w} ${size.h}`}
        className="block"
      >
        <defs>
          <filter id="node-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Edges */}
        {edges.map(([a, b], i) => {
          const na = nodes[a];
          const nb = nodes[b];
          const isActive = hovered === a || hovered === b;
          return (
            <line
              key={`e-${i}`}
              x1={na.x}
              y1={na.y}
              x2={nb.x}
              y2={nb.y}
              className="transition-all duration-500"
              stroke={isActive ? na.style.stroke : 'currentColor'}
              strokeWidth={isActive ? 1.5 : 0.6}
              style={{
                opacity: visible ? (isActive ? 0.7 : 0.15) : 0,
                transition: `opacity 800ms ease ${i * 15}ms, stroke 300ms, stroke-width 300ms`,
                color: 'var(--edge-color)',
              }}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((n, i) => {
          const isHovered = hovered === i;
          const r = isHovered ? n.style.r + 4 : n.style.r;
          return (
            <g
              key={n.name}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="cursor-pointer"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'none' : 'scale(0)',
                transformOrigin: `${n.x}px ${n.y}px`,
                transition: `opacity 600ms ease ${i * 50}ms, transform 600ms ease ${i * 50}ms`,
              }}
            >
              {/* Glow ring */}
              <circle
                cx={n.x}
                cy={n.y}
                r={r + 4}
                fill="none"
                stroke={n.style.stroke}
                strokeWidth={isHovered ? 1.5 : 0.5}
                opacity={isHovered ? 0.5 : 0.15}
                className="transition-all duration-300"
              />
              {/* Main circle */}
              <circle
                cx={n.x}
                cy={n.y}
                r={r}
                fill={n.style.fill}
                stroke={n.style.stroke}
                strokeWidth={isHovered ? 2 : 1}
                filter="url(#node-glow)"
                className="transition-all duration-300"
              >
                {n.style.pulse && (
                  <animate
                    attributeName="r"
                    values={`${n.style.r};${n.style.r + 2};${n.style.r}`}
                    dur="3s"
                    repeatCount="indefinite"
                  />
                )}
              </circle>
              {/* Label (always visible for core, on hover for others) */}
              {(n.tier === 'core' || isHovered) && (
                <text
                  x={n.x}
                  y={n.y + r + 14}
                  textAnchor="middle"
                  className="fill-ink-700 dark:fill-ink-200 text-[10px] font-mono pointer-events-none transition-opacity duration-300"
                  style={{ opacity: visible ? 1 : 0 }}
                >
                  {n.name}
                </text>
              )}
            </g>
          );
        })}

        {/* Category labels */}
        {Object.entries(CATEGORY_CLUSTERS).map(([cat, pos]) => (
          <text
            key={cat}
            x={40 + pos.cx * (size.w - 80)}
            y={20 + pos.cy * (size.h - 80) - 50}
            textAnchor="middle"
            className="fill-ink-300 dark:fill-ink-600 text-[9px] font-mono uppercase tracking-widest pointer-events-none"
            style={{
              opacity: visible ? 0.7 : 0,
              transition: 'opacity 1s ease 300ms',
            }}
          >
            {cat}
          </text>
        ))}
      </svg>

      {/* CSS var for edge color that respects dark mode */}
      <style>{`
        :root { --edge-color: #cbd5e1; }
        .dark { --edge-color: #334155; }
      `}</style>

      {/* Hover tooltip */}
      {hoveredNode && (
        <div
          className="absolute pointer-events-none z-10 px-3 py-2 rounded-lg border
            border-ink-200 dark:border-ink-700 bg-white/95 dark:bg-ink-900/95
            backdrop-blur shadow-lg font-mono text-xs transition-opacity duration-150"
          style={{
            left: Math.min(hoveredNode.x, size.w - 140),
            top: Math.max(hoveredNode.y - 50, 8),
          }}
        >
          <div className="font-semibold text-ink-900 dark:text-ink-50">{hoveredNode.name}</div>
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: hoveredNode.style.stroke }}
            />
            <span style={{ color: hoveredNode.style.stroke }}>
              {tierConfig[hoveredNode.tier].label}
            </span>
            <span className="text-ink-400 dark:text-ink-500">·</span>
            <span className="text-ink-500 dark:text-ink-400">{hoveredNode.category}</span>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-3 font-mono text-[10px] sm:text-xs text-ink-400 dark:text-ink-500">
        {(['core', 'proficient', 'familiar'] as SkillTier[]).map((t) => (
          <span key={t} className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: TIER_STYLE[t].stroke, boxShadow: `0 0 4px ${TIER_STYLE[t].glow}` }}
            />
            {tierConfig[t].label}
          </span>
        ))}
      </div>
    </div>
  );
}
