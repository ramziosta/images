module.exports = {
  roots: ['<rootDir>/src'], // Look for tests in the src directory
  testMatch: ['**/tests/**/*.test.ts'], // Look for test files ending with .test.ts inside tests directory
  transform: {
    '^.+\\.ts?$': 'ts-jest', // Transform TypeScript files
  },
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js'], // Support for TypeScript and JavaScript
  // Optional: Add coverage directory and thresholds
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};