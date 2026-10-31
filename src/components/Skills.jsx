// src/components/Skills.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Globe, Server, Cpu } from 'lucide-react';
import './Skills.css';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const technicalSpecs = [
  {
    index: 'SPEC // 01',
    category: 'LANGUAGES',
    lead: 'Core programming languages for algorithmic problem solving and production software.',
    skills: ['JavaScript', 'Java', 'C', 'Python (fundamentals)'],
  },
  {
    index: 'SPEC // 02',
    category: 'FRONTEND',
    lead: 'Component-driven client architecture, responsive styling, and modern UI systems.',
    skills: ['React.js', 'Next.js', 'Tailwind CSS', 'HTML5', 'Modern CSS'],
  },
  {
    index: 'SPEC // 03',
    category: 'BACKEND & APIS',
    lead: 'Scalable runtime servers, stateless authorization, and real-time socket connections.',
    skills: ['Node.js', 'Express.js', 'REST APIs', 'Socket.io'],
  },
  {
    index: 'SPEC // 04',
    category: 'DATABASES & ORM',
    lead: 'Relational schemas, document stores, migration pipelines, and type-safe data access.',
    skills: ['PostgreSQL', 'MongoDB', 'Prisma ORM', 'SQL', 'pgAdmin'],
  },
  {
    index: 'SPEC // 05',
    category: 'AUTH & SECURITY',
    lead: 'Multi-method identity verification, tokenized sessions, and secure authorization.',
    skills: ['JWT Authentication', 'OAuth', 'Email OTP verification'],
  },
  {
    index: 'SPEC // 06',
    category: 'DEVOPS & DEPLOYMENT',
    lead: 'Containerization, automated continuous delivery, and zero-downtime cloud infrastructure.',
    skills: ['Docker', 'GitHub Actions (CI/CD)', 'Vercel', 'Render'],
  },
  {
    index: 'SPEC // 07',
    category: 'TOOLS & PLATFORMS',
    lead: 'Developer toolchains, API test suites, UI wireframing, and architectural diagramming.',
    skills: ['Git', 'GitHub', 'Postman', 'VS Code', 'Figma', 'Canva', 'Draw.io'],
  },
];

const whatHeBuilds = [
  {
    icon: <Layers size={20} />,
    title: 'Full-Stack Web Applications',
    description: 'Responsive, production-ready apps using React, Node.js, Express, and PostgreSQL.',
  },
  {
    icon: <Globe size={20} />,
    title: 'Business Websites',
    description: 'Modern, fast, accessible websites for businesses and organizations.',
  },
  {
    icon: <Server size={20} />,
    title: 'Backend & APIs',
    description: 'Scalable REST APIs, Prisma ORM schemas, multi-method auth, secure integrations.',
  },
  {
    icon: <Cpu size={20} />,
    title: 'Deployment & CI/CD',
    description: 'Docker containerization, GitHub Actions (CI/CD), Vercel, and Render deployments.',
  },
];

const engineeringProcess = [
  {
    step: '01',
    title: 'UNDERSTAND',
    lead: 'Requirements, project goals, constraints, references, and system architecture.',
  },
  {
    step: '02',
    title: 'BUILD',
    lead: 'UI design, REST APIs, relational DB schemas, authentication, and integrations.',
  },
  {
    step: '03',
    title: 'DEPLOY',
    lead: 'Testing, cloud deployment, performance optimization, and documentation handoff.',
  },
];

const Skills = () => {
  return (
    <section id="skills" className="skills-section" aria-label="Technical Skills and Engineering Specifications">
      <div className="container">
        {/* Section Header */}
        <motion.div
          className="section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          <div className="section-tag">02 // THE ENGINEERING</div>
          <h2 className="skills-headline">TECHNICAL SPECIFICATIONS.</h2>
          <p>
            Disciplined software engineering stack built for performance, reliability, and precision.
            Every layer selected for production utility and architectural resilience.
          </p>
        </motion.div>

        {/* Technical Specs Grid */}
        <motion.div
          className="skills-spec-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
          }}
        >
          {technicalSpecs.map((spec) => (
            <motion.div key={spec.category} className="skill-spec-card" variants={fadeUp}>
              <div className="card-top">
                <span className="spec-index">{spec.index}</span>
                <span className="spec-accent-line" />
              </div>

              <h3 className="spec-category-title">{spec.category}</h3>
              <p className="spec-lead">{spec.lead}</p>

              <div className="spec-skill-tags" aria-label={`${spec.category} technologies`}>
                {spec.skills.map((skill) => (
                  <span key={skill} className="skill-pill">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* What He Builds Section */}
        <motion.div
          className="skills-sub-block"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeUp}
        >
          <div className="sub-block-header">
            <span className="sub-block-tag">DELIVERY CAPABILITIES</span>
            <h3 className="sub-block-title">WHAT HE BUILDS.</h3>
          </div>

          <div className="builds-grid">
            {whatHeBuilds.map((item) => (
              <div key={item.title} className="build-card">
                <div className="build-icon">{item.icon}</div>
                <h4 className="build-title">{item.title}</h4>
                <p className="build-desc">{item.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Engineering Process Section */}
        <motion.div
          className="skills-sub-block"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeUp}
        >
          <div className="sub-block-header">
            <span className="sub-block-tag">METHODOLOGY & DISCIPLINE</span>
            <h3 className="sub-block-title">HOW HE WORKS.</h3>
          </div>

          <div className="process-grid">
            {engineeringProcess.map((proc) => (
              <div key={proc.title} className="process-card">
                <div className="process-step-num">{proc.step}</div>
                <h4 className="process-title">{proc.title}</h4>
                <p className="process-lead">{proc.lead}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
