//@ts-check

const { composePlugins, withNx } = require('@nx/next')
const createMDX = require('@next/mdx')
const remarkGfm = require('remark-gfm').default
const rehypePrism = require('rehype-prism-plus').default

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypePrism],
  },
})

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  output: 'standalone',
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  rewrites: async () => [
    {
      source: '/graphql',
      destination: 'http://localhost:4000/graphql',
    },
    {
      source: '/graphql/:path*',
      destination: 'http://localhost:4000/graphql/:path*',
    },
  ],
}

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withMDX,
  withNx,
]

module.exports = composePlugins(...plugins)(nextConfig)
