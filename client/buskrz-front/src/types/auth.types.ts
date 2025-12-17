// Type union pour les rôles utilisateur
export type UserRole = "USER" | "ADMIN";
  
  // Représente un utilisateur authentifié
export interface User {
    id: string;
    email: string;
    nom: string;
    role: UserRole;
  }
  
  // Données nécessaires pour la connexion
  export interface LoginRequest {
    email: string;
    password: string;
  }
  
  // Données nécessaires pour l'inscription
  export interface RegisterRequest {
    nom: string;
    email: string;
    password: string;
  }
  
  // Réponse du serveur après authentification
  export interface AuthResponse {
    token: string;
  }