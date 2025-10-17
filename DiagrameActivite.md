graph TD
    A[Utilisateur arrive sur l'application] --> B[Page d'accueil Home.tsx]
    B --> C[LocationDetector se charge automatiquement]
    C --> D{API de géolocalisation disponible?}
    
    D -->|Oui| E[Appel API ipapi.co ou ip-api.com]
    D -->|Non| F[Affichage message d'erreur]
    F --> G[Bouton Réessayer]
    G --> D
    
    E --> H{Ville détectée?}
    H -->|Oui| I[Vous êtes à Grenoble]
    H -->|Non| F
    
    I --> J[Voir les concerts à Grenoble]
    J --> K[Utilisateur clique sur le bouton]
    K --> L[Navigation vers /concerts/Grenoble]
    
    L --> M[Page ConcertsByCity.tsx se charge]
    M --> N[Extraction du paramètre ville depuis l'URL]
    N --> O[Appel API GET /api/v1/concerts/city/Grenoble]
    
    O --> P{Concert trouvés?}
    P -->|Oui| Q[Récupération des détails des artistes]
    P -->|Non| R[Aucun concert trouvé]
    
    Q --> S[Récupération des détails des lieux]
    S --> T[Affichage de la grille des concerts]
    
    T --> U{Utilisateur veut ajouter un concert?}
    U -->|Oui| V[Clique sur Ajouter un concert dans le header]
    U -->|Non| W[Parcours les concerts affichés]
    
    V --> X[Navigation vers /add-concert]
    X --> Y[Page AddConcert.tsx se charge]
    Y --> Z[Chargement des artistes et lieux existants]
    Z --> AA[Formulaire de création de concert]
    
    AA --> BB[Utilisateur remplit le formulaire]
    BB --> CC{Validation du formulaire}
    CC -->|Non| DD[Affichage des erreurs de validation]
    DD --> BB
    CC -->|Oui| EE[Envoi du formulaire]
    
    EE --> FF[Pour chaque artiste: appel API find-or-create]
    FF --> GG{Artiste existe?}
    GG -->|Oui| HH[Utilisation de l'artiste existant]
    GG -->|Non| II[Création du nouvel artiste avec genre]
    
    HH --> JJ[Collecte des IDs d'artistes]
    II --> JJ
    JJ --> KK[Création du concert avec artisteIds]
    KK --> LL[Appel API POST /api/v1/concerts]
    
    LL --> MM{Concert créé avec succès?}
    MM -->|Oui| NN[Message de succès affiché]
    MM -->|Non| OO[Message d'erreur affiché]
    
    NN --> PP[Formulaire réinitialisé]
    PP --> QQ[Rechargement de la liste des artistes]
    QQ --> AA
    
    OO --> AA
    
    W --> RR[Utilisateur clique sur un concert]
    RR --> SS[Ouverture du lien externe du concert]
