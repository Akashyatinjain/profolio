import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Github, SparklesIcon, GraduationIcon, TrophyIcon } from './Icons';
import { profile, bio, skills, education, certifications } from '../data/portfolio';
import './About.css';

const defaultGithubStats = {
  contributions: '720+',
  commits: '450',
  streak: '18d',
};

const defaultLanguages = [
  { name: 'JavaScript', pct: '65%', color: '#f7df1e' },
  { name: 'HTML', pct: '14%', color: '#e34f26' },
  { name: 'CSS', pct: '10%', color: '#1572b6' },
];

const About = () => {
  const [githubStats, setGithubStats] = useState(() => {
    try {
      const cached = localStorage.getItem('portfolio_github_stats');
      return cached ? JSON.parse(cached) : defaultGithubStats;
    } catch {
      return defaultGithubStats;
    }
  });

  const [languages, setLanguages] = useState(() => {
    try {
      const cached = localStorage.getItem('portfolio_github_languages');
      return cached ? JSON.parse(cached) : defaultLanguages;
    } catch {
      return defaultLanguages;
    }
  });

  useEffect(() => {
    const username = 'Akashyatinjain';
    const fetchGithub = async () => {
      try {
        const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}`);
        if (!res.ok) return;
        const data = await res.json();
        if (!data.contributions?.length) return;

        const sorted = [...data.contributions].sort((a, b) => new Date(a.date) - new Date(b.date));
        const todayStr = new Date().toISOString().split('T')[0];
        let todayIdx = sorted.findIndex((d) => d.date === todayStr);
        if (todayIdx === -1) todayIdx = sorted.length - 1;

        let longest = 0;
        let temp = 0;
        for (let i = 0; i <= todayIdx; i++) {
          if (sorted[i].count > 0) {
            temp++;
            if (temp > longest) longest = temp;
          } else temp = 0;
        }

        let current = 0;
        if (sorted[todayIdx]?.count > 0) {
          for (let i = todayIdx; i >= 0; i--) {
            if (sorted[i].count > 0) current++;
            else break;
          }
        }

        const total = Object.values(data.total).reduce((s, v) => s + v, 0);
        const year = new Date().getFullYear().toString();
        const newStats = {
          contributions: `${total}`,
          commits: String(data.total[year] || 0),
          streak: `${current}d`,
        };
        setGithubStats(newStats);
        localStorage.setItem('portfolio_github_stats', JSON.stringify(newStats));
      } catch {
        /* keep defaults */
      }
    };
    fetchGithub();
  }, []);

  return (
    <section id="about" className="about">
      <div className="container">
        <div className="section-header">
          <p className="section-label reveal">
            <SparklesIcon size={14} style={{ color: 'var(--accent-light)' }} />
            About
          </p>
          <h2 className="section-title reveal reveal-delay-1">A bit about me</h2>
          <p className="section-desc reveal reveal-delay-2">{bio.currently}</p>
        </div>

        <div className="about-layout">
          <div className="about-main reveal-left">
            <div className="about-bio-card card">
              <p className="about-text">
                {bio.intro} Problem-solving on LeetCode in Java keeps my DSA sharp — arrays, binary search, DP, and graph patterns are where I spend most of my practice time.
              </p>
              
              <div className="interests-row">
                <span className="interests-label">Focus Areas</span>
                <div className="interests-tags">
                  {bio.interests.map((item) => (
                    <span key={item} className="tag">{item}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="skills-grid">
              {skills.map((group) => (
                <div key={group.label} className={`skill-group ${group.primary ? 'primary-stack' : 'secondary-stack'}`}>
                  <span className="skill-group-label">{group.label}</span>
                  <div className="skill-items">
                    {group.items.map((s) => (
                      <span key={s} className={`tag ${group.primary ? 'tag-accent' : ''}`}>{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="about-github card reveal-right">
            <div className="github-header">
              <Github size={20} className="github-icon" />
              <div>
                <span className="github-title">GitHub Activity</span>
                <span className="github-handle">@Akashyatinjain</span>
              </div>
              <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="github-link">
                View profile
                <ArrowUpRight size={14} />
              </a>
            </div>

            <div className="github-stats-row">
              <div className="github-stat">
                <span className="github-stat-val">{githubStats.contributions}</span>
                <span className="github-stat-lbl">Contributions</span>
              </div>
              <div className="github-stat">
                <span className="github-stat-val">{githubStats.commits}</span>
                <span className="github-stat-lbl">Year Commits</span>
              </div>
              <div className="github-stat">
                <span className="github-stat-val">{githubStats.streak}</span>
                <span className="github-stat-lbl">Streak</span>
              </div>
            </div>

            <div className="github-langs">
              <span className="github-langs-title">Top Languages</span>
              {languages.map((lang) => (
                <div key={lang.name} className="lang-row">
                  <div className="lang-row-top">
                    <span className="lang-name">{lang.name}</span>
                    <span className="lang-pct">{lang.pct}</span>
                  </div>
                  <div className="lang-track">
                    <div className="lang-fill" style={{ width: lang.pct, background: lang.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="divider" />

        <div className="credentials-grid">
          <div className="reveal">
            <h3 className="cred-heading">
              <GraduationIcon size={20} style={{ color: 'var(--accent)', marginRight: '8px', verticalAlign: 'middle' }} />
              Education
            </h3>
            <div className="timeline">
              {education.map((item) => (
                <article key={item.school} className="timeline-item card">
                  <div className="timeline-meta">
                    <span className="timeline-period">{item.period}</span>
                    <span className="timeline-note">{item.note}</span>
                  </div>
                  <h4 className="timeline-school">{item.school}</h4>
                  <p className="timeline-degree">{item.degree}</p>
                  <p className="timeline-detail">{item.detail}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="reveal reveal-delay-2">
            <h3 className="cred-heading">
              <TrophyIcon size={20} style={{ color: 'var(--accent-light)', marginRight: '8px', verticalAlign: 'middle' }} />
              Certifications & Awards
            </h3>
            <ul className="cert-list">
              {certifications.map((cert) => (
                <li key={cert.name} className={`cert-item card ${cert.highlight ? 'cert-highlight' : ''}`}>
                  <div className="cert-badge">
                    <span className="cert-name">{cert.name}</span>
                    <span className="cert-issuer">{cert.issuer}</span>
                  </div>
                  {cert.highlight && <span className="highlight-pill">Awarded</span>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
