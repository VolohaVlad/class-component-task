export default {
  preset: 'ts-jest',
  testEnvironment: 'jest-fixed-jsdom',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/src/test-utils/setupTests.ts'],
  testPathIgnorePatterns: ['<rootDir>/node_modules', '<rootDir>/dist'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 50,
      functions: 50,
      lines: 50,
    },
  },
};
