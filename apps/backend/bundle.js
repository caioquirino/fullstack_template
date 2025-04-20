const { build } = require('esbuild')
const { join } = require('path')

// These are optional dependencies that NestJS tries to load dynamically
const externalDeps = [
  '@nestjs/platform-socket.io',
  '@grpc/grpc-js',
  '@grpc/proto-loader',
  'mqtt',
  'nats',
  'kafkajs',
  'amqplib',
  'amqp-connection-manager',
  'ioredis',
  'class-transformer/storage',
  '@fastify/static',
  '@fastify/view',
  '@fastify/cors',
  '@fastify/helmet',
  '@fastify/compress',
  'typescript',
  'aws-lambda',
]

// Bundle each entry point directly from TypeScript
const entryPoints = ['dist/main.js', 'dist/lambda.js', 'dist/generate-schema.js']

Promise.all(
  entryPoints.map((entry) =>
    build({
      entryPoints: [entry],
      bundle: true,
      platform: 'node',
      target: 'node18',
      outdir: join(__dirname, 'dist-bundle'),
      external: externalDeps,
      format: 'cjs',
      keepNames: true,
      mainFields: ['main', 'module', 'handler'],
      sourcemap: false,
      minify: false,
      define: {
        'process.env.NODE_ENV': '"production"',
      },
      loader: {
        '.ts': 'ts',
      },
      tsconfigRaw: {
        extends: './tsconfig.app.json',
        compilerOptions: {
          experimentalDecorators: true,
          emitDecoratorMetadata: true,
        },
      },
    }),
  ),
)
  .then(() => console.log('Build complete'))
  .catch(() => process.exit(1))
