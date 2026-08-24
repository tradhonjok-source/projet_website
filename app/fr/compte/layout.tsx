import { ClerkProvider } from '@clerk/nextjs';
import { frFR } from '@clerk/localizations';

export default function CompteLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      localization={frFR}
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
