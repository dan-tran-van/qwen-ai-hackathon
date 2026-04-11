# Providers

Context providers that manage global application state and setup for the client application.

## Overview

This directory contains React context providers that are typically wrapped around the application root to provide global state management and third-party service initialization.

## Providers

### AuthProvider

**File:** [auth-provider.tsx](auth-provider.tsx)

Manages authentication state and user session information.

#### Features

- Fetches and caches authenticated user details from `/api/auth/user/`
- Provides user data and logout functionality through context
- Handles secure cookie management (access & refresh tokens)
- Shows loading state while fetching user data

#### Usage

```tsx
import AuthProvider from "@/providers/auth-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
```

#### Exported Hook

**`useAuth()`** - Access authentication context

```tsx
import { useAuth } from "@/providers/auth-provider";

export function UserProfile() {
  const { user, logout } = useAuth();

  return (
    <div>
      <p>Welcome, {user?.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

#### Context Value

```typescript
{
  user: UserDetails | null;        // Authenticated user object or null
  logout: () => void;              // Function to clear tokens and redirect home
}
```

### ReactQueryProvider

**File:** [react-query-provider.tsx](react-query-provider.tsx)

Initializes TanStack React Query for server state management.

#### Features

- Sets up React Query client with default configuration
- Enables caching and synchronization of server state
- Provides query hooks throughout the application

#### Usage

```tsx
import ReactQueryProvider from "@/providers/react-query-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ReactQueryProvider>{children}</ReactQueryProvider>;
}
```

#### Integration with AuthProvider

Both providers should be composed in the root layout:

```tsx
import AuthProvider from "@/providers/auth-provider";
import ReactQueryProvider from "@/providers/react-query-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactQueryProvider>
      <AuthProvider>{children}</AuthProvider>
    </ReactQueryProvider>
  );
}
```

## Notes

- All providers use `"use client"` directive (client-side only)
- `AuthProvider` depends on the API client from `@/lib/api/api`
- `AuthProvider` must be wrapped by `ReactQueryProvider` to function properly
- Both providers accept `children` as React nodes for composition
