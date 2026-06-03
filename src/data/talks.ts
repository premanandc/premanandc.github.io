export interface Talk {
  title: string;
  event: string;
  date: string;
  description: string;
  url: string;
  eventUrl?: string;
  videoUrl?: string;
  unlisted?: boolean;
}

export const talks: Talk[] = [
  {
    title: "Your Problem Isn't the Monolith. It's the Data.",
    event: 'LDX3 London 2026',
    date: '2026',
    description: 'Architecture endures when teams align on data lifecycles, not just APIs. A walk through one company that built a disciplined monolith, then decomposed without trauma.',
    url: '/talks/your-problem-isnt-the-monolith/',
    eventUrl: 'https://ldx3.london',
  },
  {
    title: 'AI-Assisted Development: What Actually Works',
    event: 'Arc of AI',
    date: '2026',
    description: 'Lessons from three real projects on where AI coding tools accelerate delivery — and where they just accelerate rework.',
    url: '/talks/ai-assisted-dev/',
    eventUrl: 'https://www.arcofai.com/speaker/b8dcfec104c34a199e5942068bb0f076',
  },
  {
    title: 'Graph-Powered Storyworlds',
    event: 'Neo4J Nodes AI',
    date: '2026',
    description: 'Using Neo4j to keep 1M+ word LitRPG epics coherent with AI — knowledge graphs as narrative immune systems.',
    url: '/talks/graph-powered-storyworlds/',
    eventUrl: 'https://neo4j.com/videos/nodes-ai-2026-graph-powered-storyworlds-using-neo4j-to-keep-1m-word-litrpg-epics-coherent-w-ai/',
    videoUrl: 'https://www.youtube.com/watch?v=S4i6-KZRup8',
  },
];
