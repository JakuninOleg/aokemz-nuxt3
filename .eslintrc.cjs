module.exports = {
  root: true,
  env: { browser: true, node: true, es2022: true },
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  extends: ['eslint:recommended'],
  // Nuxt supplies framework globals through its generated auto-imports.
  rules: { 'no-undef': 'off', 'no-unused-vars': 'off' },
  overrides: [{
    files: ['*.vue'],
    parser: 'vue-eslint-parser',
    parserOptions: { parser: '@typescript-eslint/parser' },
    extends: ['plugin:vue/vue3-essential'],
    rules: { 'vue/multi-word-component-names': 'off' },
  }],
  ignorePatterns: ['graphify-out/**', 'artifacts/**', 'deploy/**'],
}
