# API pour la gestion des concertsLikes

## Fonctionnalités ajoutées

### 1. Ajouter un concert aux concertsLikes d'un utilisateur

**Endpoint :** `POST /api/v1/users/{userId}/concerts/{concertId}/like`

**Description :** Ajoute un concert à la liste des concertsLikes d'un utilisateur.

**Paramètres :**
- `userId` : ID de l'utilisateur
- `concertId` : ID du concert à ajouter

**Exemple d'utilisation :**
```bash
curl -X POST http://localhost:8080/api/v1/users/64f8a1b2c3d4e5f6a7b8c9d0/concerts/64f8a1b2c3d4e5f6a7b8c9d1/like
```

### 2. Supprimer un concert des concertsLikes d'un utilisateur

**Endpoint :** `DELETE /api/v1/users/{userId}/concerts/{concertId}/like`

**Description :** Supprime un concert de la liste des concertsLikes d'un utilisateur.

**Paramètres :**
- `userId` : ID de l'utilisateur
- `concertId` : ID du concert à supprimer

**Exemple d'utilisation :**
```bash
curl -X DELETE http://localhost:8080/api/v1/users/64f8a1b2c3d4e5f6a7b8c9d0/concerts/64f8a1b2c3d4e5f6a7b8c9d1/like
```

### 3. Récupérer la liste des concertsLikes d'un utilisateur avec leurs détails

**Endpoint :** `GET /api/v1/users/{userId}/concerts/liked`

**Description :** Retourne la liste complète des concerts likés par un utilisateur avec tous leurs détails.

**Paramètres :**
- `userId` : ID de l'utilisateur

**Réponse :** Liste d'objets Concert avec tous leurs détails :
```json
[
  {
    "id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "name": "Concert de Jazz",
    "artisteIds": ["64f8a1b2c3d4e5f6a7b8c9d2"],
    "lieuId": "64f8a1b2c3d4e5f6a7b8c9d3",
    "date": "2024-01-15",
    "time": "20:00:00",
    "prix": "25€",
    "description": "Un magnifique concert de jazz...",
    "image": "https://example.com/image.jpg",
    "lien": "https://example.com/concert"
  }
]
```

**Exemple d'utilisation :**
```bash
curl -X GET http://localhost:8080/api/v1/users/64f8a1b2c3d4e5f6a7b8c9d0/concerts/liked
```

## Implémentation technique

### Modèle User
Le modèle `User` contient déjà un champ `concertsLikes` de type `List<String>` qui stocke les IDs des concerts likés.

### Services ajoutés
- `addConcertToLikes(String userId, String concertId)` : Ajoute un concert aux likes
- `removeConcertFromLikes(String userId, String concertId)` : Supprime un concert des likes
- `getUserLikedConcerts(String userId)` : Récupère la liste des IDs des concerts likés

### Logique métier
- L'ajout vérifie que le concert n'est pas déjà dans la liste pour éviter les doublons
- La suppression fonctionne même si le concert n'était pas dans la liste
- La récupération des concerts likés filtre automatiquement les concerts qui n'existent plus

## Utilisation côté frontend

### Ajouter un concert aux likes
```javascript
const addConcertToLikes = async (userId, concertId) => {
  try {
    const response = await fetch(`/api/v1/users/${userId}/concerts/${concertId}/like`, {
      method: 'POST'
    });
    if (response.ok) {
      console.log('Concert ajouté aux likes');
    }
  } catch (error) {
    console.error('Erreur lors de l\'ajout du concert aux likes:', error);
  }
};
```

### Supprimer un concert des likes
```javascript
const removeConcertFromLikes = async (userId, concertId) => {
  try {
    const response = await fetch(`/api/v1/users/${userId}/concerts/${concertId}/like`, {
      method: 'DELETE'
    });
    if (response.ok) {
      console.log('Concert supprimé des likes');
    }
  } catch (error) {
    console.error('Erreur lors de la suppression du concert des likes:', error);
  }
};
```

### Récupérer les concerts likés
```javascript
const getUserLikedConcerts = async (userId) => {
  try {
    const response = await fetch(`/api/v1/users/${userId}/concerts/liked`);
    if (response.ok) {
      const concerts = await response.json();
      console.log('Concerts likés:', concerts);
      return concerts;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des concerts likés:', error);
  }
};
```
