import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Maximize2, Minimize2 } from 'lucide-react';
import { profile, bio, skills, experience, stats } from '../data/portfolio';
import './Terminal.css';

const COMMANDS = {
  help: 'Show available commands',
  about: 'Learn more about me',
  skills: 'See my technical skills',
  projects: 'View details of my projects',
  experience: 'Check out my roles and hackathons',
  dsa: 'Get my LeetCode & problem-solving progress',
  contact: 'Find my email, phone, and links',
  theme: 'Switch theme. Usage: theme [light|dark|matrix]',
  clear: 'Clear terminal screen',
};

const Terminal = () => {
  const [history, setHistory] = useState([
    { type: 'system', text: 'Welcome to Akash\'s Interactive Dev Shell (v1.0.0).' },
    { type: 'system', text: 'Type "help" to see available commands or "theme matrix" for a hacker vibe.' },
  ]);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMinimized, setIsMinimized] = useState(false);
  const terminalEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [history, isMinimized]);

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeCommand();
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

  const executeCommand = () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const parts = trimmedInput.toLowerCase().split(' ');
    const command = parts[0];
    const args = parts.slice(1);

    // Save in command history
    setCmdHistory((prev) => [...prev, trimmedInput]);
    setHistoryIndex(-1);

    // Add input command line to terminal output
    const newOutput = [...history, { type: 'input', text: `akash-dev-shell:~$ ${trimmedInput}` }];

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
          text: `Akash Jain — IT Student & Full-Stack Developer\n\nBio:\n${bio.intro}\n\nCurrently:\n${bio.currently}\n\nInterests: ${bio.interests.join(', ')}`,
        });
        break;
      case 'skills':
        const primary = skills.find(s => s.primary)?.items.join(', ');
        const secondary = skills.find(s => !s.primary)?.items.join(', ');
        newOutput.push({
          type: 'output',
          text: `Primary Stack:\n  ${primary}\n\nAdditional experience:\n  ${secondary}`,
        });
        break;
      case 'projects':
        newOutput.push({
          type: 'output',
          text: `DataStock Cloud App: https://data-stock.vercel.app/\nFinance Tracker: https://budget-tracker-no3.vercel.app/\nSwasthya Health: https://sih-rho-liard.vercel.app/\nSimon Game: https://akashyatinjain.github.io/Simon-Game/\nDrum Kit: https://akashyatinjain.github.io/Drums/\n\nUse "live [url]" to open a site directly or type "github" for source code.`,
        });
        break;
      case 'experience':
        const expText = experience.map(exp => 
          `• ${exp.role} @ ${exp.organization} (${exp.period})\n  ${exp.description}\n  Tech: ${exp.tags.join(', ')}`
        ).join('\n\n');
        newOutput.push({
          type: 'output',
          text: `Relevant Experience:\n\n${expText}`,
        });
        break;
      case 'dsa':
        newOutput.push({
          type: 'output',
          text: `DSA Problems Solved: ${stats.problemsSolved}\nLeetCode Username: Akashyatinjain\nStriver TUF Profile: takeuforward.org/profile/Akashyatinjain\n\nKeep practicing arrays, hash map, trees, graphs, and DP!`,
        });
        break;
      case 'contact':
        newOutput.push({
          type: 'output',
          text: `Email: AJ0881871@gmail.com\nPhone: +91 7710926977\nGitHub: https://github.com/Akashyatinjain\nLinkedIn: https://www.linkedin.com/in/akash-yatin-jain`,
        });
        break;
      case 'theme':
        if (args.length === 0) {
          newOutput.push({ type: 'error', text: 'Please specify a theme. Options: theme light | theme dark | theme matrix' });
        } else {
          const selectedTheme = args[0];
          if (['light', 'dark', 'matrix'].includes(selectedTheme)) {
            localStorage.setItem('portfolio_theme', selectedTheme);
            document.documentElement.setAttribute('data-theme', selectedTheme);
            window.dispatchEvent(new Event('theme-changed'));
            newOutput.push({ type: 'success', text: `Theme successfully switched to "${selectedTheme}"!` });
          } else {
            newOutput.push({ type: 'error', text: `Unknown theme "${selectedTheme}". Choose from: light, dark, matrix.` });
          }
        }
        break;
      case 'live':
        if (args.length === 0) {
          newOutput.push({ type: 'error', text: 'Usage: live [url]' });
        } else {
          const url = args[0].startsWith('http') ? args[0] : `https://${args[0]}`;
          window.open(url, '_blank');
          newOutput.push({ type: 'success', text: `Opening ${url} in a new tab...` });
        }
        break;
      case 'github':
        window.open('https://github.com/Akashyatinjain', '_blank');
        newOutput.push({ type: 'success', text: 'Opening GitHub profile...' });
        break;
      case 'sudo':
        if (args[0] === 'rm' && args[1] === '-rf') {
          newOutput.push({ 
            type: 'error', 
            text: 'WARNING: ACCESS DENIED.\nYou do not have permissions to execute "rm -rf" on the user\'s brain.\nAlso, nice try! 😉' 
          });
        } else {
          newOutput.push({ type: 'error', text: 'Only standard commands allowed. Sudo usage restricted.' });
        }
        break;
      case 'hack':
        newOutput.push({
          type: 'success',
          text: 'Initializing mainframe bypass...\nDecrypting firewalls...\nAccess granted!\nWelcome to the Matrix. 🕶️',
        });
        break;
      default:
        newOutput.push({
          type: 'error',
          text: `Command not found: "${trimmedInput}". Type "help" to see all valid commands.`,
        });
    }

    setHistory(newOutput);
    setInput('');
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <section className="terminal-section" id="developer-shell">
      <div className="container">
        <div className="reveal">
          <p className="section-label">Dev Sandbox</p>
          <h2 className="section-title">Interactive Terminal</h2>
          <p className="section-desc">
            Type commands directly to query my profile, project links, or switch site themes dynamically.
          </p>
        </div>

        <div className={`terminal-window card ${isMinimized ? 'minimized' : ''}`} onClick={focusInput}>
          {/* Header Bar */}
          <div className="terminal-bar">
            <div className="terminal-left">
              <TerminalIcon size={14} className="terminal-bar-icon" />
              <span className="terminal-title">akash@sfit-server:~/portfolio</span>
            </div>
            <div className="terminal-actions">
              <button 
                type="button" 
                className="terminal-btn-action minimize" 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMinimized(!isMinimized);
                }}
                title={isMinimized ? "Maximize" : "Minimize"}
              >
                {isMinimized ? <Maximize2 size={10} /> : <Minimize2 size={10} />}
              </button>
            </div>
          </div>

          {/* Terminal Screen */}
          {!isMinimized && (
            <div className="terminal-screen">
              <div className="terminal-history">
                {history.map((line, idx) => (
                  <div key={idx} className={`terminal-line type-${line.type}`}>
                    {line.text}
                  </div>
                ))}
                <div ref={terminalEndRef} />
              </div>

              {/* Input Row */}
              <div className="terminal-input-row">
                <span className="terminal-prompt">akash-dev-shell:~$</span>
                <input
                  ref={inputRef}
                  type="text"
                  className="terminal-input-field"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  aria-label="Terminal input"
                  placeholder="Type 'help'..."
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Terminal;
