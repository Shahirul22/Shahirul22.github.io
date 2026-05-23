export type SkillTier = 'core' | 'proficient' | 'familiar';

export type Skill = {
  name: string;
  tier: SkillTier;
  category: 'Backend' | 'Frontend' | 'Database' | 'DevOps' | 'Tools';
};

export const skills: Skill[] = [
  // Backend — Core
  { name: 'PHP / Laravel', tier: 'core', category: 'Backend' },
  { name: 'REST APIs', tier: 'core', category: 'Backend' },
  // Backend — Proficient
  { name: 'Bash', tier: 'proficient', category: 'Backend' },
  // Backend — Familiar
  { name: 'C++', tier: 'familiar', category: 'Backend' },
  { name: 'Java', tier: 'familiar', category: 'Backend' },
  { name: 'Python', tier: 'familiar', category: 'Backend' },

  // Frontend — Proficient (junior-to-mid)
  { name: 'JavaScript', tier: 'proficient', category: 'Frontend' },
  { name: 'HTML / CSS', tier: 'proficient', category: 'Frontend' },
  { name: 'Bootstrap', tier: 'proficient', category: 'Frontend' },
  { name: 'Livewire / Alpine', tier: 'proficient', category: 'Frontend' },
  // Frontend — Familiar
  { name: 'React', tier: 'familiar', category: 'Frontend' },

  // Database — Core
  { name: 'MySQL / MariaDB', tier: 'core', category: 'Database' },
  { name: 'PostgreSQL', tier: 'core', category: 'Database' },

  // DevOps — Core
  { name: 'Docker', tier: 'core', category: 'DevOps' },
  { name: 'Linux', tier: 'core', category: 'DevOps' },
  { name: 'Nutanix HCI', tier: 'core', category: 'DevOps' },
  // DevOps — Proficient
  { name: 'GitHub Actions', tier: 'proficient', category: 'DevOps' },

  // Tools — Proficient
  { name: 'Git / GitHub', tier: 'proficient', category: 'Tools' },
  { name: 'Laravel Pest', tier: 'proficient', category: 'Tools' },
  { name: 'Laravel Herd', tier: 'proficient', category: 'Tools' },
  { name: 'AI-assisted dev', tier: 'proficient', category: 'Tools' },
];

// Tier display config
export const tierConfig: Record<SkillTier, { label: string; description: string }> = {
  core: {
    label: 'Core',
    description: 'Daily drivers — architect from scratch, debug blind, ship confidently.',
  },
  proficient: {
    label: 'Proficient',
    description: 'Solid working knowledge — ship production code, occasional docs reference.',
  },
  familiar: {
    label: 'Familiar',
    description: 'Real project experience — can ramp up quickly, not daily use.',
  },
};

export type Experience = {
  company: string;
  role: string;
  period: string;
  location?: string;
  bullets: string[];
  tags: string[];
};

export const experiences: Experience[] = [
  {
    company: 'Nindatech Sdn. Bhd.',
    role: 'Senior Software Developer',
    period: 'Apr 2025 — Present',
    location: 'Penang, Malaysia',
    bullets: [
      'Lead backend development on Eventilla — migrating a live events platform from a legacy PHP framework to Laravel + React.',
      'Optimised a critical DB query — page load 20s → 3s (~85% reduction).',
      'Implemented event-management APIs and rebuilt a lost RBAC system from an early migration phase.',
      'Built an internal CLI tool for automated file/folder mapping and config deployment across projects.',
      'Containerised dev environments with Docker. Practising AI-assisted development workflows.',
    ],
    tags: ['Laravel', 'React', 'PostgreSQL', 'Docker', 'CLI'],
  },
  {
    company: 'Majlis Bandaraya Pulau Pinang (MBPP)',
    role: 'Assistant IT Officer',
    period: 'Oct 2022 — Apr 2025',
    location: 'Penang, Malaysia',
    bullets: [
      'Built and maintained internal web applications tailored to council operations.',
      'Designed and optimised MySQL databases for efficient data access and storage.',
      'Managed web and database servers on Nutanix HCI — setup, monitoring, security.',
      'Bridged communication between technical and non-technical stakeholders on IT project workflows.',
    ],
    tags: ['Laravel', 'MySQL', 'Nutanix', 'Linux'],
  },
  {
    company: 'Aimsity',
    role: 'Programming Trainer',
    period: 'May 2022 — Oct 2022',
    bullets: [
      'Planned, prepared, and delivered structured programming lessons.',
      'Developed project-based learning modules to reinforce coding concepts.',
    ],
    tags: ['Teaching', 'Curriculum'],
  },
];

export type ProjectMeta = {
  slug: string;
  title: string;
  tagline: string;
  stack: string[];
  status: 'Live (private)' | 'Live' | 'Maintenance' | 'Archived';
  highlight: string;
  metrics?: { label: string; value: string }[];
  category: string;
};

export const projects: ProjectMeta[] = [
  {
    slug: 'asset-compliance',
    title: 'Asset Compliance Manager',
    tagline: 'Multi-stage approval and asset tracking system for a government client.',
    stack: ['Laravel 11', 'PHP 8.2+', 'MySQL', 'Oracle OCI8', 'Livewire', 'Bootstrap 5'],
    status: 'Live (private)',
    highlight: 'Six-stage approval workflow across two divisions with strict per-stage visibility, RBAC, and audit trail.',
    metrics: [
      { label: 'Workflow stages', value: '6' },
      { label: 'Built-in roles', value: '6' },
      { label: 'Divisions', value: '2' },
    ],
    category: 'Workflow / Compliance',
  },
  {
    slug: 'hr-management-suite',
    title: 'HR Management Suite',
    tagline: 'Dual-portal HR & administration system for a local government authority.',
    stack: ['Laravel 11', 'PHP 8.3', 'MySQL', 'Vite', 'Bootstrap 5', 'Pest'],
    status: 'Live (private)',
    highlight: 'Two Laravel portals sharing one DB — admin HR + staff self-service — with fully custom RBAC, per-user overrides, and department tenancy.',
    metrics: [
      { label: 'Routes', value: '100+' },
      { label: 'Models', value: '54' },
      { label: 'Modules', value: '7' },
    ],
    category: 'HR / Administration',
  },
  {
    slug: 'eventilla',
    title: 'Eventilla Platform Migration',
    tagline: 'Migrating a live events management platform from legacy PHP MVC to Laravel + React.',
    stack: ['Laravel', 'React', 'PostgreSQL', 'Docker'],
    status: 'Live',
    highlight: 'Reduced a critical page load from ~20s to ~3s by optimising a single hot query path.',
    metrics: [
      { label: 'Load time', value: '20s → 3s' },
    ],
    category: 'SaaS / Migration',
  },
  {
    slug: 'devtooling',
    title: 'Internal Developer Tooling',
    tagline: 'In-house CLI that automates file/folder mapping and config deployment across projects.',
    stack: ['Node.js', 'Bash', 'CLI'],
    status: 'Live (private)',
    highlight: 'Developers edit a local config file to define file/folder mappings, then run a single command to deploy them across any target project.',
    category: 'Internal tooling',
  },
];
