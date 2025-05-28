# TypeScript Function vs Boolean Error Fix

## Issue Overview

This document describes a common TypeScript error that occurs when a function is used as a boolean value in conditional statements, and how to properly fix it.

## The Problem

In TypeScript, when you use a function identifier directly in a conditional statement without calling it, TypeScript will warn you with this error:

```
This condition will always return true since this function is always defined. 
Did you mean to call it instead?
```

This happened in several files in our project, including:

1. `src/utilities/getURL.ts` - Used `canUseDOM` instead of `canUseDOM()`
2. `src/providers/HeaderTheme/index.tsx` - Used `canUseDOM` instead of `canUseDOM()`

## The Fix

The solution is simple - call the function instead of referencing it:

```typescript
// INCORRECT
if (canUseDOM) {
  // Code that uses browser APIs
}

// CORRECT
if (canUseDOM()) {
  // Code that uses browser APIs
}
```

## Why This Matters

This is more than just a TypeScript warning - it represents a logical error in the code:

1. A function reference (without calling it) in a conditional is always truthy
2. This means the condition would always evaluate to true
3. Code that should only run in the browser might execute in a server environment
4. This can cause runtime errors when server-side code tries to access browser-only APIs like `window` or `document`

## Best Practices

1. Always call utility functions rather than using them as values
2. Use explicit return types on functions to catch these errors earlier
3. When creating utilities that check for environment conditions, consider naming them clearly:
   - `isRunningInBrowser()`
   - `isBrowserEnvironment()`
   - `canAccessDOM()`

## Related Files Fixed

- `src/utilities/getURL.ts`
- `src/providers/HeaderTheme/index.tsx`
- `src/endpoints/health.ts` (different issue, but also fixed)

## Testing

After fixing these issues, the application should:

1. Correctly detect browser vs server environments
2. Not attempt to access browser APIs on the server
3. Pass TypeScript checks without warnings
4. Build successfully with `next build`
