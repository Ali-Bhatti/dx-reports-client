# Azure Entra ID Authentication Setup

This application uses Azure Entra ID (formerly Azure Active Directory) for authentication.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_AZURE_CLIENT_ID=your_client_id_here
VITE_AZURE_AUTHORITY_URL=your_authority_url_here
```

## Configuration

The authentication configuration is located in `src/config/authConfig.ts`. The current setup includes:

- **Redirect URI**: Set to the current origin (automatically determined)
- **Cache Location**: Session storage
- **Scopes**: User.Read (for basic profile information)

## Components

- **AuthButton**: Login/logout button component located in `src/components/auth/AuthButton.tsx`
- **ProtectedRoute**: Component that protects routes requiring authentication
- **useAuth**: Custom hook for authentication state and actions

## Integration

The app is wrapped with `MsalProvider` in `main.tsx`, and the `ProtectedRoute` component is used in the layout to protect all routes.

## Usage

1. Set your Azure Entra ID Client ID and Authority URL in the `.env` file
2. Users will see a "Sign In" button when not authenticated
3. After authentication, users will see their name and a "Sign Out" button
4. All application routes are protected and require authentication