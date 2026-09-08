/* Single source of truth for every word on the site. Edit here, nowhere else. */

export const profile = {
  name: 'Vijay Krishna Kudva',
  role: 'Engineering Leader — Platforms & Global Teams',
  pedigree: 'Ex Uber · Myntra · Intuit',
  location: 'Bangalore, India',
  timezone: 'IST · UTC+5:30',
  status: 'Open to Senior Engineering Leadership roles',
  email: 'nvkudva@gmail.com',
  phones: ['+91 96325 44966', '+1 650 772 1555'],
  resume: '/public/resume/Vijay-Krishna-Kudva-Resume.pdf',
  resumeMeta: { size: '98 KB', updated: 'Updated 2026' },

  lede: [
    'Engineering leader with <em>17+ years in technology</em> and 6+ years building and scaling engineering organizations.',
    'I scaled a platform org from 3 to 24+ engineers across the US, India and Brazil, led the integration of Uber’s first GenAI support bot for business customers, and architected platforms serving <em>30,000+ global agents and 14M+ consumers</em>.',
  ],

  personal:
    'Millennial. Bangalore for 17 years, the US for 3. Passionate techie, gadget hoarder, outdoor adventurer, dad — and a future health freak (currently nowhere near it).',
};

export const stats = [
  { v: '17+', k: 'Years in technology' },
  { v: '3→24', k: 'Org scaled, 3 countries' },
  { v: '14M+', k: 'Consumers served' },
  { v: '30k+', k: 'Global agents on my platforms' },
];

/* From the AI-org tenets in his own leadership deck. */
export const tenets = [
  {
    t: 'What can be done by AI should be done by AI',
    d: 'Not a slogan — an allocation rule. Human attention is the scarcest thing in the org, so it goes where judgement is actually required.',
  },
  {
    t: 'Every engineer is a tech lead of AI agents',
    d: 'Multitasking, delegation and review become the core skills. One human directing many coder agents, reviewing their work rather than typing all of it.',
  },
  {
    t: 'Prompting, evals and fine-tuning are the new ops',
    d: 'The same rigour that went into CI, monitoring and on-call now goes into agent evaluation, guardrails and feedback loops.',
  },
  {
    t: 'Guardrails are not optional',
    d: 'Input guardrails for prompt injection, output guardrails against data leaks, tool access control, and a human in the loop where the blast radius is real.',
  },
];

/* Platform work — the things that ran at scale, not the weekend repos. */
export const platforms = [
  {
    name: 'CO Console — Onboarding & Configuration Platform',
    org: 'Uber',
    years: '2018 – 2025',
    body: 'Owned the strategic roadmap for Uber’s business onboarding platform inside the Customer Obsession org. Orchestrated integrations across 12+ business lines and partners — including autonomous mobility partners Motional, WeRide and Waymo.',
    metrics: [
      ['90%', 'less onboarding time'],
      ['50%', 'faster project delivery'],
      ['84%', 'Salesforce licence reduction'],
    ],
  },
  {
    name: 'Uber’s first GenAI support bot',
    org: 'Uber',
    years: '2024 – 2025',
    body: 'Led the experimental integration of Uber’s first GenAI-powered support bot for business customers, on the customer-care infrastructure.',
    metrics: [['1st', 'GenAI bot for B2B support']],
  },
  {
    name: 'Global UI Platform Modernization',
    org: 'Uber',
    years: '2020 – 2023',
    body: 'Led 16+ engineers through the modernization of Uber’s complete Customer Care UI platform, and built the GraphQL + RPC middleware layer connecting UI to most of Uber’s service layers.',
    metrics: [
      ['4wk → 5d', 'widget development'],
      ['80%+', 'reduction in build time'],
    ],
  },
  {
    name: 'BlissNxt — Next-Gen Customer Care UI',
    org: 'Uber',
    years: '2019 – 2021',
    body: 'Built Uber’s next-generation Customer Care UI serving 30,000+ global agents on millions of tickets, plus the Blis mosaic component library that later seeded multiple CO apps.',
    metrics: [
      ['3×', 'faster loads'],
      ['40%', 'faster ticket resolution'],
    ],
  },
  {
    name: 'Myntra PWA',
    org: 'Myntra',
    years: '2016 – 2018',
    body: 'Architected Myntra’s Progressive Web App from scratch — an instant-loading, app-like mobile web experience built for 3G India, without compromising load time or SEO.',
    metrics: [
      ['37%', 'conversion lift'],
      ['100k → 14M', 'monthly users'],
      ['71%', 'smaller JS bundles'],
    ],
  },
  {
    name: 'Unity — Myntra’s enterprise UI framework',
    org: 'Myntra',
    years: '2014 – 2018',
    body: 'A from-scratch React framework: template architecture, smart component library, thematic engine, and a configuration-driven UI model that let teams launch apps in hours instead of months.',
    metrics: [
      ['50+', 'internal apps powered'],
      ['8wk → 7d', 'app delivery cycle'],
    ],
  },
];

