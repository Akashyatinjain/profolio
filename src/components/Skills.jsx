// src/components/Skills.jsx
import React from 'react';
import { motion } from 'framer-motion';
import './Skills.css';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const technicalSpecs = [
  {
    index: 'SPEC // 01',
    category: 'FRONTEND',
    lead: 'Client-side architectures and interactive graphic viewports.',
    skills: ['React', 'Next.js', 'TypeScript', 'JavaScript (ES6+)', 'Three.js / WebGL', 'TailwindCSS', 'HTML5 / Modern CSS'],
  },
  {
    index: 'SPEC // 02',
    category: 'BACKEND',
    lead: 'Robust runtime servers, stateless authentication, and REST APIs.',
    skills: ['Node.js', 'Express.js', 'RESTful API Design', 'JWT Authentication', 'Google OAuth 2.0', 'Microservice Patterns'],
  },
  {
    index: 'SPEC // 03',
    category: 'DATABASE',
    lead: 'Relational schemas, ORM data access, and storage pipelines.',
    skills: ['PostgreSQL', 'Prisma ORM', 'MongoDB', 'Cloudinary CDN', 'Schema Normalization', 'SQL Query Optimization'],
  },
  {
    index: 'SPEC // 04',
    category: 'TOOLS & DEVOPS',
    lead: 'Containerization, source control, and zero-downtime deployment.',
    skills: ['Docker', 'Git & GitHub', 'Linux / Bash', 'Postman API Testing', 'Vite', 'Vercel / Render', 'CI/CD Automation'],
  },
  {
    index: 'SPEC // 05',
    category: 'AI & EMERGING',
    lead: 'Autonomous agents, model inference, and programmatic reasoning.',
    skills: ['LLM Integration', 'OpenAI APIs', 'Prompt Architecture', 'LangChain', 'Contextual Memory', 'Autonomous Agents'],
  },
];

const Skills = () => {
  return (
    <section id="skills" className="skills-section" aria-label="Technical Skills and Engineering Specifications">
      <div className="container">
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
            Every layer selected for architectural resilience.
          </p>
        </motion.div>

        <motion.div
          className="skills-spec-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
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
      </div>
    </section>
  );
};

export default Skills;
