import { verifyToken } from '@/lib/auth';

export async function middleware(req) {
  try {
    // Verify token in the Authorization header
    verifyToken(req);

    // Allow the request to continue if token is valid
    return new Response('OK', { status: 200 });

  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Unauthorized. Please log in.' }),
      { status: 401 }
    );
  }
}

export const config = {
  matcher: ['/dashboard', '/profile', '/settings'], // Match routes that require authentication
};
