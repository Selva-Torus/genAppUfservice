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
      authorization: {
        url: `${process.env.AUTH_FUSIONAUTH_ISSUER}/oauth2/authorize`,
        params: {
          scope: "openid profile email",
          response_type: "code",
          client_id: process.env.AUTH_FUSIONAUTH_ID,
          tenantId: process.env.AUTH_FUSIONAUTH_TENANT_ID,
        },
      },
      token: {
        url: `${process.env.AUTH_FUSIONAUTH_ISSUER}/oauth2/token`,
      },
      userinfo: {
        url: `${process.env.AUTH_FUSIONAUTH_ISSUER}/oauth2/userinfo`,
      },
      client: {
        token_endpoint_auth_method: "client_secret_post",
      },
    }),


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
