module.exports = {
  plugins: [
  ],
  presets: ['@babel/preset-react', '@babel/preset-env', '@babel/preset-typescript','jest'],
  only: [
    './**/*.ts',
    './**/*.tsx',
  ],
};
