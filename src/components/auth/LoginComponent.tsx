import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LockKeyhole, Mail } from 'lucide-react';

const LoginComponent = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  // Simulation d'une base d'utilisateurs
  const users = {
    'daf@company.com': { role: 'daf', password: 'daf123' },
    'chef@company.com': { role: 'chef_comptable', password: 'chef123' },
    'reviseur@company.com': { role: 'reviseur', password: 'rev123' }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const user = users[credentials.email];
    
    if (user && user.password === credentials.password) {
      onLogin({ 
        email: credentials.email, 
        role: user.role,
        permissions: getRolePermissions(user.role)
      });
    } else {
      setError('Identifiants incorrects');
    }
  };

  const getRolePermissions = (role) => {
    const permissions = {
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
        canAssignTasks: false
      },
      reviseur: {
        canValidate: false,
        canEdit: true,
        canComment: true,
        canExport: false,
        canAssignTasks: false
      }
    };
    return permissions[role] || {};
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Révision Comptable - Connexion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  className="pl-10"
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

            <div className="space-y-2">
              <label className="block text-sm font-medium">Mot de passe</label>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="password"
                  className="pl-10"
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
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full">
              Se connecter
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginComponent;