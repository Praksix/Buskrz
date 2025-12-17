// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode, FC } from 'react';
import { jwtDecode } from 'jwt-decode';
import type { User, UserRole, AuthResponse } from '../types/auth.types';

// Interface pour le contexte d'authentification
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (nom: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Interface pour les props du provider
interface AuthProviderProps {
  children: ReactNode;
}

// Interface pour les données du token décodé
interface DecodedToken {
  sub: string; // subject (généralement l'email/username)
  exp: number; // expiration timestamp
  role?: string;
  // autres champs potentiels du token
}

// Création du contexte avec une valeur par défaut undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider d'authentification
export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  // État local pour stocker les informations d'authentification
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Effet qui s'exécute quand le token change
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          // Décoder le token pour obtenir les informations utilisateur de base
          const decodedToken = jwtDecode<DecodedToken>(token);

          // Vérifier si le token est expiré
          if (decodedToken.exp * 1000 < Date.now()) {
            console.log('Token expiré, déconnexion...');
            logout();
            return;
          }

          // Tenter de récupérer les infos utilisateur complètes
          const response = await fetch('http://localhost:8080/api/v1/users/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const userData = await response.json();
            // Mapper name du backend vers nom du frontend
            setUser({
              id: userData.id || '',
              email: userData.email || '',
              nom: userData.name || '',
              role: (userData.role as UserRole) || 'USER'
            });
            setIsAuthenticated(true);
          } else {
            // Si le token est invalide (401/403), on doit déconnecter l'utilisateur
            if (response.status === 401 || response.status === 403) {
              throw new Error('Session expirée ou invalide');
            }
            // Pour les autres erreurs (ex: réseau), on peut optionnellement garder la session
            // mais par sécurité, si on ne peut pas vérifier le user, on le déconnecte
            // ou alors on garde l'ancien comportement pour les erreurs NON 401/403
            throw new Error('Impossible de vérifier le token');
          }
        } catch (error) {
          console.error('Erreur lors de la vérification du token:', error);
          logout();
        }
      }
    };

    verifyToken();
  }, [token]);

  // Fonction de connexion
  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Échec de la connexion');
      }

      const data: AuthResponse = await response.json();
      localStorage.setItem('token', data.token);
      setToken(data.token);
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  };

  // Fonction d'inscription
  const register = async (nom: string, email: string, password: string): Promise<void> => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/register', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify({ nom, email, password })
      });

      if (!response.ok) {
        // Essayer de récupérer le message d'erreur du backend
        let errorMessage = `Échec de l'inscription (${response.status})`;
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
          } else {
            // Si la réponse n'est pas du JSON, récupérer le texte
            const text = await response.text();
            if (text) {
              errorMessage = text;
            }
          }
        } catch (parseError) {
          // Si on ne peut pas parser la réponse, utiliser le message par défaut
          console.error('Erreur lors du parsing de la réponse d\'erreur:', parseError);
        }
        throw new Error(errorMessage);
      }

      // Vérifier que la réponse contient du JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('La réponse du serveur n\'est pas au format JSON');
      }

      const data: AuthResponse = await response.json();
      console.log("Data reçue du serveur:", data);

      if (!data || !data.token) {
        throw new Error('Token manquant dans la réponse du serveur');
      }

      localStorage.setItem('token', data.token);
      setToken(data.token);
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      throw error;
    }
  };

  // Fonction de déconnexion
  const logout = (): void => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Valeur du contexte à fournir
  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personnalisé pour utiliser le contexte
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé avec un AuthProvider');
  }
  return context;
};