/* Public GitHub repos. Descriptions marked `draft: true` are my inference —
   rewrite them in your own words. Everything else came from GitHub itself. */
/* `deployUrl` drives both the QR code and the screenshot. `status`:
   live | no-deployment | broken-deployment | not-web.
   Descriptions below were rewritten from the actual running apps, except
   where `draft: true` still marks an inference. */
export const projects = [
  {
    name: 'SmartFin', title: 'SmartFin', lang: 'TypeScript', updated: '2026-08-27',
    private: true, status: 'live',
    deployUrl: 'https://smartfin.nvkudva.workers.dev',
    shot: '/public/shots/smartfin.jpg',
    desc: 'Impact intelligence for financial teams. Role-based workspaces — relationship manager, analyst, auditor — each seeing the same portfolio through the lens their job actually needs.',
  },
  {
    name: 'Smart-News', title: 'SmartNews', lang: 'TypeScript', updated: '2026-09-08',
    status: 'live',
    deployUrl: 'https://smartnews.nvkudva.workers.dev',
    shot: '/public/shots/smart-news.jpg',
    desc: 'A news reader that clusters one story across every outlet covering it — eight sources collapsed into a single card with a neutral summary, filtered by locality rather than by outrage.',
  },
  {
    name: 'bhagavad-geeta', title: 'Bhagavad Geeta', lang: 'TypeScript', updated: '2026-09-07',
    status: 'live',
    deployUrl: 'https://bhagavad-geeta.nvkudva.workers.dev',
    shot: '/public/shots/bhagavad-geeta.jpg',
    desc: 'All 18 chapters in Devanagari with English, Kannada and Telugu alongside. Verse search, a daily verse, adjustable reading size — built to be studied, not skimmed.',
  },
  {
    name: 'AgentOS', title: 'AgentOS', lang: 'TypeScript', updated: '2026-09-07',
    status: 'broken-deployment',
    deployUrl: 'https://agentos-cx9.pages.dev',
    shot: '/public/shots/agentos.jpg',
    desc: 'Atrium — a desktop for running teams of agents. One room per function, each with a lead agent delegating to the rest, a dock of tools they share, and a single bar you talk to. Twenty agents, and you watch the work land.',
  },
  {
    name: 'gym-budy-claude', title: 'Gym Buddy', lang: 'TypeScript', updated: '2026-09-07',
    status: 'live',
    deployUrl: 'https://gymbuddy-600845087494.us-west1.run.app/',
    host: 'Google Cloud Run',
    shot: '/public/shots/gym-buddy.jpg',
    desc: 'AI-powered gym exercise tracker with a glass UI, personalized weekly plans via Gemini, and an AI coach chatbot.',
  },
  {
    name: 'AI-Doctor', title: 'CityCare — AI Doctor', lang: 'TypeScript', updated: '2026-09-08',
    status: 'live',
    deployUrl: 'https://ai-doctor-8ai.pages.dev',
    shot: '/public/shots/ai-doctor.jpg',
    desc: 'A hospital-branded virtual visit. No intake forms — you talk to Dr. Mira, and a licensed doctor reviews every plan before it reaches the patient.',
  },
  {
    name: 'Sahay', title: 'Sahay', lang: 'TypeScript', updated: '2026-09-08',
    status: 'no-deployment', draft: true,
    desc: 'An assistant built around help-seeking — Sahay is Sanskrit for support.',
  },
  {
    name: 'SuperVoiceBoard', title: 'SuperVoiceBoard', lang: 'Kotlin', updated: '2026-09-07',
    license: 'GPL-3.0', status: 'not-web',
    desc: 'Voice-first Android keyboard: HeliBoard’s typing engine with on-device voice intelligence.',
  },
  {
    name: 'ask-my-brain', title: 'Ask My Brain', lang: 'HTML', updated: '2026-09-07',
    status: 'no-deployment', draft: true,
    desc: 'A personal RAG surface — ask questions against your own accumulated notes and documents.',
  },
];

