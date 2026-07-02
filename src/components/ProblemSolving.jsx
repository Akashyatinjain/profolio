// src/components/ProblemSolving.jsx
import React from 'react';
import { Award, ArrowUpRight, BrainCircuit } from 'lucide-react';
import './ProblemSolving.css';

const ProblemSolving = () => {
  // SVG Ring calculation: Circumference = 2 * pi * r = 2 * 3.14159 * 34 = 213.6
  const strokeCircumference = 213.6;

  const leetcodeStats = {
    totalSolved: 200,
    categories: [
      { label: 'Easy', count: 110, color: 'var(--lc-easy)', pct: 55 },
      { label: 'Medium', count: 80, color: 'var(--lc-medium)', pct: 40 },
      { label: 'Hard', count: 10, color: 'var(--lc-hard)', pct: 15 },
    ],
  };

  const dsaTopics = [
    'Arrays & Hashing',
    'Two Pointers',
    'Sliding Window',
    'Stack & Queues',
    'Binary Search',
    'Trees & Graphs',
    'Dynamic Programming',
    'Recursion & Backtracking',
    'Greedy Algorithms',
    'Bit Manipulation',
  ];

  return (
    <section id="leetcode" className="leetcode-section">
      <div className="container">
        <h2 className="section-title reveal">Data Structures & Algorithms</h2>
        <p className="section-subtitle reveal reveal-delay-1">
          Demonstrating strong analytical skills and algorithmic competence by solving real-world challenges.
        </p>

        <div className="glass-card leetcode-card reveal-scale reveal-delay-2">
          {/* DSA text info */}
          <div className="leetcode-info">
            <div className="highlight-tag" style={{ background: 'rgba(6, 182, 212, 0.05)', borderColor: 'rgba(6, 182, 212, 0.15)' }}>
              <BrainCircuit size={18} className="text-teal-400" />
              <span>Problem Solving & Algorithms</span>
            </div>
            <p className="leetcode-text">
              I consistently solve complex problems on LeetCode utilizing <strong className="text-highlight">Java</strong> as my primary language for object-oriented structure and data mapping. 
              My practice centers around optimizing time and space complexities ($O(1)$, $O(\log N)$, $O(N)$) and implementation of efficient tree, graph, and dynamic programming patterns.
            </p>

            <div style={{ marginTop: '1rem' }}>
              <span className="skills-category-title" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Core DSA Focus Areas
              </span>
              <div className="dsa-badges">
                {dsaTopics.map((topic) => (
                  <span key={topic} className="dsa-badge">
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <a
                href="https://leetcode.com/problemset/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ padding: '0.6rem 1.4rem', fontSize: '0.85rem' }}
              >
                <span>View LeetCode Practice</span>
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>

          {/* Dials Dashboard */}
          <div className="leetcode-dashboard">
            <div className="total-solved-display">
              <span className="total-solved-val">{leetcodeStats.totalSolved}</span>
              <span className="total-solved-lbl">Total Solved</span>
            </div>

            <div className="dials-container">
              {leetcodeStats.categories.map((cat) => {
                // Calculate dash offset: (1 - pct / 100) * circumference
                const dashOffset = strokeCircumference - (cat.pct / 100) * strokeCircumference;
                return (
                  <div key={cat.label} className="dial-item">
                    <div className="dial-svg-wrapper">
                      <svg width="80" height="80">
                        <circle cx="40" cy="40" r="34" className="circle-bg" />
                        <circle
                          cx="40"
                          cy="40"
                          r="34"
                          className="circle-progress"
                          style={{
                            stroke: cat.color,
                            strokeDasharray: strokeCircumference,
                            strokeDashoffset: dashOffset,
                          }}
                        />
                      </svg>
                      <div className="dial-value">{cat.count}</div>
                    </div>
                    <span className={`dial-label ${cat.label.toLowerCase()}`}>{cat.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolving;
