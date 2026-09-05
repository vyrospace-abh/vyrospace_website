# ============================================
# VYROSPACE — Multi-stage static-site Dockerfile
# Stage 1: Build (none needed for static site, but reserved for future tooling)
# Stage 2: Serve via lightweight nginx
# ============================================

FROM nginx:1.27-alpine AS runtime

# Replace default config with one that serves index.html as fallback
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/

# Copy site files
COPY . /usr/share/nginx/html

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
