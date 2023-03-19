module.exports = {
  coverageDirectory: './coverage',
  collectCoverageFrom: [
    '**/src/**',
    '!**/tests/**',
    '!**/node_modules/**',
  ],
  modulePaths: ['<rootDir>/src'],
  moduleFileExtensions: [
    'js',
    'ts',
  ],
  moduleNameMapper: {
    '#node-web-compat': './node-web-compat-node.js',
  },
  testEnvironment: 'node',
  testMatch: [
    '**/tests/**/*.test?(s).ts',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
  ],
  transform: {
    '\\.ts$': ['ts-jest'],
  },
};