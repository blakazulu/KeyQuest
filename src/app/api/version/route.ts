import { NextResponse } from 'next/server';

const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || '0.0.0';

export async function GET() {
  return NextResponse.json(
    { version: APP_VERSION },
    {
      headers: {
        // Prevent caching of version endpoint
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    }
  );
}
