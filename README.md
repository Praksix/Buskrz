# 🎸 Buskrz — Centralisation des concerts locaux

**Buskrz** est une application web qui centralise automatiquement les concerts à Grenoble dans une interface claire et accessible.  
Elle facilite la découverte musicale locale en regroupant les programmations des différentes salles de la ville, jusque-là dispersées.

---

## 🎯 Objectif

Offrir à tous les habitants de Grenoble un accès simple, unifié et à jour aux concerts locaux.  
L'application permet de :
- Consulter rapidement les concerts à venir
- Filtrer par date, salle ou artiste
- Recevoir des alertes personnalisées
- Centraliser les informations provenant de plusieurs sources

---

## 👥 Public cible

- Les passionnés de musique locale
- Les étudiants et jeunes actifs
- Les nouveaux arrivants ou visiteurs de passage
- Les curieux à la recherche de sorties culturelles

---

## 🧩 Fonctionnalités

### Fonctionnalité principale
✅ **Affichage centralisé des concerts** de Grenoble, récupérés automatiquement ou manuellement.

### Fonctionnalités secondaires (optionnelles)
- 🔍 Recherche par mot-clé (artiste, salle, date)
- 🔔 Alerte personnalisée (ex. : être notifié si “Zaho” passe à “MC2”)
- 📅 Affichage sur calendrier ou carte
- 🧠 Scraping assisté par IA (pour automatiser la collecte)

---

## 🏗️ Stack technique

### Frontend
- `Next.js` (React)
- `Tailwind CSS` + `ShadCN UI`
- `Axios` ou `SWR` pour les requêtes API

### Backend
- `JAVA` (API REST)


### Base de données
- `MongoDB Atlas` (NoSQL)
  - Relations : `Concert`, `Artiste`, `Salle`, `Utilisateur`, `Alerte`, `SourceScraping`

---

## 🧠 MCD résumé

- **Concert** a lieu dans une **Salle** et met en scène un ou plusieurs **Artistes**
- Un **Utilisateur** peut créer des **Alertes** personnalisées
- Chaque concert peut être associé à une **SourceScraping** (optionnelle)

---

## 🖥️  UI UX

- Charte graphique épurée, couleur chaude avec un dégradé
- Landing page : mise en avant des concerts et des lieux sponsorisés. On veut l'info avec le moins de clic possible
- Structure graphique minimaliste, parfait pour développer des features supplémentaires à l'avenir sans avoir à trop réfléchir.
- Style graphique : Glassmorphisme
[Liens vers le figma]( https://www.figma.com/design/c3qcKPBkswYAGxr2GqWXdv/Buskrz?node-id=111-263&t=nOEc5lBBDf87NT4E-1)
---

## 🚧 En cours de développement

Buskrz est un projet en construction prévu sur 12 mois dans le cadre d’une formation de Concepteur Développeur d’Application à Simplon.

---

## 📜 Licence

Projet open source dans le cadre d’un projet chef-d’œuvre - libre d’usage à but non commercial.


## 🚀 Installation

### Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Docker** et **Docker Compose** (méthode recommandée)
- **Java 21** (pour le développement backend)
- **Node.js 20+** et **npm** (pour le développement frontend)
- **Maven 3.6+** (pour le backend Spring Boot)

### Méthode 1 : Installation avec Docker (Recommandée)

Cette méthode lance l'ensemble du projet avec Docker Compose.

#### 1. Cloner le projet
```bash
git clone <url-du-repo>
cd Buskrz
```

#### 2. Configuration de l'environnement
Créez un fichier `.env` à la racine du projet :
```bash
# MongoDB
MONGODB_URI=mongodb://admin:password123@localhost:27017/buskrz?authSource=admin

# API Backend
SPRING_PROFILES_ACTIVE=docker
```

#### 3. Lancement avec Docker Compose

**Pour le développement :**
```bash
# Lancer tous les services (MongoDB + API + Frontend en mode dev)
docker-compose --profile development up -d

# Vérifier que tous les services sont actifs
docker-compose ps
```

**Pour la production :**
```bash
# Lancer en mode production
docker-compose --profile production up -d
```

#### 4. Accès aux services
- **Frontend (développement)** : http://localhost:5173
- **Frontend (production)** : http://localhost:3000
- **API Backend** : http://localhost:8080
- **MongoDB** : localhost:27017

#### 5. Arrêt des services
```bash
# Arrêter tous les services
docker-compose down

# Arrêter et supprimer les volumes (ATTENTION : supprime les données)
docker-compose down -v
```

### Méthode 2 : Installation manuelle (Développement)

Cette méthode permet de développer avec hot-reload sur le frontend.

#### 1. Base de données MongoDB

**Option A : Avec Docker (recommandé)**
```bash
# Lancer seulement MongoDB
docker-compose up -d mongodb
```

**Option B : Installation locale**
- Installer MongoDB 7.0+
- Créer une base de données `buskrz`
- Configurer l'utilisateur admin

#### 2. Backend Spring Boot

```bash
# Aller dans le dossier API
cd api

# Installer les dépendances Maven
./mvnw clean install

# Lancer l'application
./mvnw spring-boot:run

# Ou avec Maven installé globalement
mvn spring-boot:run
```

L'API sera disponible sur http://localhost:8080

#### 3. Frontend React/Vite

```bash
# Aller dans le dossier frontend
cd client/buskrz-front

# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev
```

Le frontend sera disponible sur http://localhost:5173

### 🔧 Commandes utiles

#### Tests
```bash
# Tests backend (dans le dossier api/)
./mvnw test

# Tests frontend (dans le dossier client/buskrz-front/)
npm run test
npm run test:coverage
```

#### Build
```bash
# Build backend
cd api && ./mvnw clean package

# Build frontend
cd client/buskrz-front && npm run build
```

#### Logs Docker
```bash
# Voir les logs de tous les services
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f api
docker-compose logs -f frontend-dev
```

### 🐛 Dépannage

#### Problèmes courants

**Port déjà utilisé :**
```bash
# Vérifier les ports utilisés
lsof -i :8080  # API
lsof -i :5173  # Frontend dev
lsof -i :3000  # Frontend prod
lsof -i :27017 # MongoDB
```

**Problème de connexion MongoDB :**
- Vérifier que MongoDB est bien démarré
- Vérifier les credentials dans le fichier `.env`
- Vérifier la configuration dans `application.properties`

**Problème de CORS :**
- L'API est configurée pour accepter les requêtes depuis le frontend
- Vérifier que l'URL du frontend correspond à la configuration CORS

#### Reset complet
```bash
# Arrêter et supprimer tout
docker-compose down -v
docker system prune -f

# Relancer
docker-compose --profile development up -d
```

---
