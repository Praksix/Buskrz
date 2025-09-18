# Guide de dépannage - LocationDetector

## Problème résolu ✅

Votre `LocationDetector` ne fonctionnait plus depuis la dockerisation à cause de problèmes de sécurité réseau et de CORS.

## Solutions appliquées

### 1. Configuration nginx mise à jour
- ✅ Ajout des headers CORS pour permettre les requêtes vers les APIs externes
- ✅ Configuration CSP (Content Security Policy) permissive pour les APIs de géolocalisation
- ✅ Support des domaines : `ipapi.co`, `ip-api.com`, `api.ipify.org`

### 2. LocationDetector amélioré
- ✅ Système de fallback avec plusieurs APIs de géolocalisation
- ✅ Gestion des timeouts (10 secondes)
- ✅ Messages d'erreur détaillés
- ✅ Interface utilisateur améliorée avec indicateur de chargement
- ✅ Bouton de réessai en cas d'échec

### 3. APIs supportées
1. **ipapi.co** (priorité 1) - API principale
2. **ip-api.com** (fallback) - API de secours

## Comment tester

### Test en production
```bash
# Accéder à l'application
http://localhost:3000

# Vérifier les logs du conteneur
docker logs buskrz-frontend-prod

# Tester les APIs depuis le conteneur
docker exec buskrz-frontend-prod wget -qO- https://ipapi.co/json/
docker exec buskrz-frontend-prod wget -qO- http://ip-api.com/json/
```

### Test en développement
```bash
# Démarrer en mode développement
docker-compose --profile development up -d

# Accéder à l'application
http://localhost:5173
```

## Dépannage

### Si le LocationDetector ne fonctionne toujours pas

1. **Vérifier les logs du navigateur**
   - Ouvrir les outils de développement (F12)
   - Aller dans l'onglet Console
   - Chercher les erreurs CORS ou de réseau

2. **Vérifier la connectivité réseau**
   ```bash
   # Tester depuis le conteneur
   docker exec buskrz-frontend-prod ping -c 3 ipapi.co
   docker exec buskrz-frontend-prod ping -c 3 ip-api.com
   ```

3. **Vérifier les headers nginx**
   ```bash
   # Tester les headers
   curl -I http://localhost:3000
   ```

4. **Redémarrer les conteneurs**
   ```bash
   docker-compose down
   docker-compose --profile production up --build -d
   ```

### Messages d'erreur courants

- **"Erreur CORS"** : Problème de politique de sécurité
- **"Timeout"** : Problème de connectivité réseau
- **"Erreur HTTP 403/429"** : Limite de taux des APIs externes

### Solutions alternatives

Si les APIs externes ne fonctionnent pas, vous pouvez :

1. **Utiliser l'API de géolocalisation du navigateur**
   ```javascript
   navigator.geolocation.getCurrentPosition()
   ```

2. **Implémenter un proxy côté backend**
   - Créer un endpoint dans votre API Spring Boot
   - Faire les appels aux APIs de géolocalisation depuis le backend
   - Éviter les problèmes CORS

3. **Utiliser une API payante plus fiable**
   - IPGeolocation.io
   - MaxMind GeoIP2
   - Google Maps Geocoding API

## Configuration actuelle

- **Frontend** : http://localhost:3000 (production)
- **API** : http://localhost:8080
- **MongoDB** : localhost:27017
- **Réseau Docker** : buskrz-network

## Notes importantes

- Les APIs de géolocalisation gratuites ont des limites de taux
- En production, considérez l'utilisation d'APIs payantes pour plus de fiabilité
- Le système de fallback garantit une meilleure disponibilité
- Les timeouts empêchent l'interface de se bloquer indéfiniment
