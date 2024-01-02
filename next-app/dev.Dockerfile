FROM node:18-alpine

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
  # Allow install without lockfile, so example works even without Node.js installed locally
  else echo "Warning: Lockfile not found. It is recommended to commit lockfiles to version control." && yarn install; \
  fi

COPY src ./src
COPY public ./public
COPY next.config.js .
COPY tsconfig.json .
COPY prisma .
COPY postcss.config.js .
COPY tailwind.config.ts .

# Next.js collects completely anonymous telemetry data about general usage. Learn more here: https://nextjs.org/telemetry
# Uncomment the following line to disable telemetry at run time
ENV NEXT_TELEMETRY_DISABLED 1
ENV KINDE_CLIENT_ID fb14867b5d3c4e049c44d30219d9de5f
ENV KINDE_CLIENT_SECRET PKeeWHRZ2qSnFeV8zNGFgeULOeUuRDipUFb4B3oPlKEiCeKYLW
ENV KINDE_ISSUER_URL https://oussamasun.kinde.com
ENV KINDE_SITE_URL http://localhost:3000
ENV KINDE_POST_LOGOUT_REDIRECT_URL http://localhost:3000
ENV KINDE_POST_LOGIN_REDIRECT_URL http://localhost:3000/dashboard
ENV DATABASE_URL postgresql://dev:1234@postgres:5432/db
# Note: Don't expose ports here, Compose will handle that for us

# Start Next.js in development mode based on the preferred package manager
CMD \
  if [ -f yarn.lock ]; then yarn dev; \
  elif [ -f package-lock.json ]; then npm run dev; \
  elif [ -f pnpm-lock.yaml ]; then pnpm dev; \
  else yarn dev; \
  fi
