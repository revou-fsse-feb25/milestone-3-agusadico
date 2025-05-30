import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';

// Mock users for development - this avoids API dependency issues
const mockUsers = [
  {
    id: '1',
    email: 'john@example.com',
    password: 'password123',
    name: {
      firstname: 'John',
      lastname: 'Doe'
    },
    role: 'user'
  },
  {
    id: '2',
    email: 'admin@example.com',
    password: 'admin123',
    name: {
      firstname: 'Admin',
      lastname: 'User'
    },
    role: 'admin'
  }
];

async function fetchUsers() {
  // For development, use mock users instead of the external API
  console.log('Using mock users for authentication');
  return mockUsers;
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials');
          return null;
        }
        
        try {
          const users = await fetchUsers();
          console.log('Available users for auth:', users.length);
          const user = users.find((user) => user.email === credentials.email);
          
          if (!user) {
            console.log('User not found:', credentials.email);
            return null;
          }
          
          if (user.password !== credentials.password) {
            console.log('Password mismatch for user:', credentials.email);
            return null;
          }
          
          console.log('Authentication successful for:', credentials.email);
          return {
            id: user.id.toString(),
            name: `${user.name.firstname} ${user.name.lastname}`,
            email: user.email,
            role: user.role || 'user'
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  debug: true // Keep debug mode to see detailed logs
});