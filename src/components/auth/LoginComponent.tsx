import React, { useState, useEffect } from 'react';
import { Mail, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Interface des permissions (déjà présente dans votre code)
interface Permissions {
  canValidate: boolean;
  canEdit: boolean;
  canComment: boolean;
  canExport: boolean;
  canAssignTasks: boolean;
}

// Interface pour les données utilisateur
interface UserData {
  email: string;
  role: string;
  permissions: Permissions;
}

interface LoginProps {
  onLogin?: (userData: UserData) => void; // Optionnel
}

// Fonction pour obtenir les permissions (déjà présente dans votre code)
const getRolePermissions = (role: string): Permissions => {
  const permissions: Record<string, Permissions> = {
    daf: {
      canValidate: true,
      canEdit: true,
      canComment: true,
      canExport: true,
      canAssignTasks: true
    },
    chef_comptable: {
      canValidate: true,
      canEdit: true,
      canComment: true,
      canExport: true,
      canAssignTasks: true
    },
    reviseur: {
      canValidate: false,
      canEdit: true,
      canComment: true,
      canExport: false,
      canAssignTasks: false
    }
  };

  return permissions[role] || {
    canValidate: false,
    canEdit: false,
    canComment: false,
    canExport: false,
    canAssignTasks: false
  };
};

const LoginComponent: React.FC<LoginProps> = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  // Vérification de l'authentification au chargement
  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const userData = localStorage.getItem('userData');
    if (userData) {
      // Rediriger vers la page des entreprises si connecté
      router.push('/companies');
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Base d'utilisateurs simulée
    const users = {
      'daf@company.com': { role: 'daf', password: 'daf123' },
      'chef@company.com': { role: 'chef_comptable', password: 'chef123' },
      'reviseur@company.com': { role: 'reviseur', password: 'rev123' }
    };

    const user = users[credentials.email as keyof typeof users];
    
    if (user && user.password === credentials.password) {
      // Préparer les données utilisateur
      const userData: UserData = {
        email: credentials.email,
        role: user.role,
        permissions: getRolePermissions(user.role)
      };
      
      // Stocker les données utilisateur
      localStorage.setItem('userData', JSON.stringify(userData));
      
      // Appeler le callback de login si fourni
      if (onLogin) {
        onLogin(userData);
      }
      
      // Rediriger vers la page des entreprises
      router.push('/companies');
    } else {
      setError('Identifiants incorrects');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Révision Comptable - Connexion
        </h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="email"
                className="pl-10 w-full p-2 border rounded-md"
                placeholder="votre@email.com"
                value={credentials.email}
                onChange={(e) => setCredentials({
                  ...credentials,
                  email: e.target.value
                })}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="password"
                className="pl-10 w-full p-2 border rounded-md"
                value={credentials.password}
                onChange={(e) => setCredentials({
                  ...credentials,
                  password: e.target.value
                })}
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
};
export default LoginComponent;
export default LoginComponent;
