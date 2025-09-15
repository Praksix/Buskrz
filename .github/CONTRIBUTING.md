# 🤝 Guide de contribution - Buskrz

Merci de votre intérêt pour contribuer à **Buskrz** ! 🎸

Ce guide vous aidera à comprendre comment contribuer efficacement au projet.

## 📋 Table des matières

- [Code de conduite](#code-de-conduite)
- [Comment contribuer](#comment-contribuer)
- [Processus de développement](#processus-de-développement)
- [Standards de code](#standards-de-code)
- [Tests](#tests)
- [Documentation](#documentation)
- [Questions et support](#questions-et-support)

## 📜 Code de conduite

En participant à ce projet, vous acceptez de respecter notre code de conduite :

- **Respect** : Soyez respectueux envers tous les contributeurs
- **Collaboration** : Travaillez ensemble de manière constructive
- **Inclusion** : Accueillez les nouvelles idées et perspectives
- **Patience** : Soyez patient avec les autres contributeurs

## 🚀 Comment contribuer

### 1. Fork et Clone

```bash
# Fork le repository sur GitHub
# Puis clonez votre fork
git clone https://github.com/VOTRE_USERNAME/Buskrz.git
cd Buskrz
```

### 2. Configuration de l'environnement

```bash
# Frontend (Client)
cd client
npm install

# Backend (API)
cd ../api
mvn install
```

### 3. Créer une branche

```bash
git checkout -b feature/nom-de-votre-fonctionnalite
# ou
git checkout -b fix/description-du-bug
```

### 4. Développement

- Suivez les standards de code définis ci-dessous
- Écrivez des tests pour vos changements
- Mettez à jour la documentation si nécessaire

### 5. Tests

```bash
# Tests frontend
cd client
npm test

# Tests backend
cd ../api
mvn test
```

### 6. Commit et Push

```bash
git add .
git commit -m "feat: ajouter nouvelle fonctionnalité"
git push origin feature/nom-de-votre-fonctionnalite
```

### 7. Pull Request

- Créez une Pull Request vers la branche `main`
- Utilisez le template de PR fourni
- Assurez-vous que tous les tests passent

## 🔄 Processus de développement

### Branches

- `main` : Branche principale, toujours stable
- `develop` : Branche de développement
- `feature/*` : Nouvelles fonctionnalités
- `fix/*` : Corrections de bugs
- `hotfix/*` : Corrections urgentes

### Workflow

1. **Issue** : Créez une issue pour discuter du changement
2. **Branche** : Créez une branche depuis `develop`
3. **Développement** : Implémentez votre changement
4. **Tests** : Assurez-vous que tous les tests passent
5. **PR** : Créez une Pull Request vers `develop`
6. **Review** : Attendez la review et les commentaires
7. **Merge** : Une fois approuvé, mergez dans `develop`

## 📝 Standards de code

### Frontend (React/Next.js)

```javascript
// Utilisez des composants fonctionnels
const ConcertCard = ({ concert }) => {
  return (
    <div className="concert-card">
      <h3>{concert.title}</h3>
      <p>{concert.date}</p>
    </div>
  );
};

// Utilisez TypeScript pour le typage
interface Concert {
  id: string;
  title: string;
  date: Date;
  venue: string;
}
```

### Backend (Java/Spring Boot)

```java
// Utilisez des annotations Spring appropriées
@RestController
@RequestMapping("/api/concerts")
public class ConcertController {
    
    @GetMapping
    public ResponseEntity<List<Concert>> getAllConcerts() {
        // Implémentation
    }
}

// Documentez vos méthodes
/**
 * Récupère tous les concerts disponibles
 * @return Liste des concerts
 */
```

### Messages de commit

Utilisez des messages de commit conventionnels :

```
feat: ajouter système de favoris
fix: corriger bug d'affichage des dates
docs: mettre à jour README
style: formater le code
refactor: simplifier la logique de scraping
test: ajouter tests pour ConcertService
chore: mettre à jour les dépendances
```

## 🧪 Tests

### Frontend

```bash
cd client
npm test                    # Tests unitaires
npm run test:e2e           # Tests end-to-end
npm run test:coverage      # Couverture de code
```

### Backend

```bash
cd api
mvn test                   # Tests unitaires
mvn test -Dtest=IntegrationTest  # Tests d'intégration
mvn jacoco:report          # Rapport de couverture
```

### Standards de tests

- **Couverture** : Minimum 80% de couverture de code
- **Nommage** : `should_doSomething_when_condition`
- **Structure** : Arrange, Act, Assert

## 📚 Documentation

### Code

- Documentez les fonctions complexes
- Utilisez JSDoc pour le frontend
- Utilisez JavaDoc pour le backend

### README

- Mettez à jour le README pour les changements majeurs
- Ajoutez des exemples d'utilisation
- Documentez les nouvelles fonctionnalités

## 🐛 Signaler un bug

1. Vérifiez que le bug n'a pas déjà été signalé
2. Utilisez le template de bug report
3. Fournissez toutes les informations nécessaires
4. Ajoutez des captures d'écran si applicable

## ✨ Demander une fonctionnalité

1. Vérifiez que la fonctionnalité n'a pas déjà été demandée
2. Utilisez le template de feature request
3. Décrivez clairement le problème et la solution
4. Ajoutez des maquettes si possible

## ❓ Questions et support

- **Discussions** : Utilisez les GitHub Discussions
- **Issues** : Créez une issue pour les questions techniques
- **Email** : Contactez l'équipe de développement

## 🏆 Reconnaissance

Tous les contributeurs seront mentionnés dans le README du projet.

---

**Merci de contribuer à Buskrz ! 🎸**

*Ensemble, nous rendons la découverte musicale locale plus accessible à tous.*
