import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  // Skip middleware for clear-cookies page and API routes
  if (request.nextUrl.pathname === '/clear-cookies' ||
      request.nextUrl.pathname.startsWith('/api/clear')) {
    return NextResponse.next();
  }

  // Check cookie size first - if too large, clear them immediately
  const cookies = request.cookies.getAll();
  const totalCookieSize = cookies.reduce((acc, c) => acc + c.name.length + c.value.length + 4, 0);

  // If cookies are over 4KB, clear all supabase cookies and redirect to clear page
  if (totalCookieSize > 4000) {
    const response = NextResponse.redirect(new URL('/clear-cookies', request.url));

    // Delete all supabase-related cookies
    cookies.forEach(cookie => {
      if (cookie.name.startsWith('sb-') ||
          cookie.name.includes('supabase') ||
          cookie.name.includes('auth-token') ||
          cookie.value.length > 1000) {
        response.cookies.delete(cookie.name);
      }
    });

    return response;
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Filter out any cookies that are too large (likely base64 images)
          const safeCookies = cookiesToSet.filter(({ value }) => value.length < 2000);

          safeCookies.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          safeCookies.forEach(({ name, value, options }) =>
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
  const protectedRoutes = ['/dashboard', '/settings', '/profile', '/admin', '/voice', '/voice-avatar', '/video'];
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
