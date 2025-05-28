# API Migration Plan

## Current Issue

The build is failing due to a type error in `src/endpoints/health.ts`:

```
Type '(req: any, res: any, next: any) => Promise<any>' is not assignable to type 'PayloadHandler'.
```

This is because we're trying to use an older Payload endpoint format while the project has migrated to Next.js App Router API routes.

## Migration Status

- ✅ Most API endpoints have been successfully migrated to `src/app/api/` pattern
- ✅ A new working health endpoint exists at `src/app/api/health/route.ts` 
- ❌ The old endpoint at `src/endpoints/health.ts` is causing build errors

## Action Plan

1. **Remove or comment out** the problematic file:
   - `src/endpoints/health.ts` should be removed or commented out completely

2. **Update config** to ensure the old endpoint is not referenced:
   - Check payload.config.ts for any references to the old endpoint

3. **Update documentation** to reflect the new API structure:
   - API documentation should point to the new endpoints

4. **Test the new endpoints** to ensure they work correctly:
   - Use the test scripts created in the test/ directory

The exact location of the health endpoint registration is in payload.config.ts, where endpoints are registered.

## Implementation Details

Next.js API Routes (`src/app/api/health/route.ts`) are the new standard approach, while the old Payload endpoints system (`src/endpoints/health.ts`) is deprecated for this project.

For future API development, always use the Next.js App Router pattern:

```typescript
// src/app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Implementation
  return NextResponse.json({ status: 'ok' });
}
```
