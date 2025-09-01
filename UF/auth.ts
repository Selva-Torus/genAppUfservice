import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Github from 'next-auth/providers/github'
import { postOauthUser } from './app/utils/serverUtils'

export const { auth, handlers, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET
    }),
    Github({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET
    })
  ],
  basePath: `${process.env.NEXT_PUBLIC_BASE_PATH}/api/auth`,
  trustHost: true,
  callbacks: {
    signIn: async ({ account, user }) => {
      await postOauthUser({...user , provider : account?.provider})
      return true
    }
  }
})
