import { ClerkProvider } from '@clerk/nextjs';
import { enUS } from '@clerk/localizations';

export default function CompteLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      localization={enUS}
      appearance={{
        variables: {
          colorPrimary: '#7c3aed',
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
