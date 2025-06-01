// client/.eslint.config.js
import js from '@eslint/js';
import globals from 'globals';
import prettierPlugin from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import babelParser from '@babel/eslint-parser'; // Import the babel parser

export default [
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parser: babelParser, // Specify @babel/eslint-parser
      parserOptions: {
        requireConfigFile: false, // Set to false if you don't have a Babel config file
        babelOptions: {
          presets: ['@babel/preset-react'], // Ensure it can parse JSX
          // Add other babel plugins/presets if your project uses them
        },
      },
    },
    plugins: {
      prettier: prettierPlugin,
      react: reactPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // Not needed for React 17+
      'prettier/prettier': [{ endOfLine: 'lf' }], // <--- CHANGE THIS TO 'lf'
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
