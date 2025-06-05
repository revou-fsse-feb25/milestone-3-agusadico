const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer({
  presets: ['next/babel'],
  plugins: [
    // Add the istanbul plugin for code coverage with specific configuration
    ['babel-plugin-istanbul', {
      exclude: [
        'node_modules',
        '.next',
        'coverage',
        '**/*.test.{js,jsx,ts,tsx}',
        '**/*.spec.{js,jsx,ts,tsx}'
      ],
      include: [
        'src/app/admin/page.tsx' // Explicitly include the admin page
      ]
    }]
  ],
  babelrc: false,
  configFile: false,
  // This is the key part - it ensures the 'use client' directive is properly handled
  overrides: [
    {
      test: /\.(jsx?|tsx?)$/,  // Include both JSX and TSX files
      plugins: [
        // This plugin will strip the 'use client' directive before testing
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