export const experience = [
  {
    org: 'AI & Tech Enthusiast', title: 'Planned break — going deep on applied AI',
    years: 'May 2025 – Present', where: 'India',
    points: [
      'Hands-on with modern AI engineering — LLM integration, multi-agent systems, AI-assisted development.',
      'Building the AI-forward engineering workflows every org will need to adopt.',
    ],
  },
  {
    org: 'Uber', title: 'Engineering Manager II', years: 'Dec 2018 – May 2025', where: 'California, USA',
    points: [
      'Scaled the org from 3 to 24+ engineers across the US, India and Brazil; onboarded 2 engineering managers and their 14-engineer teams into one cross-geo pod structure.',
      'Spearheaded the CO Console onboarding and configuration platform, cutting new-business onboarding time by up to 90%.',
      'Drove the Salesforce → CO migration, an 84% licensing reduction saving millions from 2024 onward.',
      'Led conversational channel platform work across Chat, WhatsApp and Email.',
    ],
  },
  {
    org: 'Uber', title: 'Engineering Manager I · Senior Software Engineer', years: '2018 – 2021', where: 'Bangalore, India',
    points: [
      'Led 16+ engineers on the Customer Care UI platform modernization across multiple apps.',
      'Built BlissNxt serving 30,000+ global agents — 3× faster loads, 40% faster ticket resolution.',
      'Cultivated a cross-org UI community with discussion forums and feedback loops across Uber India.',
    ],
  },
  {
    org: 'Myntra', title: 'Frontend Architect · Senior Software Engineer', years: 'Jan 2014 – Dec 2018', where: 'Bangalore, India',
    points: [
      'Architected Myntra’s PWA — 37% conversion lift, 100K to 14M monthly users, 3× faster loads, 71% smaller JS bundles.',
      'Partnered with Google to rebuild the site on AMP in 7 days, driving a 12% revenue increase — showcased on stage at Google I/O 2017.',
      'Engineered Unity, the framework that standardized development across 50+ internal applications.',
    ],
  },
  {
    org: 'Intuit', title: 'Senior Software Engineer', years: 'Jan 2008 – Dec 2013', where: 'Bangalore, India',
    points: [
      'Engineered a cross-platform hybrid UI framework powering a banking solution across web, native Android and iOS in the QuickBooks ecosystem.',
      'Youngest recipient of the Intuit India Innovation Award.',
    ],
  },
];

export const strengths = {
  Leadership: ['Org design & scaling', 'Platform strategy & architecture', 'GenAI adoption', 'Cross-geo execution', 'Leadership development', 'Operational excellence', 'Stakeholder management'],
  Technical: ['JavaScript', 'React', 'Node.js', 'GraphQL', 'Web architecture', 'PWA', 'RPC', 'Microservices', 'Java'],
};

export const speaking = [
  { y: '2017', t: 'Google I/O — Myntra’s AMP implementation, showcased on stage', tag: 'Keynote' },
  { y: '2018', t: 'Google AMP Roadshow, Bangalore — keynote on AMP architecture', tag: 'Keynote' },
  { y: '2017', t: 'Fragments Android Conference — Building Practical PWAs at Scale', tag: 'Talk' },
  { y: '2018', t: 'Flipkart SlashN — the Myntra web technology evolution', tag: 'Talk' },
  { y: '2017', t: 'Google Hack Day — Best Progressive Web App award, Gurugram', tag: 'Award' },
  { y: '2010', t: 'Intuit India Innovation Award', tag: 'Award' },
];

