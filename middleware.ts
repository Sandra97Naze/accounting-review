import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Vérifier si l'utilisateur est authentifié
  const isAuthenticated = request.cookies.get('auth_token');
  
  // Si l'utilisateur n'est pas authentifié et n'est pas sur la page de connexion
  if (!isAuthenticated && !request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}