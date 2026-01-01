import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const acceptLanguage = request.headers.get('Accept-Language');

  console.log('--- Proxy Debug ---');
  console.log('Pathname:', pathname);
  console.log('Accept-Language:', acceptLanguage);
  console.log('Cookies:', request.cookies.getAll());

  const response = intlMiddleware(request);

  console.log('Response status:', response.status);
  console.log('Redirect location:', response.headers.get('location'));
  console.log('------------------------');

  return response;
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
