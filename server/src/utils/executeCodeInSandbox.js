import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { v4 as uuid } from 'uuid';

const TEMP_DIR = path.join(process.cwd(), 'CodeSandbox', 'temp');

const toDockerPath = (windowsPath) =>
  windowsPath.replace(/\\/g, '/').replace(/^([A-Za-z]):/, (_, drive) => `/${drive.toLowerCase()}`);

export const executeCodeInSandbox = async (code, language) => {
  const id = uuid();
  const userDir = path.join(TEMP_DIR, id);

  const config = {
    javascript: {
      filename: 'main.js',
      image: 'codecollab-runner', // your custom image with node
      command: 'node /app/main.js',
    },
    python: {
      filename: 'main.py',
      image: 'python:3.10-slim',
      command: 'python /app/main.py',
    },
    // Add more languages here
  };

  const langConfig = config[language];

  if (!langConfig) {
    throw new Error(`Unsupported language: ${language}`);
  }

  fs.mkdirSync(userDir, { recursive: true });
  const filePath = path.join(userDir, langConfig.filename);
  fs.writeFileSync(filePath, code);

  console.log('Creating temp file at:', filePath);

  const dockerCommand = `docker run --rm -v ${toDockerPath(userDir)}:/app -w /app ${langConfig.image} ${langConfig.command}`;

  console.log('Running Docker command :\n', dockerCommand);
  console.log('Code to execute:\n', code);

  return new Promise((resolve, reject) => {
    exec(dockerCommand, { timeout: 5000, maxBuffer: 1024 * 500 }, (error, stdout, stderr) => {
      const trimmedStdout = stdout?.trim();
      const trimmedStderr = stderr?.trim();

      console.log('TRIMMED STDOUT:', trimmedStdout);
      console.log('TRIMMED STDERR:', trimmedStderr);
      console.log('Exec Error:', error);

      // Clean up temp files
      fs.rmSync(userDir, { recursive: true, force: true });

      if (error || trimmedStderr) {
        return reject(trimmedStderr || error.message || 'Execution failed');
      }

      resolve(trimmedStdout || '[no output]');
    });
  });
};
