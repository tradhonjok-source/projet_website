import { ClerkProvider } from '@clerk/nextjs';
import { esES } from '@clerk/localizations';

export default function CompteLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      localization={esES}
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