export const writing = [
  { t: 'Myntra’s PWA Architecture', d: 'Sep 2018', u: 'https://medium.com/@nvkudva' },
  { t: 'How we built Unity — crafting Myntra’s enterprise UI platform in React', d: 'Sep 2018', u: 'https://medium.com/@nvkudva' },
  { t: 'Micro Apps — building block of Myntra’s scalable UI architecture', d: 'Sep 2018', u: 'https://medium.com/@nvkudva' },
  { t: 'We built Myntra’s PWA from scratch and here are the results', d: 'Jan 2018', u: 'https://medium.com/@nvkudva' },
  { t: 'Myntra’s Web UI journey — AMP and PWA', d: 'Jan 2018', u: 'https://medium.com/@nvkudva' },
];

export const education = [
  { d: 'Master of Computer Applications', o: 'PES University, Bangalore', y: '2005 – 2008' },
  { d: 'B.Sc. Computer Science, Electronics & Mathematics', o: 'Mangalore University', y: '2002 – 2005' },
];

export const socials = [
  { n: 'GitHub', h: '@nvkudva', u: 'https://github.com/nvkudva', i: 'github' },
  { n: 'LinkedIn', h: 'in/nvkudva', u: 'https://www.linkedin.com/in/nvkudva/', i: 'linkedin' },
  { n: 'Medium', h: '@nvkudva', u: 'https://medium.com/@nvkudva', i: 'medium' },
  { n: 'Email', h: 'nvkudva@gmail.com', u: 'mailto:nvkudva@gmail.com', i: 'mail' },
  { n: 'Résumé', h: 'PDF · 98 KB', u: '/public/resume/Vijay-Krishna-Kudva-Resume.pdf', i: 'doc' },
];

export const icons = {
  github: 'M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38v-1.33C3.8 14.36 3.33 12.9 3.33 12.9c-.36-.92-.89-1.17-.89-1.17-.72-.5.06-.49.06-.49.8.06 1.22.82 1.22.82.71 1.22 1.87.87 2.33.66.07-.52.28-.87.5-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 014 0c1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 008 0z',
  linkedin: 'M3.6 14.4H.6V5.4h3v9zM2.1 4.1a1.75 1.75 0 110-3.5 1.75 1.75 0 010 3.5zM15.4 14.4h-3V9.9c0-1.07-.02-2.44-1.49-2.44-1.5 0-1.72 1.16-1.72 2.36v4.58h-3V5.4h2.88v1.23h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.6v4.73z',
  medium: 'M2.37 4.76a.55.55 0 00-.18-.47L.87 2.69v-.24h4.1l3.17 6.95 2.79-6.95H14.9v.24l-1.13 1.08a.33.33 0 00-.13.32v8.07a.33.33 0 00.13.32l1.1 1.08v.24H9.33v-.24l1.14-1.11c.11-.11.11-.14.11-.32V5.62l-3.18 8.07h-.43L3.28 5.62v5.41a.75.75 0 00.2.62l1.49 1.8v.24H.74v-.24l1.48-1.8a.72.72 0 00.19-.62V4.76z',
  mail: 'M1.5 2h13c.8 0 1.5.7 1.5 1.5v9c0 .8-.7 1.5-1.5 1.5h-13C.7 14 0 13.3 0 12.5v-9C0 2.7.7 2 1.5 2zm6.5 6.2L14.6 3.4H1.4L8 8.2zM1 4.6v7.9L6 8.9 1 4.6zm14 0L10 8.9l5 3.6V4.6zM7 9l-5 3.9h12L9 9l-1 .7L7 9z',
  doc: 'M9 0H3.5A1.5 1.5 0 002 1.5v13A1.5 1.5 0 003.5 16h9a1.5 1.5 0 001.5-1.5V5L9 0zm0 1.5L12.5 5H9V1.5zM4.5 8h7v1h-7V8zm0 2.5h7v1h-7v-1zm0-5h3v1h-3v-1z',
};
