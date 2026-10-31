// src/components/Terminal.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Maximize2, Minimize2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { profile, bio, skillCategories, projects, experience } from '../data/portfolio';
import './Terminal.css';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

const COMMANDS = {
  help: 'Show available commands',
  about: 'Background, bio, and engineering philosophy',
  skills: 'Categorized technical capabilities',
  projects: 'Featured projects and live links',
  experience: 'Roles, hackathons, and leadership milestones',
  dsa: 'Algorithmic stats and problem-solving metrics',
  contact: 'Direct email and social profiles',
  clear: 'Clear terminal screen',
};

const Terminal = () => {
  const [history, setHistory] = useState([
    { type: 'system', text: 'Akash Jain DevShell v2.0.0 [Production Mode]' },
    { type: 'system', text: 'Type "help" to list available commands or click a pill below.' },
  ]);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMinimized, setIsMinimized] = useState(false);
  const historyRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [history, isMinimized]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIdx = historyIndex === -1 ? cmdHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInput(cmdHistory[nextIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      if (historyIndex === -1) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= cmdHistory.length) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        setHistoryIndex(nextIdx);
        setInput(cmdHistory[nextIdx]);
      }
    }
  };

  const executeCommand = (cmdToRun) => {
    const trimmedInput = (cmdToRun || '').trim();
    if (!trimmedInput) return;

    const parts = trimmedInput.toLowerCase().split(' ');
    const command = parts[0];

    // Save in command history
    setCmdHistory((prev) => [...prev, trimmedInput]);
    setHistoryIndex(-1);

    const newOutput = [...history, { type: 'input', text: `akash@portfolio:~$ ${trimmedInput}` }];

    switch (command) {
      case 'help':
        newOutput.push({
          type: 'output',
          text: Object.entries(COMMANDS)
            .map(([cmd, desc]) => `  ${cmd.padEnd(12)} - ${desc}`)
            .join('\n'),
        });
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      case 'about':
        newOutput.push({
          type: 'output',
          text: `${profile.name} — ${profile.title}\n${profile.headline}\n\nCurrently:\n${bio.currently}\n\nInterests: ${bio.interests.join(', ')}`,
        });
        break;
      case 'skills': {
        const lines = skillCategories
          .map((cat) => `  [${cat.label}] ${cat.items.join(', ')}`)
          .join('\n');
        newOutput.push({
          type: 'output',
          text: `Technical Capabilities:\n${lines}`,
        });
        break;
      }
      case 'projects': {
        const featured = projects.filter((p) => p.featured);
        const lines = featured
          .map((p) => `  * ${p.title} (${p.tech.join(', ')}) -> ${p.liveUrl}`)
          .join('\n');
        newOutput.push({
          type: 'output',
          text: `Featured Projects:\n${lines}\n\nVisit #projects section for full architecture breakdowns.`,
        });
        break;
      }
      case 'experience': {
        const lines = experience
          .map((e) => `  * ${e.role} @ ${e.organization} [${e.period}]\n    ${e.description}`)
          .join('\n\n');
        newOutput.push({
          type: 'output',
          text: `Roles & Experience:\n${lines}`,
        });
        break;
      }
      case 'dsa':
        newOutput.push({
          type: 'output',
          text: `LeetCode: @${profile.leetcodeUsername}\nStriver A2Z Sheet: @${profile.tufUsername}\nKey Topics: Dynamic Programming, Binary Search, Trees, Graphs, Two Pointers`,
        });
        break;
      case 'contact':
        newOutput.push({
          type: 'output',
          text: `Email:    ${profile.email}\nGitHub:   ${profile.github}\nLinkedIn: ${profile.linkedin}`,
        });
        break;
      default:
        newOutput.push({
          type: 'error',
          text: `Command not found: "${command}". Type "help" for a list of valid commands.`,
        });
        break;
    }

    setHistory(newOutput);
    setInput('');
  };

  return (
    <section id="terminal" className="terminal-section">
      <div className="container">
        <motion.div
          className="section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeUp}
        >
          <span className="section-label">Interactive Shell</span>
          <h2 className="section-title">Developer Console</h2>
          <p className="section-desc">
            For technical reviewers and judges who prefer a keyboard-driven interface.
          </p>
        </motion.div>

        <motion.div
          className="terminal-window"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeUp}
        >
          {/* Top Title Bar */}
          <div className="terminal-bar">
            <div className="terminal-left">
              <div className="terminal-dots" aria-hidden="true">
                <span className="term-dot red" />
                <span className="term-dot yellow" />
                <span className="term-dot green" />
              </div>
              <TerminalIcon size={14} color="var(--accent)" style={{ marginLeft: 8 }} />
              <span className="terminal-title">akash@dev-shell: ~ (zsh)</span>
            </div>
            <div className="terminal-actions">
              <button
                type="button"
                className="terminal-action-btn"
                onClick={() => setIsMinimized(!isMinimized)}
                aria-label={isMinimized ? 'Expand terminal' : 'Minimize terminal'}
              >
                {isMinimized ? <Maximize2 size={13} /> : <Minimize2 size={13} />}
              </button>
            </div>
          </div>

          {/* Terminal Body */}
          {!isMinimized && (
            <>
              <div
                className="terminal-body"
                ref={historyRef}
                onClick={() => inputRef.current?.focus()}
              >
                <div className="terminal-history">
                  {history.map((item, idx) => (
                    <div key={idx} className={`terminal-line ${item.type}`}>
                      {item.text}
                    </div>
                  ))}
                </div>

                <div className="terminal-input-row">
                  <span className="terminal-prompt">akash@portfolio:~$</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="terminal-input"
                    aria-label="Terminal command prompt"
                    autoComplete="off"
                    spellCheck="false"
                  />
                </div>
              </div>

              {/* Quick suggestions pills */}
              <div className="terminal-quick-pills">
                <span className="quick-label">Quick Run:</span>
                {['help', 'about', 'skills', 'projects', 'dsa', 'contact', 'clear'].map((cmd) => (
                  <button
                    key={cmd}
                    type="button"
                    className="quick-btn"
                    onClick={() => executeCommand(cmd)}
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Terminal;
