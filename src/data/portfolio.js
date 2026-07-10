export const profile = {
  name: 'Akash Yatin Jain',
  shortName: 'Akash Jain',
  title: 'Full-Stack Developer',
  tagline: 'Backend-Focused Full Stack Developer | React • Node • PostgreSQL • Docker',
  avatar: '/avatar.png',
  location: 'Mumbai',
  email: 'aj0881871@gmail.com',
  studentEmail: 'aj0881871@student.sfit.ac.in',
  phone: '+91 7710926977',
  available: 'Available for Internships · Graduating May 2028',
  links: {
    github: 'https://github.com/Akashyatinjain',
    linkedin: 'https://www.linkedin.com/in/akash-yatin-jain',
    leetcode: 'https://leetcode.com/u/Akashyatinjain/',
    portfolio: 'https://profolio-AkashJain.vercel.app/',
  },
};

export const stats = {
  cgpa: '8.50',
  projects: '7+',
  problemsSolved: '180+',
  studentsMentored: '100+',
};

export const achievements = [
  {
    icon: 'trophy',
    label: 'Hackathon Runner-up',
    detail: 'Colloquium SFIT 2026',
  },
  {
    icon: 'users',
    label: 'IEEE Tech Lead',
    detail: 'Mentored 100+ students',
  },
  {
    icon: 'gitBranch',
    label: 'Open Source',
    detail: 'Active GitHub Contributor',
  },
];

export const availableFor = [
  'Internship',
  'Full-Time',
  'Remote',
  'Open Source',
];

export const bio = {
  intro:
    "I'm a 3rd-year IT student at St. Francis Institute of Technology. I specialize in building products from database schema to a deployed UI, including auth flows, REST APIs, and responsive frontends.",
  currently:
    "Right now I'm building DataStock (cloud storage), Finance Tracker v2, and mastering backend Docker orchestration, security protocols, and system design.",
  interests: ['Full-Stack Dev', 'Backend Engineering', 'DSA & Algorithms'],
};

export const skills = [
  {
    label: 'Languages',
    items: ['Java', 'JavaScript', 'SQL', 'HTML5/CSS3'],
  },
  {
    label: 'Frontend',
    items: ['React', 'Vite', 'Tailwind CSS'],
  },
  {
    label: 'Backend & DB',
    items: ['Node.js', 'Express.js', 'PostgreSQL', 'Prisma ORM'],
  },
  {
    label: 'Auth & Cloud',
    items: ['JWT', 'Google OAuth', 'Docker', 'Vercel/Render'],
  },
];

export const education = [
  {
    school: 'St Francis Institute of Technology',
    degree: 'B.Tech in Information Technology',
    period: '2023 – Present',
    note: 'Expected graduation May 2028 · CGPA 8.50',
    detail:
      'Core engineering, database management systems, and algorithms. Actively building full-stack projects alongside coursework.',
  },
  {
    school: 'Sudarshan Jr College of Commerce, Science and Arts',
    degree: 'Class XII HSC (Science)',
    period: 'July 2022 – May 2024',
    note: '76.2%',
    detail: 'Science stream with focus on mathematics and computer fundamentals.',
  },
];

export const experience = [
  {
    role: 'IEEE Technical Committee Lead',
    organization: 'SFIT Student Branch',
    period: '2025 - Present',
    description: 'Organized and mentored 100+ students in web development bootcamps, workshops, and hackathons.',
    tags: ['Leadership', 'Mentoring', 'Event Management']
  },
  {
    role: 'Full-Stack Hackathon Runner-up',
    organization: 'Colloquium SFIT Project Exhibition',
    period: 'Mar 2026',
    description: 'Pitched and built SWASTHYA health dashboard in a 24-hour sprint. Awarded 2nd Runner Up.',
    tags: ['Full-stack React', 'SIH Hackathon', 'Ayurveda platform']
  },
  {
    role: 'Open-Source Contributor',
    organization: 'GitHub Community',
    period: 'Ongoing',
    description: 'Active contributor to Web Development utilities, sharing templates, and code scaffolding boilerplate.',
    tags: ['Git & GitHub', 'Boilerplate Dev', 'Community Help']
  }
];

