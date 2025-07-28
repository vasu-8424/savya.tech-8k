import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  console.log('OAuth callback called with:', {
    url: requestUrl.toString(),
    code: code ? 'present' : 'missing',
    searchParams: Object.fromEntries(requestUrl.searchParams)
  })

  if (code) {
    try {
      // Create Supabase client
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      console.log('Attempting to exchange code for session...')
      // Exchange code for session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      console.log('Session exchange result:', {
        hasUser: !!data?.user,
        hasSession: !!data?.session,
        userEmail: data?.user?.email,
        error: error?.message
      })
      
      if (error) {
        console.error('OAuth callback error:', error)
        return NextResponse.redirect(`${requestUrl.origin}/login?error=oauth_error`)
      }

      if (data.user && data.session) {
        console.log('Setting cookies and redirecting to dashboard...')
        // Create response with redirect to dashboard
        const response = NextResponse.redirect(`${requestUrl.origin}/dashboard?oauth_success=true`)
        
        // Set session cookies
        response.cookies.set('sb-access-token', data.session.access_token, {
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7 // 7 days
        })
        
        response.cookies.set('sb-refresh-token', data.session.refresh_token, {
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7 // 7 days
        })

        response.cookies.set('user-email', data.user.email || '', {
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7 // 7 days
        })

        return response
      }
    } catch (error) {
      console.error('OAuth session exchange error:', error)
      return NextResponse.redirect(`${requestUrl.origin}/login?error=session_error`)
    }
  }

  console.log('No code found, redirecting to login with error')
  // If no code, redirect to login with error
  return NextResponse.redirect(`${requestUrl.origin}/login?error=no_code`)
}