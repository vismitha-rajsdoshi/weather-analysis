# Build stage
FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
# We use a placeholder for the VITE_API_URL so it can be swapped or hardcoded to Render URL
RUN npm run build

# Production server stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Replace default Nginx config to handle React Router fallback
RUN echo "server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files \$uri \$uri/ /index.html; \
    } \
}" > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
