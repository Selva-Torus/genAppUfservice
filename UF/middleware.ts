import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const path = request.nextUrl.pathname
  const isAuthRoute = ["/" , "/forgot-password"].includes(path);
   let screenName:string = 'User Screen';
    let screenDetails: any = {
        keys:[
  {
    "screensName": "testroute-v1",
    "ufKey": "CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:oprmatrix:AFK:oprmatrixUF:AFVK:v1"
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

  if (token && isAuthRoute) {
    try {
      const decodedToken = Buffer.from(token!.split('.')[1], 'base64').toString(
        'utf8'
      )
      const parsedToken = decodedToken ? JSON.parse(decodedToken) : {}
      if (parsedToken?.psCode) {
        return NextResponse.redirect(
          new URL(
            `${process.env.NEXT_PUBLIC_BASE_PATH}${landingScreen}`,
            request.url
          )
        )
      } else {
        return NextResponse.redirect(
          new URL(
            `${process.env.NEXT_PUBLIC_BASE_PATH}/select-context`,
            request.url
          )
        )
      }
    } catch (error) {
      request.cookies.delete('token')
      return NextResponse.redirect(
        new URL(`${process.env.NEXT_PUBLIC_BASE_PATH}`, request.url)
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|robots.txt|public|images|manifest.json|sw.js|favicon.ico|workbox-*).*)',
    '/'
  ]
}
