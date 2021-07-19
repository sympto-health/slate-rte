module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
  // The directory where Jest should output its coverage files
  modulePaths: ['node_modules'],
  testEnvironment: 'jsdom',
  testURL: 'http://localhost',
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\](?!(@capacitor)/)'],
  verbose: true,
  transform: {
    '^.+\\.tsx?$': 'babel-jest',
    '^.+\\.ts?$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss)$': '<rootDir>/__mocks__/fileMock.js',
    verbose: true,
  },
};
