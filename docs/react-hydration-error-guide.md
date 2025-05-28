# React Hydration Error Solutions

## What are React Hydration Errors?

Hydration errors occur when the HTML rendered on the server doesn't match what React expects to render on the client. This commonly happens with:

1. Server/client branches using `typeof window !== 'undefined'`
2. Variable inputs like `Date.now()` or `Math.random()` 
3. Date formatting in locales
4. External data that changes between server and client renders
5. Invalid HTML tag nesting
6. Browser extensions modifying the DOM

## Solutions Implemented

### 1. HydrationSafeWrapper Component

Use this component to wrap any content that should only render on the client side:

```tsx
import HydrationSafeWrapper from '@/components/HydrationSafeWrapper'

// In your component:
<HydrationSafeWrapper>
  <ComponentWithBrowserAPIs />
</HydrationSafeWrapper>
```

### 2. Client-Side Hooks

Use these hooks to safely handle client-side operations:

```tsx
import { useHasMounted, useClientEffect } from '@/hooks/useClientSide'

function MyComponent() {
  const hasMounted = useHasMounted()
  
  // Only runs on client after mount
  useClientEffect(() => {
    // Safe to use browser APIs here
    window.localStorage.setItem('key', 'value')
  }, [])
  
  if (!hasMounted) {
    return <p>Loading...</p>
  }
  
  return <div>Client-side content</div>
}
```

### 3. SSR-Safe Utilities

For accessing browser APIs safely:

```tsx
import { isBrowser, getLocalStorageSafe } from '@/utilities/clientUtils'

function MyComponent() {
  const handleClick = () => {
    if (isBrowser) {
      // Safe to use browser APIs
      getLocalStorageSafe().setItem('clicked', 'true')
    }
  }
  
  return <button onClick={handleClick}>Click me</button>
}
```

### 4. Best Practices

1. **Never access browser globals during render**:
   - ❌ `const isClient = typeof window !== 'undefined'` (during render)
   - ✅ Use `useHasMounted()` hook or `useEffect()`

2. **Move non-deterministic code to useEffect**:
   - ❌ `<p>{new Date().toLocaleString()}</p>`
   - ✅ Use state set in useEffect

3. **Use Next.js built-in solutions**:
   - `'use client'` directive for client-only components
   - Dynamic imports with `{ ssr: false }` option

4. **Handle differences with conditional rendering**:
   ```tsx
   {hasMounted && <ClientOnlyComponent />}
   ```

## Debugging Hydration Errors

When encountering hydration errors:

1. Check browser console for detailed error messages
2. Look for components using browser APIs directly in render
3. Identify non-deterministic values in your JSX
4. Wrap problematic components in `HydrationSafeWrapper`
5. Consider moving client-only code to separate components with `'use client'` directive
