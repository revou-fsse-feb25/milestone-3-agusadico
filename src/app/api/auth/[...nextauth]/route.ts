import { handlers } from '../../../../../auth';

// Properly export the handlers with explicit typing
export const GET = handlers.GET;
export const POST = handlers.POST;

// Add error handling
export function OPTIONS(request: Request) {
  return new Response(null, { status: 200 });
}