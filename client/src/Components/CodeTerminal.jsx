// components/CodeTerminal.jsx
import React, { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';

const CodeTerminal = ({ output }) => {
  const terminalRef = useRef(null);
  const xtermRef = useRef(null);

  useEffect(() => {
    // Initialize xterm only once
    if (!xtermRef.current) {
      xtermRef.current = new Terminal({
        convertEol: true,
        fontSize: 14,
        theme: {
          background: '#1e1e1e',
          foreground: '#d4d4d4',
        },
      });
      xtermRef.current.open(terminalRef.current);
    }

    // Clear and write new output
    xtermRef.current.clear();
    if (output) {
      xtermRef.current.writeln(output);
    } else {
      xtermRef.current.writeln('Waiting for output...');
    }
  }, [output]);

  return (
    <div ref={terminalRef} className="w-full h-64 overflow-hidden rounded border border-gray-700" />
  );
};

export default CodeTerminal;
