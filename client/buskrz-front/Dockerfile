# Étape 1: Build de l'app React avec Vite
FROM node:20-alpine AS build

# Installer les dépendances système nécessaires
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer toutes les dépendances (y compris dev dependencies pour le build)
RUN npm ci

# Copier le code source
COPY . .

# Build de l'application
RUN npm run build

# Étape 2: Servir avec nginx
FROM nginx:alpine

# Copier les fichiers buildés depuis Vite (dossier dist)
COPY --from=build /app/dist /usr/share/nginx/html

# Copier la configuration nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Exposer le port 80
EXPOSE 80

# Démarrer nginx
CMD ["nginx", "-g", "daemon off;"]