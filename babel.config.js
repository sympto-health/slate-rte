module.exports = {
  plugins: [
  ],
  presets: [
    [
      '@babel/preset-env',
      { targets: { node: 'current' } },
    ],
    '@babel/preset-react',
    '@babel/preset-typescript',
    'jest',
  ],
  only: [
    './**/*.ts',
    './**/*.tsx',
  ],
};
