const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer({
  presets: ['next/babel'],
  plugins: [
    ['babel-plugin-istanbul', {
      // Explicitly include the route.for-coverage.ts file
      include: ['**/route.for-coverage.ts'],
      // No exclusions
      exclude: []
    }],
  ],
  babelrc: false,
  configFile: false,
});