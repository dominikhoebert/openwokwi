# ──────────────────────────────────────────────────────────────
# Stage 1 – Build Wokwi libraries
#   Clone avr8js and wokwi-elements, install deps, and produce
#   the dist/ artifacts that the frontend depends on.
# ──────────────────────────────────────────────────────────────
FROM node:20-slim AS wokwi-builder

RUN apt-get update && apt-get install -y --no-install-recommends git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /wokwi-libs

# Pin to the exact submodule commit SHA tracked by the repository for
# reproducible builds (matching wokwi-libs/avr8js and wokwi-libs/wokwi-elements).
RUN git clone https://github.com/wokwi/avr8js.git avr8js \
    && git -C avr8js checkout 898f76c787762c8ee3ef7ca93c7b429b67a518d7 \
    && cd avr8js \
    && npm install \
    && npm run build

RUN git clone https://github.com/wokwi/wokwi-elements.git wokwi-elements \
    && git -C wokwi-elements checkout 3c8178e6eccd94f89a197182954a4bf9d3e6a76b \
    && cd wokwi-elements \
    && npm install --legacy-peer-deps \
    && npm run build

# ──────────────────────────────────────────────────────────────
# Stage 2 – Build the React / Vite frontend
# ──────────────────────────────────────────────────────────────
FROM node:20-slim AS frontend-builder

WORKDIR /app

# Bring in wokwi-libs (source + dist) so the metadata generator
# can scan wokwi-elements/src and vite can resolve the aliases
COPY --from=wokwi-builder /wokwi-libs ./wokwi-libs

# Build-time scripts (generate-component-metadata.ts)
COPY scripts/ ./scripts/

# Frontend sources
COPY frontend/ ./frontend/

WORKDIR /app/frontend

# Install frontend dependencies (file: refs point to ../wokwi-libs/*)
RUN npm install

# VITE_API_BASE is consumed by compilation.ts at build time.
# When running through the nginx reverse-proxy in Docker every API
# call is routed via the same origin, so a relative path is enough.
ARG VITE_API_BASE=/api
ENV VITE_API_BASE=${VITE_API_BASE}

RUN npm run build

# ──────────────────────────────────────────────────────────────
# Stage 3 – Serve static assets with nginx
# ──────────────────────────────────────────────────────────────
FROM nginx:alpine AS production

COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
