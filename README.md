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
- `Node.js` (API REST ou API Routes de Next.js)
- `Cheerio` / `Puppeteer` pour le scraping
- `OpenAI API` (ou modèle local) pour l’analyse sémantique assistée
- `Node-cron` pour automatiser les scrapes réguliers

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
