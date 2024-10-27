module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:svelte/recommended',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'svelte',
  ],
  overrides: [
    {
      files: ['*.svelte'],
      processor: 'svelte/svelte',
    },
  ],
  rules: {
    // Add your custom rules here
  },
};