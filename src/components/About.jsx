import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Github, SparklesIcon, GraduationIcon, TrophyIcon } from './Icons';
import { profile, bio, skills, education, certifications } from '../data/portfolio';
import './About.css';

const LANG_COLORS = {
  JavaScript: '#f7df1e',
  HTML: '#e34f26',
  CSS: '#1572b6',
  TypeScript: '#3178c6',
  Java: '#b07219',
  Python: '#3572A5',
  'C++': '#f34b7d',
  C: '#555555',
};

const About = () => {
  const [githubStats, setGithubStats] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const username = 'Akashyatinjain';
    let isMounted = true;

    const fetchGithubData = async () => {
      try {
        const [resAll, resLast, resRepos] = await Promise.all([
          fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=all`),
          fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`),
          fetch(`https://api.github.com/users/${username}/repos?per_page=100`),
        ]);

        let total = 0;
        let commits = 0;
        let currentStreak = 0;

        if (resAll.ok) {
          const dataAll = await resAll.json();
          total = Object.values(dataAll.total || {}).reduce((s, v) => (typeof v === 'number' ? s + v : s), 0);
          const year = new Date().getFullYear().toString();
          commits = dataAll.total?.[year] || 0;
        }

        if (resLast.ok) {
          const dataLast = await resLast.json();
          if (dataLast.contributions?.length) {
            const sorted = [...dataLast.contributions].sort((a, b) => new Date(a.date) - new Date(b.date));
            const now = new Date();
            const localToday = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
            const utcToday = now.toISOString().split('T')[0];

            let todayIdx = sorted.findIndex((d) => d.date === localToday || d.date === utcToday);
            if (todayIdx === -1) todayIdx = sorted.length - 1;

            let startIdx = todayIdx;
            // If no commits today yet, start counting from yesterday if yesterday had commits
            if (sorted[startIdx]?.count === 0 && startIdx > 0 && sorted[startIdx - 1]?.count > 0) {
              startIdx--;
            }

            if (sorted[startIdx]?.count > 0) {
              for (let i = startIdx; i >= 0; i--) {
                if (sorted[i].count > 0) currentStreak++;
                else break;
              }
            }
          }
        }

        let parsedLangs = [];
        if (resRepos.ok) {
          const repos = await resRepos.json();
          if (Array.isArray(repos)) {
            const langMap = {};
            repos.forEach((r) => {
              if (r.language && !r.fork) {
                langMap[r.language] = (langMap[r.language] || 0) + (r.size || 1);
              }
            });
            const totalSize = Object.values(langMap).reduce((a, b) => a + b, 0) || 1;
            parsedLangs = Object.entries(langMap)
              .sort((a, b) => b[1] - a[1])
              .filter(([_, size]) => Math.round((size / totalSize) * 100) > 0)
              .slice(0, 4)
              .map(([name, size]) => ({
                name,
                pct: `${Math.round((size / totalSize) * 100)}%`,
                color: LANG_COLORS[name] || '#888888',
              }));
          }
        }

        if (isMounted) {
          setGithubStats({
            contributions: `${total}`,
            commits: `${commits}`,
            streak: `${currentStreak}d`,
          });
          setLanguages(parsedLangs);
          setLoading(false);
        }
      } catch {
        if (isMounted) setLoading(false);
      }
    };

    fetchGithubData();
    return () => {
      isMounted = false;
    };
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
              <div className="about-profile-header">
                <img src={profile.avatar} alt={profile.name} className="about-profile-photo" />
                <div className="about-profile-info">
                  <h3 className="about-profile-name">{profile.name}</h3>
                  <span className="about-profile-sub">{profile.title} &bull; {profile.location}</span>
                </div>
              </div>
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
              <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="github-link" aria-label="View Akash's GitHub Profile">
                View profile
                <ArrowUpRight size={14} />
              </a>
            </div>

            <div className="github-stats-row">
              <div className="github-stat">
                <span className="github-stat-val">
                  {loading ? <span className="stat-skeleton" aria-hidden="true" /> : (githubStats?.contributions || '0')}
                </span>
                <span className="github-stat-lbl">Contributions</span>
              </div>
              <div className="github-stat">
                <span className="github-stat-val">
                  {loading ? <span className="stat-skeleton" aria-hidden="true" /> : (githubStats?.commits || '0')}
                </span>
                <span className="github-stat-lbl">Year Commits</span>
              </div>
              <div className="github-stat">
                <span className="github-stat-val">
                  {loading ? <span className="stat-skeleton" aria-hidden="true" /> : (githubStats?.streak || '0d')}
                </span>
                <span className="github-stat-lbl">Streak</span>
              </div>
            </div>

            <div className="github-langs">
              <span className="github-langs-title">Top Languages</span>
              {loading ? (
                <div className="lang-skeleton-group" aria-hidden="true">
                  <div className="lang-skeleton-bar" />
                  <div className="lang-skeleton-bar" />
                  <div className="lang-skeleton-bar" />
                </div>
              ) : (
                languages.map((lang) => (
                  <div key={lang.name} className="lang-row">
                    <div className="lang-row-top">
                      <span className="lang-name">{lang.name}</span>
                      <span className="lang-pct">{lang.pct}</span>
                    </div>
                    <div className="lang-track">
                      <div className="lang-fill" style={{ width: lang.pct, background: lang.color }} />
                    </div>
                  </div>
                ))
              )}
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
