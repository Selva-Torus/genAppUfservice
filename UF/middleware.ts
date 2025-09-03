import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const path = request.nextUrl.pathname
  const landingScreen = '/user'

  if (!token && path !== '/')
    return NextResponse.redirect(
      new URL(`${process.env.NEXT_PUBLIC_BASE_PATH}`, request.url)
    )

  if (token && path === '/') {
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
