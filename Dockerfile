# ─────────────────────────────────────────────────────────────
# Stage 1 — Build the React/Vite app
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

# Install pnpm (project uses pnpm-lock.yaml)
RUN npm install -g pnpm@9

# Copy lockfile + manifest first for layer caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies (frozen lockfile = deterministic build)
RUN pnpm install --frozen-lockfile

# Copy the rest of the source
COPY . .

# VITE_API_URL is injected at build time via ARG so the
# JS bundle knows where the backend lives.
ARG VITE_API_URL=http://localhost:8080/api/v1
ENV VITE_API_URL=$VITE_API_URL

RUN pnpm run build

# ─────────────────────────────────────────────────────────────
# Stage 2 — Serve with Nginx
# ─────────────────────────────────────────────────────────────
FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html

# Remove default nginx static content
RUN rm -rf ./*

# Copy built assets from stage 1
COPY --from=build /app/dist .

# Custom nginx config: handles React Router (SPA fallback)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
