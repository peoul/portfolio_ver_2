import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'

export default tseslint.config([
  // `build` is the React Router output dir (not `dist`); `.react-router`
  // holds generated route types — neither is ours to lint.
  globalIgnores(['dist', 'build', '.react-router']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  {
    // Framework-mode route modules must export `meta`/`links` alongside the
    // component — that is the React Router contract, so the react-refresh
    // single-export rule doesn't apply here.
    files: ['src/root.tsx', 'src/routes/**/*.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
