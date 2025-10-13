import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Github from 'next-auth/providers/github'
import { postOauthUser } from './app/utils/serverUtils'
import FusionAuth from 'next-auth/providers/fusionauth'
export const { auth, handlers, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    FusionAuth({
      clientId: process.env.AUTH_FUSIONAUTH_ID,
      clientSecret: process.env.AUTH_FUSIONAUTH_SECRET,
      tenantId: process.env.AUTH_FUSIONAUTH_TENANT_ID,
      issuer: process.env.AUTH_FUSIONAUTH_ISSUER,
      wellKnown: `${process.env.AUTH_FUSIONAUTH_ISSUER}/.well-known/openid-configuration/${process.env.AUTH_FUSIONAUTH_TENANT_ID}`,
      userinfo: `${process.env.AUTH_FUSIONAUTH_ISSUER}/oauth2/userinfo`,
      token: `${process.env.AUTH_FUSIONAUTH_ISSUER}/oauth2/token`
    })


  ],
  basePath: `${process.env.NEXT_PUBLIC_BASE_PATH}/api/auth`,
  trustHost: true,
  callbacks: {
    signIn: async ({ account, user }) => {
      if(account?.provider=='fusionauth')
      {
        await postOauthUser({ ...user, provider: account?.provider,providerAccountId: account?.providerAccountId,ufClientType:"UFW"})
      }else{
        await postOauthUser({ ...user, provider: account?.provider })
      }
      return true
    }
  }
})
