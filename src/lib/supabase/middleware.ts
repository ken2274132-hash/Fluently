import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Clean up old/stale Supabase auth cookies to prevent 431 errors
function cleanupCookies(request: NextRequest, response: NextResponse) {
  const cookies = request.cookies.getAll();
  const supabaseCookies = cookies.filter(c =>
    c.name.startsWith('sb-') ||
    c.name.includes('supabase') ||
    c.name.includes('auth-token')
  );

  // If there are too many Supabase cookies (more than 10), clean up old chunked ones
  if (supabaseCookies.length > 10) {
    // Delete all chunked cookies (they have numbers like .0, .1, .2 etc)
    supabaseCookies.forEach(cookie => {
      if (/\.\d+$/.test(cookie.name)) {
        response.cookies.delete(cookie.name);
      }
    });
  }

  // Calculate total cookie header size
  const totalCookieSize = cookies.reduce((acc, c) => acc + c.name.length + c.value.length + 4, 0);

  // If cookies are getting too large (over 6KB), clear all Supabase auth cookies
  if (totalCookieSize > 6000) {
    supabaseCookies.forEach(cookie => {
      response.cookies.delete(cookie.name);
    });
  }

  return response;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Clean up cookies before processing
  supabaseResponse = cleanupCookies(request, supabaseResponse);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes
  const protectedRoutes = ['/dashboard', '/settings', '/profile', '/admin'];
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Admin only routes
  const adminRoutes = ['/admin'];
  const isAdminRoute = adminRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isAdminRoute && user) {
    // Check if user is admin (you can customize this logic)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
