'use client';

import React, { useState } from 'react';

export default function Page() {
  const [commandInput, setCommandInput] = useState('');
  const designPrinciples = [
    "Learning should be fun and delightful",
    "Interfaces fade, letting content shine",
    "Remove friction, don't add complexity",
    "Build practical, time-saving systems",
    "Good design is invisible until needed"
  ];

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // Future: Add command processing logic
      console.log(commandInput);
      setCommandInput('');
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="terminal-window max-w-4xl mx-auto">
        <div className="terminal-header bg-gray-800 p-2 rounded-t-lg">
          <span>kai@portfolio:~</span>
        </div>
        <div className="terminal-content p-4">
          <h1 className="text-2xl mb-4">
            Kai: Interdisciplinary Product Designer
          </h1>
          <p className="mb-4">
            {">"} Making learning feel like play
          </p>

          <h2 className="text-xl mt-4 mb-2">Design Principles:</h2>
          {designPrinciples.map((principle, index) => (
            <p key={index} className="ml-4">
              {index + 1}. {principle}
            </p>
          ))}

          <h2 className="text-xl mt-6 mb-2">Projects:</h2>
          <div className="ml-4">
            <a
              href="/debt-payoff"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              💰 Debt Payoff Calculator - Compare strategies to pay off debt faster
            </a>
          </div>

          <div className="command-line mt-4 flex items-center">
            <span className="mr-2">{">"}</span>
            <input
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              onKeyDown={handleCommand}
              className="bg-transparent outline-none flex-grow"
              placeholder="Type a command..."
            />
            <span className="animate-pulse">|</span>
          </div>
        </div>
      </div>
    </div>
  );
}