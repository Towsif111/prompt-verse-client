import { NextResponse } from 'next/server'
import { getAuth } from './lib/auth'
import { headers } from 'next/headers'

export async function proxy(request) {
   const auth = getAuth()

   const session = await auth.api.getSession({
        headers: await headers()
    })

    if(!session) {
         return NextResponse.redirect(new URL('/login', request.url))
    }

}

export const config = {
  matcher: ['/all-prompts/:path'],
}