export const growthTimeline = [
  {
    year: '2024',
    title: 'Foundations & OOP',
    description: 'Learned C, Java OOP principles, and Core DSA fundamentals.'
  },
  {
    year: '2025',
    title: 'React & Frontend Dev',
    description: 'Built SWASTHYA,Redesign of C++ website dashboard and custom responsive UI frameworks.'
  },
  {
    year: 'Late 2025',
    title: 'Node.js & Databases',
    description: 'Designed secure budgets apps with Express, PostgreSQL, and Prisma ORM.'
  },
  {
    year: 'Early 2026',
    title: 'DataStock Cloud App',
    description: 'Launched a Google Drive clone featuring email OTP security and cloud storage analytics.'
  },
  {
    year: 'Current Focus',
    title: 'Dockerization & System Design',
    description: 'Mastering Docker containers, microservices, and backend API performance optimizations.'
  }
];

export const testimonials = [
  {
    quote: "Akash is exceptionally skilled at turning complex requirements into structured database schemas and clean React code. His drive to master full-stack applications is inspiring.",
    author: "IEEE SFIT Technical Chair",
    role: "Colleague & Mentor"
  },
  {
    quote: "Akash was a standout teammate during our Hackathon sprint. His capability to deliver fully functional authentication systems and API routing in hours was crucial to our win.",
    author: "Hackathon Teammate",
    role: "IT Student at SFIT"
  }
];

export const certifications = [
  {
    name: '2nd Runner Up — Colloquium',
    issuer: 'Technical & Project Competition, SFIT',
    highlight: true,
  },
  {
    name: 'The Complete Full-Stack Web Development Bootcamp',
    issuer: 'Udemy',
  },
  {
    name: 'Participation Certificate — Frontend Frontier',
    issuer: 'Development Workshop',
  },
];

export const projects = [
  {
    title: 'DataStock',
    category: 'fullstack',
    featured: true,
    date: 'Mar 2026',
    problem: 'Users needed a secure, self-hosted alternative to Google Drive with granular access controls and storage analytics.',
    architecture: 'React SPA → Express REST API → PostgreSQL (Prisma ORM) → Cloudinary CDN',
    description:
      'Google Drive-inspired cloud storage with secure authentication, file/folder organization, starred files, and real-time cloud storage tracking.',
    highlights: [
      'Built secure Google OAuth & Email OTP sign-ins.',
      'Implemented file uploads via Cloudinary API hooks.',
      'Designed real-time interactive user storage usage charts.'
    ],
    challenges: 'Handling concurrent file uploads with progress tracking and implementing secure OTP verification flow.',
    tech: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Prisma', 'Cloudinary', 'JWT'],
    liveUrl: 'https://data-stock.vercel.app/',
    githubUrl: 'https://github.com/Akashyatinjain/DataStock',
    accent: '#2563EB',
    demoVideo: '/videos/datastock.mp4'
  },
  {
    title: 'Finance Tracker',
    category: 'fullstack',
    featured: true,
    date: 'Oct 2025',
    problem: 'Personal budgeting apps lacked custom threshold alerts and CSV import support for Indian bank statements.',
    architecture: 'React Dashboard → Express API → PostgreSQL (Prisma) → JWT Auth Layer',
    description:
      'Automated personal finance tracker with custom monthly budget limits, interactive analytics, and transactional trend summaries.',
    highlights: [
      'Built budget thresholds triggers & alert systems.',
      'Engineered CSV transactions imports parsing engine.',
      'Secured backend endpoints with custom JWT layers.'
    ],
    challenges: 'Parsing varied CSV formats from different banks and building real-time budget threshold alerts.',
    tech: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Prisma'],
    liveUrl: 'https://budget-tracker-no3.vercel.app/',
    githubUrl: 'https://github.com/Akashyatinjain/Budget-tracker-no3',
    accent: '#10b981',
    demoVideo: '/videos/financetracker.mp4'
  },
  {
    title: 'SWASTHYA',
    category: 'frontend',
    date: 'Sep 2025',
    description:
      'Ayurvedic platform designed to calculate protein and health indexes built during the Colloquium project competition.',
    tech: ['React', 'JavaScript', 'CSS Grid'],
    liveUrl: 'https://sih-rho-liard.vercel.app/',
    githubUrl: 'https://github.com/Akashyatinjain/SIH',
    accent: '#f59e0b',
  },
  {
    title: 'Keeper Notes',
    category: 'frontend',
    date: 'Aug 2025',
    description:
      'Sticky note application supporting full CRUD tasks, tag grouping, searching, and local storage retention.',
    tech: ['React', 'JavaScript', 'CSS Modules'],
    liveUrl: 'https://keeper-not-app.vercel.app/',
    githubUrl: 'https://github.com/Akashyatinjain',
    accent: '#8b5cf6',
  },
  {
    title: 'Simon Game',
    category: 'others',
    date: '2025',
    description:
      'Retro audio-visual memory game with sequence patterns, score histories, and level-up CSS animations.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    liveUrl: 'https://akashyatinjain.github.io/Simon-Game/',
    githubUrl: 'https://github.com/Akashyatinjain/Simon-Game',
    accent: '#ef4444',
  },
];

