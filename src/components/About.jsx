import React, { useState, useEffect } from 'react';
import { Code2, GraduationCap, Award, BookOpen } from 'lucide-react';
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

  // Fallback initial values
  const defaultGithubStats = {
    commits: '512',
    contributions: '700+',
    streak: '22 Days',
    longestStreak: '22 Days',
    grade: 'C+',
  };

  const defaultLanguages = [
    { name: 'JavaScript', pct: '65.36%', color: '#f7df1e' },
    { name: 'HTML', pct: '13.67%', color: '#e34f26' },
    { name: 'CSS', pct: '9.79%', color: '#1572b6' },
    { name: 'EJS', pct: '8.91%', color: '#a91e50' },
    { name: 'Java', pct: '2.26%', color: '#b07219' },
  ];

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
    const fetchGithubData = async () => {
      const username = 'Akashyatinjain';
      
      // 1. Fetch Contributions & Streaks
      try {
        const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}`);
        if (res.ok) {
          const data = await res.json();
          if (data.contributions && data.contributions.length > 0) {
            const sorted = [...data.contributions].sort((a, b) => new Date(a.date) - new Date(b.date));
            
            // Calculate today in local format
            const getLocalDateString = (date) => {
              const offset = date.getTimezoneOffset();
              const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
              return adjustedDate.toISOString().split('T')[0];
            };
            const todayLocalStr = getLocalDateString(new Date());
            
            let todayIdx = sorted.findIndex(item => item.date === todayLocalStr);
            if (todayIdx === -1) {
              const todayUtcStr = new Date().toISOString().split('T')[0];
              todayIdx = sorted.findIndex(item => item.date === todayUtcStr);
            }
            if (todayIdx === -1) {
              const nowMs = new Date().getTime();
              for (let i = sorted.length - 1; i >= 0; i--) {
                if (new Date(sorted[i].date).getTime() <= nowMs) {
                  todayIdx = i;
                  break;
                }
              }
            }
            
            // Longest streak
            let longest = 0;
            let temp = 0;
            const limitIdx = todayIdx !== -1 ? todayIdx : sorted.length - 1;
            for (let i = 0; i <= limitIdx; i++) {
              if (sorted[i].count > 0) {
                temp++;
                if (temp > longest) longest = temp;
              } else {
                temp = 0;
              }
            }
            
            // Current streak
            let current = 0;
            let startIdx = todayIdx;
            if (startIdx !== -1) {
              if (sorted[startIdx].count === 0 && startIdx > 0 && sorted[startIdx - 1].count > 0) {
                startIdx = startIdx - 1;
              }
              if (sorted[startIdx].count > 0) {
                for (let i = startIdx; i >= 0; i--) {
                  if (sorted[i].count > 0) {
                    current++;
                  } else {
                    break;
                  }
                }
              }
            }
            
            const totalConts = Object.values(data.total).reduce((sum, val) => sum + val, 0);
            const currentYearStr = new Date().getFullYear().toString();
            const yearlyCommits = data.total[currentYearStr] || 0;
            
            // Compute Grade
            let grade = 'C+';
            if (totalConts >= 1000) grade = 'A+';
            else if (totalConts >= 750) grade = 'A';
            else if (totalConts >= 500) grade = 'A-';
            else if (totalConts >= 350) grade = 'B+';
            else if (totalConts >= 200) grade = 'B';
            else if (totalConts >= 100) grade = 'B-';
            
            const newStats = {
              commits: String(yearlyCommits),
              contributions: `${totalConts}`,
              streak: `${current} Days`,
              longestStreak: `${longest} Days`,
              grade: grade,
            };
            
            setGithubStats(newStats);
            localStorage.setItem('portfolio_github_stats', JSON.stringify(newStats));
          }
        }
      } catch (err) {
        console.error('Error fetching github contributions:', err);
      }

      // 2. Fetch Repository Primary Languages
      try {
        const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
        if (res.ok) {
          const repos = await res.json();
          const langCounts = {};
          let totalWithLanguage = 0;
          
          repos.forEach(repo => {
            if (repo.language) {
              langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
              totalWithLanguage++;
            }
          });
          
          if (totalWithLanguage > 0) {
            const languageColors = {
              JavaScript: '#f7df1e',
              HTML: '#e34f26',
              CSS: '#1572b6',
              EJS: '#a91e50',
              Java: '#b07219',
              Python: '#3572A5',
              TypeScript: '#3178c6',
              C: '#555555',
              'C++': '#f34b7d',
              PHP: '#4F5D95',
              Shell: '#89e051',
            };
            
            const sortedLangs = Object.entries(langCounts)
              .map(([name, count]) => {
                const pct = ((count / totalWithLanguage) * 100).toFixed(2);
                return {
                  name,
                  pct: `${pct}%`,
                  color: languageColors[name] || '#6e7681'
                };
              })
              .sort((a, b) => parseFloat(b.pct) - parseFloat(a.pct));
              
            setLanguages(sortedLangs);
            localStorage.setItem('portfolio_github_languages', JSON.stringify(sortedLangs));
          }
        }
      } catch (err) {
        console.error('Error fetching github languages:', err);
      }
    };
    
    fetchGithubData();
  }, []);

  return (
    <section id="about" className="about-section">
      <div className="glow-orb glow-orb-purple" style={{ top: '30%', right: '-150px' }}></div>
      <div className="container">
        <h2 className="section-title reveal">About Me</h2>
        <p className="section-subtitle reveal reveal-delay-1">
          3rd Year Information Technology student aiming to bridge the gap between robust software engineering and high-availability cloud architecture.
        </p>

        <div className="about-grid">
          {/* Bio & Skills column */}
          <div className="about-bio reveal-left">
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
                      <span
                        key={skill}
                        className={`skill-badge ${skill === 'Java' ? 'skill-badge-java' : ''}`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* GitHub Stats column */}
          <div className="glass-card github-stats-card reveal-right">
            <div className="stats-card-header">
              <div className="stats-card-title">
                <Github size={22} />
                <span>GitHub Stats Dashboard</span>
              </div>
              <div className="github-grade" title="GitHub Activity Grade">{githubStats.grade || 'C+'}</div>
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
          <div className="credentials-column reveal">
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
          <div className="credentials-column reveal reveal-delay-2">
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
