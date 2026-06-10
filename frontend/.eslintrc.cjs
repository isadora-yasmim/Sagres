//decidir se mantem o eslint.config.js do Vite ou o .eslintrc.cjs que já estava no projeto
//os dois tem coisas que se complementam, o ideal seria fazer uma fusão dos dois arquivos. Verificar antes da entrega final.

// ──────────────────────────────────────────────
// SAGRES Monitoria — frontend/.eslintrc.cjs
// ──────────────────────────────────────────────

module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',       // React 17+ (sem import React)
    'plugin:react-hooks/recommended',
    'prettier',                        // Desativa regras que conflitam com Prettier
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react', 'react-hooks', 'react-refresh'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // React
    'react/prop-types': 'warn',
    'react/display-name': 'warn',
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

    // Hooks
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // Geral
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'error',
    'no-var': 'error',
  },
};
