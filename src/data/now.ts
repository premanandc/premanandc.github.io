// A course, workshop or other event shown under Ongoing or Upcoming
export interface Engagement {
  name: string;
  description: string;
  url?: string;
  coverImage?: string;
  coInstructor?: { name: string; url: string };
}

export const now = {
  lastUpdated: '2026-11-18',

  reading: [
    {
      title: 'The AI-Driven Leader',
      author: 'Geoff Woods',
      note: 'Listening to the audiobook',
    },
  ],

  thinkingAbout: [
    'How data ownership disciplines (aggregates, read models, events) apply equally to monoliths and microservices',
    'What "harness engineering" means for AI-assisted development — the skills, hooks, and subagent patterns that make AI tools effective',
    'Whether the economics of cheap coding fundamentally change when teams should and shouldn\'t write code speculatively',
  ],

  offTheClock: [
    'Playing in the tennis cricket league',
    'Following the IPL',
    'Tinkering with Home Assistant for home automation',
  ],

  ongoing: [
    {
      name: 'InfoQ Certified AI-Assisted Engineering Program',
      description: 'A five-week program on building production-grade software with AI coding agents on code you didn\'t write. It started October 19, 2026, and is now in its final week.',
      url: 'https://certification.qconferences.com/ai-assisted-engineering',
      coverImage: '/images/now/infoq-ai-assisted-engineering.jpg',
      coInstructor: { name: 'Zichuan Xiong', url: 'https://www.linkedin.com/in/zichuan-xiong-94aa3b13/' },
    },
  ],

  upcoming: [
    {
      name: 'Effective AI-Native Development with Harness Engineering',
      description: 'A full-day workshop at QCon SF on Friday, November 20, 2026, on harness engineering for AI coding agents in real codebases. Sold out.',
      url: 'https://qconsf.com/training/nov2026/sold-out-effective-ai-native-development-harness-engineering',
      coverImage: '/images/now/qcon-sf-2026-workshop.jpg',
      coInstructor: { name: 'Zichuan Xiong', url: 'https://www.linkedin.com/in/zichuan-xiong-94aa3b13/' },
    },
  ],
};
