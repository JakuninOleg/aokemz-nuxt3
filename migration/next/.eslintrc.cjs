module.exports = {
  root: true,
  env: { browser: true, node: true, es2022: true },
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } },
  extends: ['eslint:recommended'],
  rules: { 'no-undef': 'off', 'no-unused-vars': 'off' },
  ignorePatterns: ['.next/**', '.data/**', 'node_modules/**', 'src/payload-types.ts'],
};
