import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

// Marks a route as exempt from the global AuthGuard (e.g. sign-in, password
// reset, SSO exchange, tenant-selection bootstrap) — see auth.guard.ts.
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
