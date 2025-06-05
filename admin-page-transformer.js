const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer({
  presets: ['next/babel'],
  plugins: [
    ['babel-plugin-istanbul', {
      // No exclusions for this specific file
    }],
  ],
  babelrc: false,
  configFile: false,
  overrides: [
    {
      test: /\.tsx?$/,
      plugins: [
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