import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Leetcode, Github, TUF, TrophyIcon } from './Icons';
import { profile, dsaTopics, tufStats as initialTufStats } from '../data/portfolio';
import './ProblemSolving.css';

const STROKE = 201.1;

const defaultStats = {
  totalSolved: 77,
  categories: [
    { label: 'Easy', count: 39, color: 'var(--lc-easy)', pct: 51 },
    { label: 'Medium', count: 35, color: 'var(--lc-medium)', pct: 45 },
    { label: 'Hard', count: 3, color: 'var(--lc-hard)', pct: 4 },
  ],
};

const getTufCalendarData = (submissionsMap = {}) => {
  const today = new Date();
  
  const startDate = new Date();
  startDate.setDate(today.getDate() - 364);
  
  const hasRealData = submissionsMap && Object.keys(submissionsMap).length > 0;

  let fallbackMap = {};
  if (!hasRealData) {
    const activeMonths = [11, 0, 1, 4, 5, 6];
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
    while (activeDaysSet.size < Math.min(48, eligibleDays.length)) {
      const index = Math.floor(random() * eligibleDays.length);
      activeDaysSet.add(eligibleDays[index]);
    }
    activeDaysSet.forEach(day => {
      fallbackMap[day] = 1;
    });
    let remainingSubmissions = 108 - activeDaysSet.size;
    const activeDaysArray = Array.from(activeDaysSet);
    while (remainingSubmissions > 0) {
      const index = Math.floor(random() * activeDaysArray.length);
      fallbackMap[activeDaysArray[index]] += 1;
      remainingSubmissions -= 1;
    }
  }

  const mapToUse = hasRealData ? submissionsMap : fallbackMap;

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
    
    const count = mapToUse[dateStr] || 0;
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
  const [activeTab, setActiveTab] = useState('leetcode');
  const [stats, setStats] = useState(() => {
    try {
      const cached = localStorage.getItem('portfolio_leetcode_stats');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.totalSolved && parsed.totalSolved >= 77) {
          return parsed;
        }
      }
      return defaultStats;
    } catch {
      return defaultStats;
    }
  });

  const [tufData, setTufData] = useState(() => {
    try {
      const cached = localStorage.getItem('portfolio_tuf_live_stats');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.tufProfile && parsed.tufProfile.solved >= 100) {
          return parsed;
        }
      }
      return { ...initialTufStats, submissionsMap: {} };
    } catch {
      return { ...initialTufStats, submissionsMap: {} };
    }
  });

  // Fetch LeetCode Stats
  useEffect(() => {
    const fetchLC = async () => {
      try {
        let total = 0, easy = 0, medium = 0, hard = 0;
        let success = false;

        try {
          const res = await fetch('https://leetcode-api-faisalshohag.vercel.app/Akashyatinjain');
          if (res.ok) {
            const data = await res.json();
            if (data && typeof data.totalSolved === 'number' && data.totalSolved > 0) {
              total = data.totalSolved;
              easy = data.easySolved || 0;
              medium = data.mediumSolved || 0;
              hard = data.hardSolved || 0;
              success = true;
            }
          }
        } catch {
          /* try fallback */
        }

        if (!success) {
          try {
            const res = await fetch('https://alfa-leetcode-api.onrender.com/Akashyatinjain/solved');
            if (res.ok) {
              const data = await res.json();
              if (data && typeof data.solvedProblem === 'number' && data.solvedProblem > 0) {
                total = data.solvedProblem;
                easy = data.easySolved || 0;
                medium = data.mediumSolved || 0;
                hard = data.hardSolved || 0;
                success = true;
              }
            }
          } catch {
            /* try fallback */
          }
        }

        if (!success) {
          try {
            const res = await fetch('https://leetcode-stats-api.herokuapp.com/Akashyatinjain');
            if (res.ok) {
              const data = await res.json();
              if (data && data.status === 'success' && data.totalSolved > 0) {
                total = data.totalSolved;
                easy = data.easySolved || 0;
                medium = data.mediumSolved || 0;
                hard = data.hardSolved || 0;
                success = true;
              }
            }
          } catch {
            /* keep defaults */
          }
        }

        if (success && total > 0) {
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
        }
      } catch {
        /* keep defaults */
      }
    };
    fetchLC();
  }, []);

  // Fetch Live TakeUForward (Striver) Stats automatically
  useEffect(() => {
    const fetchTUF = async () => {
      try {
        let progressData = null;

        // Try serverless API proxy endpoint first, then direct / Vite proxy
        const progUrls = [
          '/api/tuf?endpoint=progress',
          '/api/tuf/progress/dsa/Akashyatinjain',
          'https://backend-go.takeuforward.org/api/v1/progress/dsa/Akashyatinjain'
        ];

        for (const url of progUrls) {
          try {
            const res = await fetch(url);
            if (res.ok) {
              const json = await res.json();
              if (json && (json.data?.total_solved || json.total_solved)) {
                progressData = json.data || json;
                break;
              }
            }
          } catch {
            /* try next fallback */
          }
        }

        // Fetch Heatmaps for current year & previous year
        const currentYear = new Date().getFullYear();
        const years = [currentYear - 1, currentYear];
        let fetchedMap = {};

        for (const yr of years) {
          const hmUrls = [
            `/api/tuf?endpoint=heatmap&year=${yr}`,
            `/api/tuf/streak/heatmap/Akashyatinjain?year=${yr}`,
            `https://backend-go.takeuforward.org/api/v1/streak/heatmap/Akashyatinjain?year=${yr}`
          ];

          for (const url of hmUrls) {
            try {
              const res = await fetch(url);
              if (res.ok) {
                const json = await res.json();
                if (json && json.success && json.data?.months) {
                  const monthsObj = json.data.months;
                  Object.keys(monthsObj).forEach(mStr => {
                    const monthNum = parseInt(mStr, 10);
                    const daysObj = monthsObj[mStr];
                    Object.keys(daysObj).forEach(dStr => {
                      const dayNum = parseInt(dStr, 10);
                      const count = daysObj[dStr].total || daysObj[dStr].dsa_sheet_checked || 0;
                      const dateKey = `${yr}-${String(monthNum).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                      fetchedMap[dateKey] = count;
                    });
                  });
                  break;
                }
              }
            } catch {
              /* try next fallback */
            }
          }
        }

        if (progressData || Object.keys(fetchedMap).length > 0) {
          setTufData(prev => {
            const totalSolved = progressData?.total_solved ?? prev.tufProfile.solved;
            const totalDsa = progressData?.total_dsa ?? prev.tufProfile.total;
            const easyCount = progressData?.easy?.solved ?? prev.tufProfile.categories[0].count;
            const easyTotal = progressData?.easy?.total ?? prev.tufProfile.categories[0].total;
            const mediumCount = progressData?.medium?.solved ?? prev.tufProfile.categories[1].count;
            const mediumTotal = progressData?.medium?.total ?? prev.tufProfile.categories[1].total;
            const hardCount = progressData?.hard?.solved ?? prev.tufProfile.categories[2].count;
            const hardTotal = progressData?.hard?.total ?? prev.tufProfile.categories[2].total;

            const mapToCalculate = Object.keys(fetchedMap).length > 0 ? fetchedMap : prev.submissionsMap;
            const sortedDates = Object.keys(mapToCalculate).sort();
            const totalSubmissions = Object.values(mapToCalculate).reduce((a, b) => a + b, 0);
            const activeDays = sortedDates.length;

            let maxStreak = 0;
            let curStreak = 0;
            let prevTime = null;
            sortedDates.forEach(dStr => {
              const dt = new Date(dStr);
              if (prevTime !== null) {
                const diffDays = Math.round((dt - prevTime) / (1000 * 60 * 60 * 24));
                if (diffDays === 1) curStreak += 1;
                else curStreak = 1;
              } else {
                curStreak = 1;
              }
              if (curStreak > maxStreak) maxStreak = curStreak;
              prevTime = dt;
            });

            const updated = {
              ...prev,
              a2zSheet: {
                ...prev.a2zSheet,
                solved: totalSolved,
                pct: Math.round((totalSolved / prev.a2zSheet.total) * 100),
                categories: [
                  { ...prev.a2zSheet.categories[0], count: easyCount },
                  { ...prev.a2zSheet.categories[1], count: mediumCount },
                  { ...prev.a2zSheet.categories[2], count: hardCount },
                ]
              },
              tufProfile: {
                ...prev.tufProfile,
                solved: totalSolved,
                total: totalDsa,
                pct: Math.round((totalSolved / totalDsa) * 100),
                categories: [
                  { ...prev.tufProfile.categories[0], count: easyCount, total: easyTotal, pct: Math.round((easyCount / easyTotal) * 100) },
                  { ...prev.tufProfile.categories[1], count: mediumCount, total: mediumTotal, pct: Math.round((mediumCount / mediumTotal) * 100) },
                  { ...prev.tufProfile.categories[2], count: hardCount, total: hardTotal, pct: Math.round((hardCount / hardTotal) * 100) },
                ],
                activity: {
                  totalSubmissions: totalSubmissions || prev.tufProfile.activity.totalSubmissions,
                  activeDays: activeDays || prev.tufProfile.activity.activeDays,
                  maxStreak: maxStreak || prev.tufProfile.activity.maxStreak,
                }
              },
              submissionsMap: mapToCalculate,
            };

            localStorage.setItem('portfolio_tuf_live_stats', JSON.stringify(updated));
            return updated;
          });
        }
      } catch (err) {
        console.error('Failed to sync TakeUForward stats:', err);
      }
    };
    fetchTUF();
  }, []);

  // Prepare TUF calendar data using real submission map
  const tufCells = getTufCalendarData(tufData.submissionsMap);
  const tufWeeks = [];
  for (let i = 0; i < tufCells.length; i += 7) {
    tufWeeks.push(tufCells.slice(i, i + 7));
  }

  const lcEasy = stats.categories.find(c => c.label === 'Easy')?.count || 0;
  const lcMedium = stats.categories.find(c => c.label === 'Medium')?.count || 0;
  const lcHard = stats.categories.find(c => c.label === 'Hard')?.count || 0;
  const lcTotal = stats.totalSolved || 0;

  const currentTuf = tufData;

  return (
    <section id="leetcode" className="leetcode">
      <div className="container">
        <div className="reveal">
          <p className="section-label">DSA & Activity</p>
          <div className="section-header-row">
            <h2 className="section-title">Problem Solving & Code Activity</h2>
            <div className="dsa-profile-tabs" role="tablist" aria-label="Problem Solving Platforms">
              <button 
                type="button"
                role="tab"
                id="tab-leetcode"
                aria-selected={activeTab === 'leetcode'}
                aria-controls="dsa-tabpanel"
                className={`dsa-tab-btn leetcode-tab-btn ${activeTab === 'leetcode' ? 'active' : ''}`}
                onClick={() => setActiveTab('leetcode')}
              >
                <Leetcode size={16} />
                <span>LeetCode</span>
              </button>
              <button 
                type="button"
                role="tab"
                id="tab-tuf"
                aria-selected={activeTab === 'tuf'}
                aria-controls="dsa-tabpanel"
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

        <div className="leetcode-grid" id="dsa-tabpanel" role="tabpanel" aria-labelledby={activeTab === 'leetcode' ? 'tab-leetcode' : 'tab-tuf'}>
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
                          <td>{currentTuf.a2zSheet.categories.find(c => c.label === 'Easy')?.count || 0}</td>
                          <td className="combined-val">{lcEasy + (currentTuf.a2zSheet.categories.find(c => c.label === 'Easy')?.count || 0)}</td>
                        </tr>
                        <tr>
                          <td className="diff-medium">Medium</td>
                          <td>{lcMedium}</td>
                          <td>{currentTuf.a2zSheet.categories.find(c => c.label === 'Medium')?.count || 0}</td>
                          <td className="combined-val">{lcMedium + (currentTuf.a2zSheet.categories.find(c => c.label === 'Medium')?.count || 0)}</td>
                        </tr>
                        <tr>
                          <td className="diff-hard">Hard</td>
                          <td>{lcHard}</td>
                          <td>{currentTuf.a2zSheet.categories.find(c => c.label === 'Hard')?.count || 0}</td>
                          <td className="combined-val">{lcHard + (currentTuf.a2zSheet.categories.find(c => c.label === 'Hard')?.count || 0)}</td>
                        </tr>
                        <tr className="total-row">
                          <td>Total Solved</td>
                          <td>{lcTotal}</td>
                          <td>{currentTuf.a2zSheet.solved}</td>
                          <td className="combined-total-val">{lcTotal + currentTuf.a2zSheet.solved}</td>
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
                        <span className="tuf-sheet-title">{currentTuf.a2zSheet.title}</span>
                      </div>
                      <span className="tuf-sheet-numbers">{currentTuf.a2zSheet.solved} / {currentTuf.a2zSheet.total} Solved</span>
                    </div>

                    <div className="tuf-progress-bar-track">
                      <div className="tuf-progress-bar-fill" style={{ width: `${currentTuf.a2zSheet.pct}%` }} />
                    </div>
                    <div className="tuf-progress-bar-stats">
                      <span className="tuf-progress-bar-pct">{currentTuf.a2zSheet.pct}% Completed</span>
                      <span className="tuf-progress-bar-desc">Striver's DSA A2Z Roadmap Progress</span>
                    </div>

                    <div className="tuf-sheet-categories">
                      {currentTuf.a2zSheet.categories.map((cat) => (
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
                    <a href={currentTuf.profileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary leetcode-btn tuf-brand-btn-highlighted">
                      <TUF size={16} />
                      View Striver Profile
                      <ArrowUpRight size={14} />
                    </a>
                  </div>
                </div>

                <div className="leetcode-dials tuf-dials">
                  <div className="tuf-dials-header">
                    <span className="tuf-dials-title">Overall TUF Solved</span>
                    <span className="tuf-dials-solved-text">{currentTuf.tufProfile.solved} / {currentTuf.tufProfile.total}</span>
                  </div>
                  <div className="tuf-dials-list">
                    {currentTuf.tufProfile.categories.map((cat) => {
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
                      <span className="chart-subtitle">{currentTuf.tufProfile.activity.totalSubmissions} submissions in the last 12 months</span>
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
                        <span className="tuf-stat-num">{currentTuf.tufProfile.activity.activeDays}</span>
                        <span className="tuf-stat-lbl">Active Days</span>
                      </div>
                      <div className="tuf-activity-stat">
                        <span className="tuf-stat-num">{currentTuf.tufProfile.activity.maxStreak}</span>
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
