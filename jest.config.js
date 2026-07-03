/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/tests/unit/setup.ts'],
  roots: ['<rootDir>/tests/unit', '<rootDir>/features', '<rootDir>/hooks', '<rootDir>/utils'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: { jsx: 'react' } }],
  },
  collectCoverageFrom: [
    'features/**/{components,hooks}/*.{ts,tsx}',
    'hooks/queries/**/*.{ts,tsx}',
    'utils/**/*.{ts,tsx}',
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
    '^@features/(.*)$': '<rootDir>/features/$1',
    '^@shared/(.*)$': '<rootDir>/shared/$1',
    '^@hooks/(.*)$': '<rootDir>/hooks/$1',
    '^@services/(.*)$': '<rootDir>/services/$1',
    '^@stores/(.*)$': '<rootDir>/stores/$1',
    '^@theme/(.*)$': '<rootDir>/theme/$1',
    '^@models/(.*)$': '<rootDir>/models/$1',
    '^@utils/(.*)$': '<rootDir>/utils/$1',
    '^@config/(.*)$': '<rootDir>/config/$1',
    '^@business/(.*)$': '<rootDir>/business/$1',
    '^@navigation/(.*)$': '<rootDir>/navigation/$1',
    '^@constants/(.*)$': '<rootDir>/constants/$1',
    '^react-dom/test-utils$': '<rootDir>/node_modules/react-dom/test-utils.js',
    'httpClient': '<rootDir>/tests/__mocks__/httpClient.ts',
    '^expo-haptics$': '<rootDir>/tests/__mocks__/expoHaptics.ts',
    '^expo-secure-store$': '<rootDir>/tests/__mocks__/expoSecureStore.ts',
    '^react-native-toast-message$': '<rootDir>/tests/__mocks__/toastMessage.ts',
    '^@react-navigation/(.*)$': '<rootDir>/tests/__mocks__/@react-navigation/native.ts',
    '^firebase/auth$': '<rootDir>/tests/__mocks__/firebase.ts',
    '^.*services/logs/LoggerService$': '<rootDir>/tests/__mocks__/loggerService.ts',
    '^.*shared/utils/GroupHelpers$': '<rootDir>/tests/__mocks__/groupHelpers.ts',
  },
};

module.exports = config;
