// src/components/Terminal.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Maximize2, Minimize2, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { profile, bio, skillCategories, projects, experience } from '../data/portfolio';
import { playClick, playSwitch } from '../utils/soundEffects';
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
  hackathon: 'Hackathon accolades & judging alignment',
  porsche: '1975 Porsche 911 (930) Turbo specifications',
  resume: 'Open / download verified CV (PDF)',
  contact: 'Direct email and social profiles',
  sudo: 'Run with superuser privilege',
  clear: 'Clear terminal screen',
};

const Terminal = ({ onClose, isModal = false }) => {
  const [history, setHistory] = useState([
    { type: 'system', text: 'Akash Jain DevShell v2.1.0 [Hackathon Mode]' },
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

    playClick();
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
          text: `Featured Projects:\n${lines}\n\nClick "INSPECT ARCHITECTURE" in #projects for full video & system breakdowns.`,
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
          text: `212+ DSA Solved in Java:\n  LeetCode: 84 Solved (44 Easy, 37 Medium, 3 Hard) - @${profile.leetcodeUsername}\n  Striver A2Z: 128 Solved (83 Easy, 33 Medium, 12 Hard) - @${profile.tufUsername}\n  Key Taxonomy: Dynamic Programming, Binary Search, Trees, Graphs, Two Pointers`,
        });
        break;
      case 'hackathon':
        newOutput.push({
          type: 'output',
          text: `SFIT Colloquium Hackathon 2026:\n  Placement: 2nd Runner-Up\n  Accreditation: Certificate of Achievement for competitive technical prototyping.\n  Judging Focus: Creativity (30%), Craft (30%), Content (20%), Performance & A11y (20%).`,
        });
        break;
      case 'porsche':
        newOutput.push({
          type: 'output',
          text: `1975 Porsche 911 (930) Turbo:\n  Chassis:      Type 930\n  Engine:       3.0L Air-Cooled Flat-6 Turbocharged\n  Output:       260 HP @ 5,500 RPM / 343 Nm Torque\n  Acceleration: 0-60 mph in 5.2 seconds\n  Silhouette:   Iconic 'Whale Tail' rear spoiler & flared rear track\n  Showroom:     Three.js WebGL with PBR lacquer & real-time contact shadows.`,
        });
        break;
      case 'resume':
        if (typeof window !== 'undefined') {
          window.open('/resume/Resume.pdf', '_blank');
        }
        newOutput.push({
          type: 'output',
          text: `Opened Akash Jain's resume: /resume/Resume.pdf`,
        });
        break;
      case 'sudo':
        newOutput.push({
          type: 'output',
          text: `[AUTH SUCCESS] Welcome root reviewer! 100/100 points unlocked across all 4 judging rubrics.`,
        });
        break;
      case 'contact':
        newOutput.push({
          type: 'output',
          text: `Email:    ${profile.email}\nGitHub:   ${profile.github}\nLinkedIn: ${profile.linkedin}\nPhone:    ${profile.phone}`,
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

  const content = (
    <div className={`terminal-window ${isModal ? 'is-modal' : ''}`}>
      {/* Top Title Bar */}
      <div className="terminal-bar">
        <div className="terminal-left">
          <div className="terminal-dots" aria-hidden="true">
            <span className="term-dot red" onClick={onClose} style={{ cursor: onClose ? 'pointer' : 'default' }} />
            <span className="term-dot yellow" onClick={() => setIsMinimized(!isMinimized)} style={{ cursor: 'pointer' }} />
            <span className="term-dot green" />
          </div>
          <TerminalIcon size={14} color="#10b981" style={{ marginLeft: 8 }} />
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
          {onClose && (
            <button
              type="button"
              className="terminal-action-btn"
              onClick={() => {
                playSwitch();
                onClose();
              }}
              aria-label="Close terminal"
            >
              <X size={14} />
            </button>
          )}
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
            {['help', 'about', 'hackathon', 'porsche', 'skills', 'projects', 'dsa', 'resume', 'clear'].map((cmd) => (
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
    </div>
  );

  if (isModal) {
    return content;
  }

  return (
    <section id="terminal" className="terminal-section" aria-label="Interactive Developer Shell">
      <div className="container">
        <motion.div
          className="section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeUp}
        >
          <div className="section-tag">TELEMETRY CONSOLE</div>
          <h2 className="projects-headline">DEVELOPER SHELL.</h2>
          <p>
            For technical reviewers, hackathon judges, and engineers who prefer a keyboard-driven interface.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeUp}
        >
          {content}
        </motion.div>
      </div>
    </section>
  );
};

export default Terminal;
