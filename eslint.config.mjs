import pluginTs from '@typescript-eslint/eslint-plugin';
import parserTs from '@typescript-eslint/parser';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginSecurity from 'eslint-plugin-security';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['node_modules/**', 'tests/**/*.test.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': pluginTs,
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      security: pluginSecurity,
    },
    languageOptions: {
      parser: parserTs,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'security/detect-object-injection': 'warn',
      'no-console': 'warn',
      // Block react-native-paper imports outside shared/ — enforce migration to Tamagui
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'react-native-paper',
              message: 'Use components from shared/components/ui/ instead of react-native-paper.',
            },
          ],
        },
      ],
    },
  },
  // Allow react-native-paper in shared/ (bridge components during migration)
  {
    files: ['shared/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
];
