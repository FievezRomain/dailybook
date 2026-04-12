/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/tests/unit/setup.ts'],
  roots: ['<rootDir>/tests/unit'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: { jsx: 'react' } }],
  },
  collectCoverageFrom: [
    'shared/utils/**/*.{ts,tsx}',
    'hooks/queries/**/*.{ts,tsx}',
    '!**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      lines: 70,
      functions: 70,
      branches: 70,
      statements: 70,
    },
  },
  moduleNameMapper: {
    '^react-dom/test-utils$': '<rootDir>/node_modules/react-dom/test-utils.js',
    'httpClient': '<rootDir>/tests/__mocks__/httpClient.ts',
  },
};

module.exports = config;
