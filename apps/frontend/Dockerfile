FROM public.ecr.aws/docker/library/node:22-alpine

WORKDIR /app

# Set environment variables
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Install AWS Lambda Web Adapter
RUN apk add --no-cache curl
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.9.0 /lambda-adapter /opt/extensions/lambda-adapter

# Copy necessary files from builder
COPY --chown=nextjs:nodejs ./.next/standalone /app/
COPY --chown=nextjs:nodejs ./.next/static /app/apps/frontend/.next/static
COPY --chown=nextjs:nodejs ./public /app/apps/frontend/public

USER nextjs

# Expose the port the app runs on
EXPOSE 3000
ENV PORT=3000

# Start the application
CMD ["node", "./apps/frontend/server.js"] 