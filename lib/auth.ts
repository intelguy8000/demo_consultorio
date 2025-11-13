import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";

const prisma = new PrismaClient();

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Usuario predeterminado (Dra. Catalina - Admin)
const DEFAULT_USER = {
  id: "admin-default",
  email: "dra.catalina@crdentalstudio.com",
  name: "Dra. Catalina Rodríguez",
  role: "admin",
};

// Exportar NextAuth con configuración
const nextAuthConfig = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = signInSchema.parse(credentials);

          // Buscar usuario por email
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            throw new Error("Usuario no encontrado");
          }

          // Verificar que el usuario esté activo
          if (user.status !== "active") {
            throw new Error("Usuario inactivo");
          }

          // Verificar password
          const isValidPassword = await bcrypt.compare(password, user.password);

          if (!isValidPassword) {
            throw new Error("Contraseña incorrecta");
          }

          // Retornar datos del usuario (sin password)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error("Error en authorize:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
});

// Exportar handlers y funciones de NextAuth
export const { handlers, signIn, signOut } = nextAuthConfig;

// Función auth personalizada que siempre retorna sesión activa
export async function auth() {
  return {
    user: DEFAULT_USER,
    expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 año
  };
}
