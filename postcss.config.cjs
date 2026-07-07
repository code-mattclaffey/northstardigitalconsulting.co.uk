const purgecss = require('@fullhuman/postcss-purgecss');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  plugins: [
    // Only run PurgeCSS in production builds
    ...(isProduction
      ? [
          purgecss({
            // Scan all Astro, JSX, TSX, and HTML files
            content: [
              './src/**/*.astro',
              './src/**/*.jsx',
              './src/**/*.tsx',
              './src/**/*.html',
              './src/**/*.js',
              './src/**/*.ts',
              './public/**/*.html',
            ],
            // Safelist classes that should never be purged
            safelist: {
              standard: [
                'o-grid',
                'html',
                'body',
              ],
              deep: [
                /^o-grid__item/,  // Keep all grid item classes
                /^c-/,             // Keep all component classes
                /^u-/,             // Keep all utility classes
              ],
              greedy: [
                /data-/,           // Keep data attributes
                /aria-/,           // Keep aria attributes
              ],
            },
            // Default extractor for matching class names
            defaultExtractor: content => {
              // Match anything that looks like a class name
              const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];
              const innerMatches = content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || [];
              return broadMatches.concat(innerMatches);
            },
          }),
        ]
      : []),
  ],
};
