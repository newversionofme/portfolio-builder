import type { NextAuthConfig } from 'next-auth';

export const AUTH_SECRET_KEY =
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  'portfolio-builder-super-secret-key-32chars-minimum-replace-in-prod';

export const authConfig: NextAuthConfig = {
  trustHost: true,
  pages: {
    signIn: '/login',
    newUser: '/onboarding',
  },
  session: { strategy: 'jwt' },
  secret: AUTH_SECRET_KEY,
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = Boolean(auth?.user);
      const isAuthRoute =
        nextUrl.pathname.startsWith('/login') ||
        nextUrl.pathname.startsWith('/register');
      const isDashboardRoute =
        nextUrl.pathname.startsWith('/dashboard') ||
        nextUrl.pathname.startsWith('/onboarding');

      if (isDashboardRoute) {
        if (isLoggedIn) return true;
        return false;
      } else if (isAuthRoute) {
        if (isLoggedIn) {
          return Response.redirect(new URL('/dashboard', nextUrl));
        }
        return true;
      }
      return true;
    },
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      if (trigger === 'update' && session?.user) {
        token.name = session.user.name;
        token.picture = session.user.image;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = (token.id as string) || (token.sub as string);
        session.user.name = (token.name as string) || '';
        session.user.email = (token.email as string) || '';
        session.user.image = (token.picture as string) || null;
      }
      return session;
    },
  },
  providers: [],
};
