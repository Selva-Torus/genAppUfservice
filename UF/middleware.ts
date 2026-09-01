import { NextRequest, NextResponse } from 'next/server'
import { buildAuthorizationUrl, generateCodeChallenge, generateCodeVerifier } from './lib/fusionauth'
import { COOKIE_PREFIX, FULL_BASE_PATH } from './lib/cookies'

function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return Array.from(array)
    .map(b => chars[b % chars.length])
    .join('')
}

function decodeTokenPayload(token: string): any {
  try {
    return JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString('utf8')
    )
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(`${COOKIE_PREFIX}_token`)?.value || "";
  const path = request.nextUrl.pathname
  const isAuthRoute = ["/" , "/forgot-password"].includes(path);
  const isForgotPasswordRoute = ["/forgot-password"].includes(path);
   let screenName:string = 'Logs Screen';
    let screenDetails: any = {
        keys:[
  {
    "screenName": "test",
    "screensName": "test-v1",
    "ufKey": "CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:test:AFVK:v1"
  }
]
    }
    screenDetails = screenDetails.keys
        
    if (screenName === 'User Screen') {
        screenName = 'user'
    }else if (screenName === 'Logs Screen') {
        screenName = 'logs'
    }
   else{
        screenDetails.forEach((screen: any)   => {
        if (screenName === screen.ufKey) {
            screenName = screen.screensName
        }  
        });
        screenName =screenName.split('-')[0]+'_'+screenName.split('-').at(-1)
    }
  const landingScreen = `/${screenName}`

  if (!token && !isAuthRoute)
    return NextResponse.redirect(
      new URL(`${process.env.NEXT_PUBLIC_BASE_PATH}`, request.url)
    )

     const { pathname } = request.nextUrl

  // ── Always bypass these paths ────────────────────────────────────────────
  if (
    pathname.includes('/next-api/auth/callback') ||
    pathname.includes('/next-api/auth/logout') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/next-api/')
  ) {
    return NextResponse.next()
  }

  const isRootOrAuth =
    pathname === '/' ||
    pathname === FULL_BASE_PATH ||
    pathname === `${FULL_BASE_PATH}/` ||
    pathname === `/forgot-password`

 if (!token && !isForgotPasswordRoute) {
    const state = generateRandomString(32);
    const codeVerifier = generateCodeVerifier()
    const codeChallenge = await generateCodeChallenge(codeVerifier)
    const appTenantParam = request.nextUrl.searchParams.get('tenant');
    
    try {
       const authResponse = await buildAuthorizationUrl(state, codeChallenge, appTenantParam)
       if(!authResponse) throw new Error('Fausion auth details not found')
       const response = NextResponse.redirect(authResponse.url)
       response.cookies.set(`${COOKIE_PREFIX}_tp_ps`, '', {
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
          path: FULL_BASE_PATH,
          maxAge: 0
       })
       response.cookies.set(`${COOKIE_PREFIX}_oauth_state`, state, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
          path: FULL_BASE_PATH,
          maxAge: 60 * 10
       })
       response.cookies.set(`${COOKIE_PREFIX}_pkce_verifier`, codeVerifier, {   // ← new
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
          path: FULL_BASE_PATH,
          maxAge: 60 * 10
       })
       if(appTenantParam && authResponse.appTenantId){
         response.cookies.set(`${COOKIE_PREFIX}_app_tenant`, appTenantParam, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
          path: FULL_BASE_PATH,
          maxAge: 60 * 10
       })
         response.cookies.set(`${COOKIE_PREFIX}_app_tenant_id`, authResponse.appTenantId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
          path: FULL_BASE_PATH,
          maxAge: 60 * 10
       })
      }
    return response
    } catch (error) {
      return NextResponse.json({
        status : (error as any).status ?? 400,
        message : (error as any).message ?? 'There are some Misconfiguration , please check your tenant configuration'
      })
    }
  }

  // ── Has token + on auth route → redirect to app ──────────────────────────
  if (token && isRootOrAuth) {
    const parsed = decodeTokenPayload(token)
    const destination = parsed?.psCode
      ? `${FULL_BASE_PATH}${landingScreen}`
      : `${FULL_BASE_PATH}/select-context`
    return NextResponse.redirect(new URL(destination, request.url))
  }

  return NextResponse.next()

}

export const config = {
  matcher: [
    '/((?!api/|next-api/|_next/static|_next/image|robots.txt|public|images|manifest.json|sw.js|favicon.ico|workbox-*).*)',
    '/'
  ]
}
