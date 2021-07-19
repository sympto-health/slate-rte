module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
  modulePaths: ['src', 'node_modules'],
  testEnvironment: 'jsdom',
  testURL: 'http://localhost',
  rootDir: 'src',
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