export const miniProjects = [
  {
    title: 'World Tracker',
    category: 'frontend',
    date: '2025',
    description: 'An interactive world explorer application using the REST Countries API to search, filter, and fetch details of countries globally.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    liveUrl: 'https://world-tracker-dusky.vercel.app/',
    githubUrl: 'https://github.com/Akashyatinjain/World-tracker-',
    accent: '#3B82F6',
  },
  {
    title: 'World Capital Quiz',
    category: 'frontend',
    date: '2025',
    description: 'An interactive geographic quiz game testing players on world capitals with score tracking and card animations.',
    tech: ['React', 'CSS Modules', 'JavaScript'],
    liveUrl: 'https://world-capital-quiz-vgnj.vercel.app/',
    githubUrl: 'https://github.com/Akashyatinjain/world-capital-quiz',
    accent: '#10B981',
  },
  {
    title: 'C++ Website Redesign',
    category: 'frontend',
    date: '2025',
    description: 'A modern, clean, and responsive redesign of the C++ reference website, optimizing layout, navigation, and code readability.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    liveUrl: 'https://redesign-off-cplus-plus.vercel.app/',
    githubUrl: 'https://github.com/Akashyatinjain/Redesign-off-Cplus-plus-',
    accent: '#EF4444',
  },
  {
    title: 'Drum Kit',
    category: 'frontend',
    date: '2025',
    description: 'An interactive virtual drum kit web application that plays corresponding sound samples on key presses or clicks with active pad animations.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    liveUrl: 'https://akashyatinjain.github.io/Drums/',
    githubUrl: 'https://github.com/Akashyatinjain/Drums',
    accent: '#EC4899',
  },
  {
    title: 'Keeper Notes',
    category: 'frontend',
    date: 'Aug 2025',
    description: 'Sticky note application supporting full CRUD tasks, tag grouping, searching, and local storage retention.',
    tech: ['React', 'JavaScript', 'CSS Modules'],
    liveUrl: 'https://keeper-not-app.vercel.app/',
    githubUrl: 'https://github.com/Akashyatinjain',
    accent: '#8b5cf6',
  },
  {
    title: 'Simon Game',
    category: 'others',
    date: '2025',
    description: 'Retro audio-visual memory game with sequence patterns, score histories, and level-up CSS animations.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    liveUrl: 'https://akashyatinjain.github.io/Simon-Game/',
    githubUrl: 'https://github.com/Akashyatinjain/Simon-Game',
    accent: '#ef4444',
  },
];


export const dsaTopics = [
  'Arrays & Hashing',
  'Two Pointers',
  'Binary Search',
  'Stack & Queues',
  'Trees & Graphs',
  'Dynamic Programming',
];

export const tufStats = {
  username: 'Akashyatinjain',
  profileUrl: 'https://takeuforward.org/profile/Akashyatinjain',
  a2zSheet: {
    title: "Striver's A2Z Sheet",
    solved: 121,
    total: 474,
    pct: 26,
    categories: [
      { label: 'Easy', count: 79, total: 152, color: 'var(--lc-easy)' },
      { label: 'Medium', count: 35, total: 186, color: 'var(--lc-medium)' },
      { label: 'Hard', count: 7, total: 136, color: 'var(--lc-hard)' },
    ]
  },
  tufProfile: {
    title: 'TUF Platform Progress',
    solved: 113,
    total: 1121,
    pct: 10,
    categories: [
      { label: 'Easy', count: 78, total: 374, color: 'var(--lc-easy)', pct: 21 },
      { label: 'Medium', count: 28, total: 477, color: 'var(--lc-medium)', pct: 6 },
      { label: 'Hard', count: 7, total: 253, color: 'var(--lc-hard)', pct: 3 },
    ],
    activity: {
      totalSubmissions: 95,
      activeDays: 41,
      maxStreak: 6
    }
  }
};

