import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Leetcode, Github, TUF, TrophyIcon } from './Icons';
import { profile, dsaTopics, tufStats } from '../data/portfolio';
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

const getTufCalendarData = () => {
  const today = new Date();
  
  const startDate = new Date();
  startDate.setDate(today.getDate() - 364);
  
  const activeMonths = [11, 0, 1, 4, 5, 6]; // Dec, Jan, Feb, May, Jun, Jul
  
  let seed = 42;
  const random = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
  
  const eligibleDays = [];
  let tempDate = new Date(startDate);
  while (tempDate <= today) {
    const month = tempDate.getMonth();
    if (activeMonths.includes(month)) {
      eligibleDays.push(tempDate.toISOString().split('T')[0]);
    }
    tempDate.setDate(tempDate.getDate() + 1);
  }
  
  const activeDaysSet = new Set();
  while (activeDaysSet.size < Math.min(41, eligibleDays.length)) {
    const index = Math.floor(random() * eligibleDays.length);
    activeDaysSet.add(eligibleDays[index]);
  }
  
  const submissionsMap = {};
  activeDaysSet.forEach(day => {
    submissionsMap[day] = 1;
  });
  
  let remainingSubmissions = 95 - activeDaysSet.size;
  const activeDaysArray = Array.from(activeDaysSet);
  while (remainingSubmissions > 0) {
    const index = Math.floor(random() * activeDaysArray.length);
    submissionsMap[activeDaysArray[index]] += 1;
    remainingSubmissions -= 1;
  }
  
  const startDayOfWeek = startDate.getDay();
  const gridStartDate = new Date(startDate);
  gridStartDate.setDate(startDate.getDate() - startDayOfWeek);
  
  const endDayOfWeek = today.getDay();
  const gridEndDate = new Date(today);
  gridEndDate.setDate(today.getDate() + (6 - endDayOfWeek));
  
  let datePtr = new Date(gridStartDate);
  const cells = [];
  
  while (datePtr <= gridEndDate) {
    const dateStr = datePtr.toISOString().split('T')[0];
    const day = String(datePtr.getDate()).padStart(2, '0');
    const month = String(datePtr.getMonth() + 1).padStart(2, '0');
    const year = datePtr.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    
    const count = submissionsMap[dateStr] || 0;
    const isFirstDayOfMonth = datePtr.getDate() <= 7 && datePtr.getDay() === 0;
    const monthLabel = isFirstDayOfMonth ? datePtr.toLocaleString('default', { month: 'short' }) : '';
    
    cells.push({
      dateStr,
      formattedDate,
      count,
      monthLabel,
      dayOfWeek: datePtr.getDay(),
    });
    
    datePtr.setDate(datePtr.getDate() + 1);
  }
  
  return cells;
};

