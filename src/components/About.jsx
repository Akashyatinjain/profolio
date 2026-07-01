// src/components/About.jsx
import React from 'react';
import { User, Code2, GraduationCap, Award, BookOpen } from 'lucide-react';
import { Github } from './Icons';
import './About.css';

const About = () => {
  const skillCategories = [
    {
      title: 'Languages',
      skills: ['JavaScript', 'Java', 'C', 'Python', 'HTML5', 'CSS3', 'PowerShell'],
    },
    {
      title: 'Frontend & UI',
      skills: ['React', 'Context API', 'Tailwind CSS', 'Bootstrap', 'jQuery', 'Chart.js'],
    },
    {
      title: 'Backend & Databases',
      skills: ['Node.js', 'Express.js', 'PostgreSQL', 'MongoDB', 'MySQL', 'Supabase', 'Prisma', 'JWT', 'Firebase'],
    },
    {
      title: 'DevOps & Cloud',
      skills: ['Docker', 'AWS', 'Google Cloud', 'Jenkins', 'Vercel', 'Netlify', 'Render', 'Git & GitHub'],
    },
    {
      title: 'Design & Tools',
      skills: ['Figma', 'Sketch', 'Canva', 'Adobe Photoshop', 'Windows Terminal'],
    },
  ];

  const githubStats = {
    commits: '512',
    contributions: '700+',
    streak: '22 Days',
    longestStreak: '22 Days',
  };

  const languages = [
    { name: 'JavaScript', pct: '65.36%', color: '#f7df1e' },
    { name: 'HTML', pct: '13.67%', color: '#e34f26' },
    { name: 'CSS', pct: '9.79%', color: '#1572b6' },
    { name: 'EJS', pct: '8.91%', color: '#a91e50' },
    { name: 'Java', pct: '2.26%', color: '#b07219' },
  ];

  return (
    <section id="about" className="about-section">
      <div className="glow-orb glow-orb-purple" style={{ top: '30%', right: '-150px' }}></div>
      <div className="container">
        <h2 className="section-title">About Me</h2>
        <p className="section-subtitle">
          3rd Year Information Technology student aiming to bridge the gap between robust software engineering and high-availability cloud architecture.
        </p>

        <div className="about-grid">
          {/* Bio & Skills column */}
          <div className="about-bio">
            <div className="highlight-tag">
              <GraduationCap size={18} />
              <span>3rd Year Information Technology Student</span>
            </div>
             <p className="about-text">
              I am a software engineer specializing in <strong className="text-highlight">Java</strong> object-oriented programming, data structures, and algorithms. 
              My academic foundation coupled with active building allows me to quickly learn, adapt, and deploy scalable systems. 
              I design clean APIs, structure relational models, and manage state cycles effectively.
            </p>

            <div className="skills-container">
              <h3 className="skills-category-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Code2 size={18} className="text-purple-400" />
                Technical Arsenal
              </h3>
              {skillCategories.map((category) => (
                <div key={category.title} className="skills-category">
                  <span className="skills-category-title" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {category.title}
                  </span>
                  <div className="skills-list">
                    {category.skills.map((skill) => (
                      <span key={skill} className={`skill-badge ${skill === 'Java' ? 'skill-badge-java' : ''}`}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* GitHub Stats column */}
          <div className="glass-card github-stats-card">
            <div className="stats-card-header">
              <div className="stats-card-title">
                <Github size={22} />
                <span>GitHub Stats Dashboard</span>
              </div>
              <div className="github-grade" title="GitHub Activity Grade">C+</div>
            </div>

            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">{githubStats.contributions}</div>
                <div className="stat-label">Contributions</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{githubStats.commits}</div>
                <div className="stat-label">Yearly Commits</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{githubStats.streak}</div>
                <div className="stat-label">Active Streak</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{githubStats.longestStreak}</div>
                <div className="stat-label">Longest Streak</div>
              </div>
            </div>

            <div className="languages-section">
              <span className="languages-title">Most Used Languages</span>
              {languages.map((lang) => (
                <div key={lang.name} className="lang-item">
                  <div className="lang-info">
                    <span className="lang-name">{lang.name}</span>
                    <span className="lang-pct">{lang.pct}</span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-bar"
                      style={{
                        width: lang.pct,
                        backgroundColor: lang.color,
                        boxShadow: `0 0 8px ${lang.color}55`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Education & Certifications Section */}
        <div className="credentials-section">
          {/* Education Timeline */}
          <div className="credentials-column">
            <h3 className="credentials-title">
              <GraduationCap size={22} />
              <span>Education</span>
            </h3>
            
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-header">
                  <span className="timeline-school">St Francis Institute of Technology</span>
                  <span className="timeline-date">May 2026 - Present</span>
                </div>
                <div className="timeline-degree">B.Tech in Information Technology</div>
                <p className="timeline-desc">Focusing on core engineering subjects, software architecture, and modern databases. Currently maintaining a CGPA of 8.50.</p>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-header">
                  <span className="timeline-school">Sudarshan Jr College of Commerce, Science and Arts</span>
                  <span className="timeline-date">July 2022 - May 2024</span>
                </div>
                <div className="timeline-degree">Class XII HSC</div>
                <p className="timeline-desc">Completed high school education with Science stream, achieving a percentage score of 76.2%.</p>
              </div>
            </div>
          </div>

          {/* Certifications List */}
          <div className="credentials-column">
            <h3 className="credentials-title">
              <Award size={22} />
              <span>Certifications & Bootcamps</span>
            </h3>

            <div className="certs-list">
              <div className="cert-card">
                <div className="cert-icon-wrapper">
                  <Award size={20} style={{ color: 'var(--accent-teal)' }} />
                </div>
                <div className="cert-details">
                  <span className="cert-name">2nd Runner Up in Colloquium</span>
                  <span className="cert-issuer">Colloquium / Technical & Project Competition</span>
                </div>
              </div>

              <div className="cert-card">
                <div className="cert-icon-wrapper">
                  <BookOpen size={20} />
                </div>
                <div className="cert-details">
                  <span className="cert-name">The Complete Full-Stack Web Development Bootcamp</span>
                  <span className="cert-issuer">Udemy / Web Development Certification</span>
                </div>
              </div>

              <div className="cert-card">
                <div className="cert-icon-wrapper">
                  <Award size={20} />
                </div>
                <div className="cert-details">
                  <span className="cert-name">Participation Certificate on Frontend Frontier</span>
                  <span className="cert-issuer">Frontend Frontier / Development Workshop</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
