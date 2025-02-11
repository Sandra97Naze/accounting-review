import React from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

const UnauthorizedPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
        <AlertTriangle className="mx-auto mb-4 text-red-500 w-16 h-16" />
        <h1 className="text-2xl font-bold mb-4 text-red-600">Accès non autorisé</h1>
        <p className="text-gray-600 mb-6">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>
        <div className="flex justify-center space-x-4">
          <Link 
            href="/login" 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Retour à la connexion
          </Link>
          <Link 
            href="/" 
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
          >
            Accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