const ProblemSolving = () => {
  const [activeTab, setActiveTab] = useState('tuf');
  const [stats, setStats] = useState(() => {
    try {
      const cached = localStorage.getItem('portfolio_leetcode_stats');
      return cached ? JSON.parse(cached) : defaultStats;
    } catch {
      return defaultStats;
    }
  });

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
      } catch {
        /* keep defaults */
      }
    };
    fetchLC();
  }, []);

  // Prepare TUF calendar data
  const tufCells = getTufCalendarData();
  const tufWeeks = [];
  for (let i = 0; i < tufCells.length; i += 7) {
    tufWeeks.push(tufCells.slice(i, i + 7));
  }

  const lcEasy = stats.categories.find(c => c.label === 'Easy')?.count || 0;
  const lcMedium = stats.categories.find(c => c.label === 'Medium')?.count || 0;
  const lcHard = stats.categories.find(c => c.label === 'Hard')?.count || 0;
  const lcTotal = stats.totalSolved || 0;

  return (
    <section id="leetcode" className="leetcode">
      <div className="container">
        <div className="reveal">
          <p className="section-label">DSA & Activity</p>
          <div className="section-header-row">
            <h2 className="section-title">Problem Solving & Code Activity</h2>
            <div className="dsa-profile-tabs">
              <button 
                className={`dsa-tab-btn leetcode-tab-btn ${activeTab === 'leetcode' ? 'active' : ''}`}
                onClick={() => setActiveTab('leetcode')}
              >
                <Leetcode size={16} />
                <span>LeetCode</span>
              </button>
              <button 
                className={`dsa-tab-btn tuf-tab-btn ${activeTab === 'tuf' ? 'active' : ''}`}
                onClick={() => setActiveTab('tuf')}
              >
                <TUF size={16} />
                <span>Striver (TUF)</span>
              </button>
            </div>
          </div>
          <p className="section-desc">
            I practice solving algorithmic problems in Java. It structures my thinking about performance complexity.
          </p>
        </div>

        <div className="leetcode-grid">
          {activeTab === 'leetcode' ? (
            /* LeetCode Tab Active */
            <>
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

                  <a href={profile.links.leetcode} target="_blank" rel="noopener noreferrer" className="btn btn-primary leetcode-btn leetcode-btn-highlighted">
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

              <div className="charts-column">
                <div className="github-chart-card card reveal-scale" style={{ transitionDelay: '0.05s' }}>
                  <div className="chart-header">
                    <Github size={20} className="github-accent-icon" />
                    <div>
                      <span className="chart-title">GitHub Contributions</span>
                      <span className="chart-subtitle">Commit heat map</span>
                    </div>
                  </div>

                  <div className="chart-container">
                    <img
                      src="https://ghchart.rshah.org/FF5E13/Akashyatinjain"
                      alt="Akash Jain's GitHub Contributions Chart"
                      className="github-chart-img"
                    />
                  </div>

                  <div className="chart-footer">
                    <span className="chart-legend-text">Real-time commit frequency visualization</span>
                  </div>
                </div>

                <div className="github-chart-card card reveal-scale" style={{ transitionDelay: '0.1s' }}>
                  <div className="chart-header">
                    <TrophyIcon size={20} className="github-accent-icon tuf-brand-accent-color" />
                    <div>
                      <span className="chart-title">DSA Solving Stats Comparison</span>
                      <span className="chart-subtitle">LeetCode vs Striver A2Z Sheet</span>
                    </div>
                  </div>

                  <div className="chart-container stats-table-container">
                    <table className="dsa-comparison-table">
                      <thead>
                        <tr>
                          <th>Difficulty</th>
                          <th>LeetCode</th>
                          <th>Striver A2Z</th>
                          <th>Combined</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="diff-easy">Easy</td>
                          <td>{lcEasy}</td>
                          <td>{tufStats.a2zSheet.categories.find(c => c.label === 'Easy').count}</td>
                          <td className="combined-val">{lcEasy + tufStats.a2zSheet.categories.find(c => c.label === 'Easy').count}</td>
                        </tr>
                        <tr>
                          <td className="diff-medium">Medium</td>
                          <td>{lcMedium}</td>
                          <td>{tufStats.a2zSheet.categories.find(c => c.label === 'Medium').count}</td>
                          <td className="combined-val">{lcMedium + tufStats.a2zSheet.categories.find(c => c.label === 'Medium').count}</td>
                        </tr>
                        <tr>
                          <td className="diff-hard">Hard</td>
                          <td>{lcHard}</td>
                          <td>{tufStats.a2zSheet.categories.find(c => c.label === 'Hard').count}</td>
                          <td className="combined-val">{lcHard + tufStats.a2zSheet.categories.find(c => c.label === 'Hard').count}</td>
                        </tr>
                        <tr className="total-row">
                          <td>Total Solved</td>
                          <td>{lcTotal}</td>
                          <td>{tufStats.a2zSheet.solved}</td>
                          <td className="combined-total-val">{lcTotal + tufStats.a2zSheet.solved}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="chart-footer">
                    <span className="chart-legend-text">Aggregated problem count across profiles</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Striver TUF Tab Active */
            <>
              <div className="leetcode-layout card tuf-layout reveal-scale">
                <div className="leetcode-info tuf-info-wrapper">
                  <div className="tuf-sheet-progress-card">
                    <div className="tuf-sheet-header">
                      <div className="tuf-title-badge-row">
                        <TUF size={18} className="tuf-brand-accent-color" />
                        <span className="tuf-sheet-title">{tufStats.a2zSheet.title}</span>
                      </div>
                      <span className="tuf-sheet-numbers">{tufStats.a2zSheet.solved} / {tufStats.a2zSheet.total} Solved</span>
                    </div>

                    <div className="tuf-progress-bar-track">
                      <div className="tuf-progress-bar-fill" style={{ width: `${tufStats.a2zSheet.pct}%` }} />
                    </div>
                    <div className="tuf-progress-bar-stats">
                      <span className="tuf-progress-bar-pct">{tufStats.a2zSheet.pct}% Completed</span>
                      <span className="tuf-progress-bar-desc">Striver's DSA A2Z Roadmap Progress</span>
                    </div>

                    <div className="tuf-sheet-categories">
                      {tufStats.a2zSheet.categories.map((cat) => (
                        <div key={cat.label} className="tuf-category-item">
                          <span className="tuf-cat-label">{cat.label}</span>
                          <span className="tuf-cat-count" style={{ color: cat.color }}>{cat.count} / {cat.total}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="tuf-profile-meta-block">
                    <p className="leetcode-text">
                      Following the structured DSA path of takeuforward (TUF). Doing these challenges strengthens my core fundamentals in complexity scaling and algorithm designs.
                    </p>
                    <a href={tufStats.profileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary leetcode-btn tuf-brand-btn-highlighted">
                      <TUF size={16} />
                      View Striver Profile
                      <ArrowUpRight size={14} />
                    </a>
                  </div>
                </div>

                <div className="leetcode-dials tuf-dials">
                  <div className="tuf-dials-header">
                    <span className="tuf-dials-title">Overall TUF Solved</span>
                    <span className="tuf-dials-solved-text">{tufStats.tufProfile.solved} / {tufStats.tufProfile.total}</span>
                  </div>
                  <div className="tuf-dials-list">
                    {tufStats.tufProfile.categories.map((cat) => {
                      const offset = STROKE - (cat.pct / 100) * STROKE;
                      return (
                        <div key={cat.label} className="dial">
                          <div className="dial-ring">
                            <svg width="80" height="80" viewBox="0 0 80 80">
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
              </div>

              <div className="charts-column">
                {/* Custom TUF Submissions Heatmap */}
                <div className="github-chart-card card reveal-scale">
                  <div className="chart-header">
                    <TUF size={20} className="github-accent-icon tuf-brand-accent-color" />
                    <div>
                      <span className="chart-title">TUF Submissions Calendar</span>
                      <span className="chart-subtitle">{tufStats.tufProfile.activity.totalSubmissions} submissions in the last 12 months</span>
                    </div>
                  </div>

                  <div className="chart-container tuf-chart-container">
                    <div className="tuf-heatmap-wrapper">
                      <div className="tuf-heatmap-labels">
                        <span>Mon</span>
                        <span>Wed</span>
                        <span>Fri</span>
                      </div>
                      <div className="tuf-heatmap-scroll">
                        <div className="tuf-heatmap-months">
                          {tufWeeks.map((week, wIdx) => {
                            const label = week.find(c => c.monthLabel)?.monthLabel;
                            return (
                              <div key={wIdx} className="tuf-month-label-col">
                                {label && <span className="tuf-month-name">{label}</span>}
                              </div>
                            );
                          })}
                        </div>
                        <div className="tuf-heatmap-grid">
                          {tufWeeks.map((week, wIdx) => (
                            <div key={wIdx} className="tuf-heatmap-week-col">
                              {week.map((cell) => {
                                let level = 0;
                                if (cell.count > 0) {
                                  if (cell.count === 1) level = 1;
                                  else if (cell.count === 2) level = 2;
                                  else level = 3;
                                }
                                return (
                                  <div
                                    key={cell.dateStr}
                                    className={`tuf-heatmap-cell level-${level}`}
                                    title={`${cell.formattedDate}\nTotal: ${cell.count}`}
                                  />
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="tuf-heatmap-legend-row">
                    <div className="tuf-activity-details">
                      <div className="tuf-activity-stat">
                        <span className="tuf-stat-num">{tufStats.tufProfile.activity.activeDays}</span>
                        <span className="tuf-stat-lbl">Active Days</span>
                      </div>
                      <div className="tuf-activity-stat">
                        <span className="tuf-stat-num">{tufStats.tufProfile.activity.maxStreak}</span>
                        <span className="tuf-stat-lbl">Max Streak</span>
                      </div>
                    </div>
                    <div className="tuf-legend">
                      <span className="legend-label">Not visited yet</span>
                      <div className="tuf-heatmap-cell level-0 legend-box" />
                      <div className="tuf-heatmap-cell level-3 legend-box" />
                      <span className="legend-label">Achieved</span>
                    </div>
                  </div>
                </div>

                <div className="github-chart-card card reveal-scale" style={{ transitionDelay: '0.05s' }}>
                  <div className="chart-header">
                    <Github size={20} className="github-accent-icon" />
                    <div>
                      <span className="chart-title">GitHub Contributions</span>
                      <span className="chart-subtitle">Commit heat map</span>
                    </div>
                  </div>

                  <div className="chart-container">
                    <img
                      src="https://ghchart.rshah.org/FF5E13/Akashyatinjain"
                      alt="Akash Jain's GitHub Contributions Chart"
                      className="github-chart-img"
                    />
                  </div>

                  <div className="chart-footer">
                    <span className="chart-legend-text">Real-time commit frequency visualization</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProblemSolving;
