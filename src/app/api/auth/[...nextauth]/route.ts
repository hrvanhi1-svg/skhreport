import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                })

                if (!user) return null

                const isValid = await bcrypt.compare(credentials.password, user.password)
                if (!isValid) return null

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    departmentId: user.departmentId
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
                token.id = user.id
                token.departmentId = user.departmentId
            }
            return token
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.role = token.role as string
                session.user.id = token.id as string
                session.user.departmentId = token.departmentId as string
            }
            return session
        }
    },
    pages: {
        signIn: '/auth/signin',
    },
    session: {
        strategy: "jwt"
    }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
