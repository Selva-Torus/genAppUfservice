import { AxiosService } from '@/app/components/axiosService'
import { setServerCookie } from '@/app/components/cookieMgment'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')
  const origin = searchParams.get('origin') || '/'
  const baseUrl = new URL(process.env.NEXT_PUBLIC_API_BASE_URL!).origin

  try {
    if (!token) {
      return NextResponse.redirect(origin)
    }
    // verify token with the Origin
    const signinApiResponse = await AxiosService.post('UF/sso', {
      token,
      ufClientType: 'UFW'
    })

    let response

    if (signinApiResponse.status === 201) {
      if (signinApiResponse.data?.redirectToORPSelector) {
        response = NextResponse.redirect(
          new URL(
            `${process.env.NEXT_PUBLIC_BASE_PATH}/select-context`,
            baseUrl
          )
        )
      } else {
        response = NextResponse.redirect(
          new URL(`${process.env.NEXT_PUBLIC_BASE_PATH}/user`, baseUrl)
        )
      }
      setServerCookie(response, "tp_ps", "", { expires: new Date(0) });
      setServerCookie(response, "token", signinApiResponse.data?.token);
    } else {
      response = NextResponse.redirect(origin)
    }

    return response
  } catch {
    return NextResponse.redirect(origin)
  }
}
