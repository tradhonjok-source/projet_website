'use client';

import { useUser, RedirectToSignIn } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

function SSOCallbackContent() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      // Recuperar la URL de redirección desde los parámetros
      const redirectUrl = searchParams.get('redirect_url') || '/es/compte/dashboard/recruteur';
      router.push(redirectUrl);
    }
  }, [isLoaded, isSignedIn, user, router, searchParams]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-950/30 via-background to-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-violet-400 mx-auto mb-4" />
          <p className="text-muted-foreground">Finalizando la inscripción...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  return null;
}

export default function SSOCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-950/30 via-background to-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-violet-400 mx-auto mb-4" />
          <p className="text-muted-foreground">Finalizando la inscripción...</p>
        </div>
      </div>
    }>
      <SSOCallbackContent />
    </Suspense>
  );
}
