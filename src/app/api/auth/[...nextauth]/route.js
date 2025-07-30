import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import axios from '../../../../lib/axios'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "user@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const response = await axios.post('/api/auth/login', credentials)
          const data = response.data

          if (data?.token) {
            return {
              id: data._id,
              name: data.name,
              email: data.email,
              role: data.role || 'user',
              token: data.token,
            }
          }
          throw new Error(data?.message || 'Authentication failed')
        } catch (error) {
          console.error('Login error:', error.response?.data || error.message)
          throw new Error(
            error.response?.data?.message ||
            error.message ||
            'Login failed. Please try again.'
          )
        }
      }
    }),

    
    GoogleProvider({
      clientId: "916371205801-u475fs0io0h27tn4cmqqn1f97smlj5hp.apps.googleusercontent.com",
      clientSecret: "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"
    })
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          await axios.post('https://books-server-001.vercel.app/api/auth/registergoogle', {
            name: user.name,
            email: user.email,
          })
        } catch (error) {
          if (error.response?.status !== 400) {
            console.error('User registration failed:', error.response?.data || error.message)
            return false
          }
        }
      }

      return true
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role || 'user'
        }
        if (account?.provider === 'google') {
          token.accessToken = account.access_token
        } else {
          token.accessToken = user.token
        }
      }
      return token
    },
    async session({ session, token }) {
      session.user = token.user
      session.accessToken = token.accessToken
      return session
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  },

  pages: {
    signIn: '/auth/login',
    signOut: '/auth/login',
    error: '/auth/login'
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET || "asdfrqwer333asdfw3ghawdf",
  debug: process.env.NODE_ENV === 'development',
  useSecureCookies: process.env.NODE_ENV === 'production',
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
