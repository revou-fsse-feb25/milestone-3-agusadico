const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer({
  presets: ['next/babel'],
  plugins: [
    ['babel-plugin-istanbul', {
      // No exclusions for this specific file
      include: [
        'src/app/api/products/route.ts' // Explicitly include the products route
      ],
      // Explicitly exclude test files
      exclude: [
        'src/**/*.test.ts',
        'src/**/__tests__/**'
      ]
    }],
  ],
  babelrc: false,
  configFile: false,
  overrides: [
    {
      test: /\.(js|jsx|ts|tsx)$/,  // Include all JS/TS file types
      plugins: [
        // This plugin will strip any directives that might interfere with testing
        function stripUseClientDirective() {
          return {
            visitor: {
              Program: {
                enter(path) {
                  const directiveNode = path.node.directives?.find(
                    (directive) => directive.value.value === 'use client'
                  );
                  if (directiveNode) {
                    path.node.directives = path.node.directives.filter(
                      (directive) => directive !== directiveNode
                    );
                  }
                }
              }
            }
          };
        },
      ],
    },
  ],
});