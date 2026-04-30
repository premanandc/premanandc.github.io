export interface Talk {
  title: string;
  event: string;
  date: string;
  description: string;
  url: string;
}

export const talks: Talk[] = [
  {
    title: 'AI-Assisted Development: What Actually Works',
    event: 'Conference Talk',
    date: '2026',
    description: 'Lessons from three real projects on where AI coding tools accelerate delivery — and where they just accelerate rework.',
    url: '/talks/ai-assisted-dev/',
  },
  {
    title: 'Graph-Powered Storyworlds',
    event: 'NODES AI 2026',
    date: '2026',
    description: 'Using Neo4j to keep 1M+ word LitRPG epics coherent with AI — knowledge graphs as narrative immune systems.',
    url: '/talks/graph-powered-storyworlds/',
  },
];
