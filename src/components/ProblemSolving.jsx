import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Leetcode, Github } from './Icons';
import { profile, dsaTopics } from '../data/portfolio';
import './ProblemSolving.css';

const STROKE = 201.1;

const defaultStats = {
  totalSolved: 61,
  categories: [
    { label: 'Easy', count: 35, color: 'var(--lc-easy)', pct: 57 },
    { label: 'Medium', count: 24, color: 'var(--lc-medium)', pct: 39 },
    { label: 'Hard', count: 2, color: 'var(--lc-hard)', pct: 8 },
  ],
};

const ProblemSolving = () => {
  const [stats, setStats] = useState(() => {
    try {
      const cached = localStorage.getItem('portfolio_leetcode_stats');
      return cached ? JSON.parse(cached) : defaultStats;
    } catch {
      return defaultStats;
    }
  });

  const [submissionCalendar, setSubmissionCalendar] = useState(null);

  useEffect(() => {
    const fetchLC = async () => {
      try {
        const res = await fetch(`https://leetcode-stats-api.herokuapp.com/Akashyatinjain`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.status !== "success") return;
        const total = data.totalSolved || 0;
        if (total === 0) return;

        const easy = data.easySolved || 0;
        const medium = data.mediumSolved || 0;
        const hard = data.hardSolved || 0;

        const newStats = {
          totalSolved: total,
          categories: [
            { label: 'Easy', count: easy, color: 'var(--lc-easy)', pct: Math.round((easy / total) * 100) },
            { label: 'Medium', count: medium, color: 'var(--lc-medium)', pct: Math.round((medium / total) * 100) },
            { label: 'Hard', count: hard, color: 'var(--lc-hard)', pct: Math.max(3, Math.round((hard / total) * 100)) },
          ],
        };
        setStats(newStats);
        localStorage.setItem('portfolio_leetcode_stats', JSON.stringify(newStats));

        if (data.submissionCalendar) {
          // Parse the stringified JSON calendar if returned as a string
          const calendar = typeof data.submissionCalendar === 'string'
            ? JSON.parse(data.submissionCalendar)
            : data.submissionCalendar;
          setSubmissionCalendar(calendar);
        }
      } catch {
        /* keep defaults */
      }
    };
    fetchLC();
  }, []);

  return (
    <section id="leetcode" className="leetcode">
      <div className="container">
        <p className="section-label reveal">DSA & Activity</p>
        <h2 className="section-title reveal reveal-delay-1">Problem Solving & Code Activity</h2>
        <p className="section-desc reveal reveal-delay-2">
          I practice solving algorithmic problems in Java. It structures my thinking about performance complexity.
        </p>

        <div className="leetcode-grid">
          {/* Leetcode card */}
          <div className="leetcode-layout card reveal-scale">
            <div className="leetcode-info">
              <div className="leetcode-total">
                <span className="leetcode-total-num">{stats.totalSolved}</span>
                <span className="leetcode-total-lbl">problems solved</span>
              </div>

              <p className="leetcode-text">
                Arrays, binary search, hash maps, and dynamic programming are where I spend most of my time.
                Hard problems push me to think about state transitions and edge cases more carefully.
              </p>

              <div className="dsa-tags">
                {dsaTopics.map((topic) => (
                  <span key={topic} className="tag">{topic}</span>
                ))}
              </div>

              <a href={profile.links.leetcode} target="_blank" rel="noopener noreferrer" className="btn btn-outline leetcode-btn">
                <Leetcode size={16} />
                View my LeetCode
                <ArrowUpRight size={14} />
              </a>
            </div>

            <div className="leetcode-dials">
              {stats.categories.map((cat) => {
                const offset = STROKE - (cat.pct / 100) * STROKE;
                return (
                  <div key={cat.label} className="dial">
                    <div className="dial-ring">
                      <svg width="88" height="88" viewBox="0 0 80 80">
                        <circle cx="40" cy="40" r="32" className="dial-bg" />
                        <circle
                          cx="40"
                          cy="40"
                          r="32"
                          className="dial-progress"
                          style={{
                            stroke: cat.color,
                            strokeDasharray: STROKE,
                            strokeDashoffset: offset,
                          }}
                        />
                      </svg>
                      <span className="dial-count">{cat.count}</span>
                    </div>
                    <span className="dial-label" style={{ color: cat.color }}>{cat.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* GitHub & LeetCode Heatmaps Display */}
          <div className="charts-column">
            {/* LeetCode Heatmap */}
            <div className="github-chart-card card reveal-scale">
              <div className="chart-header">
                <Leetcode size={20} className="github-accent-icon" />
                <div>
                  <span className="chart-title">LeetCode Heatmap</span>
                  <span className="chart-subtitle">Submission frequency tracker</span>
                </div>
              </div>

              <div className="chart-container">
                <img
                  src="https://leetcode-stats-six.vercel.app/api?username=Akashyatinjain&theme=light"
                  alt="Akash Jain's LeetCode Submissions Heatmap"
                  className="leetcode-stats-img"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </div>

              <div className="chart-footer">
                <span className="chart-legend-text">Real-time submissions statistics</span>
              </div>
            </div>

            {/* GitHub Contribution Graph Display */}
            <div className="github-chart-card card reveal-scale" style={{ transitionDelay: '0.05s' }}>
              <div className="chart-header">
                <Github size={20} className="github-accent-icon" />
                <div>
                  <span className="chart-title">GitHub Contributions</span>
                  <span className="chart-subtitle">Commit heat map</span>
                </div>
              </div>

              <div className="chart-container">
                <i mg
                  src="https://ghchart.rshah.org/2563EB/Akashyatinjai n"
                  alt="Akash Jain's GitHub Contributions Char t"
                  className="github-chart-img"
                />
              </div>

              <div className="chart-footer">
                <span className="chart-legend-text">Real-time commit frequency visualization</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolving;
