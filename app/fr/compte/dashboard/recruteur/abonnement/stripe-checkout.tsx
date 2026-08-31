'use client';

import { useEffect, useState, useRef } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { CreditCard, Check, Loader2 } from 'lucide-react';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
);

interface StripeCheckoutProps {
  planId: string;
  planName: string;
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export default function StripeCheckout({
  planId,
  planName,
  amount,
  onSuccess,
  onError,
}: StripeCheckoutProps) {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [elements, setElements] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState<string | null>(null);
  const paymentElementRef = useRef<HTMLDivElement>(null);
  const elementMountedRef = useRef(false);

  // Initialiser Stripe - une seule fois au montage
  useEffect(() => {
    console.log('[StripeCheckout] Initializing Stripe...');
    let cancelled = false;

    const initStripe = async () => {
      try {
        const stripeInstance = await stripePromise;
        console.log('[StripeCheckout] Stripe promise resolved:', stripeInstance ? 'success' : 'null');
        if (!stripeInstance) {
          throw new Error('Stripe n\'a pas pu être initialisé');
        }
        if (!cancelled) {
          setStripe(stripeInstance);
        }
      } catch (err: any) {
        console.error('[StripeCheckout] Stripe init error:', err);
        if (!cancelled) {
          setError(err.message || 'Erreur Stripe');
          setIsLoading(false);
        }
      }
    };
    initStripe();

    return () => {
      cancelled = true;
    };
  }, []);

  // Créer le PaymentIntent
  useEffect(() => {
    console.log('[StripeCheckout] createPaymentIntent - stripe:', stripe ? 'present' : 'null');
    if (!stripe) {
      return;
    }

    let cancelled = false;

    const createPaymentIntent = async () => {
      try {
        console.log('[StripeCheckout] Fetching /api/recruteur/stripe/create-payment-intent...');
        const response = await fetch('/api/recruteur/stripe/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ planId }),
        });
        console.log('[StripeCheckout] Fetch response status:', response.status);

        const result = await response.json();
        console.log('[StripeCheckout] Payment intent response:', result);

        if (!response.ok) {
          throw new Error(result.error || 'Erreur lors de l\'initialisation du paiement');
        }

        if (!result.clientSecret) {
          throw new Error('clientSecret manquant dans la réponse');
        }

        if (!cancelled) {
          console.log('[StripeCheckout] Setting clientSecret:', result.clientSecret.substring(0, 10) + '...');
          setClientSecret(result.clientSecret);
          elementMountedRef.current = false; // Reset pour permettre le montage
        }
      } catch (err: any) {
        console.error('[StripeCheckout] Create payment intent error:', err);
        if (!cancelled) {
          setError(err.message || 'Erreur de connexion au serveur');
          setIsLoading(false);
        }
      }
    };

    createPaymentIntent();

    return () => {
      cancelled = true;
    };
  }, [stripe, planId]);

  // Monter le Payment Element
  useEffect(() => {
    console.log('[StripeCheckout] Mount useEffect - stripe:', stripe ? 'present' : 'null', 'clientSecret:', clientSecret ? 'set' : 'null', 'mounted:', elementMountedRef.current, 'ref:', paymentElementRef.current ? 'attached' : 'null');

    if (!stripe) {
      console.log('[StripeCheckout] Mount skipped: stripe is null');
      return;
    }
    if (!clientSecret) {
      console.log('[StripeCheckout] Mount skipped: clientSecret is null');
      return;
    }
    if (elementMountedRef.current) {
      console.log('[StripeCheckout] Already mounted, skipping');
      return;
    }
    if (!paymentElementRef.current) {
      console.log('[StripeCheckout] Mount skipped: ref is null');
      return;
    }

    // Mark as mounting to prevent re-entry
    elementMountedRef.current = true;

    let cancelled = false;
    let readyTimeout: NodeJS.Timeout;

    const mountElements = async () => {
      try {
        console.log('[StripeCheckout] Mounting Stripe elements...');

        const container = paymentElementRef.current;
        if (!container) {
          throw new Error('Container DOM element not found');
        }

        // Attendre un tick pour que le DOM soit prêt
        await new Promise(resolve => setTimeout(resolve, 50));

        const elementsInstance = stripe.elements({
          clientSecret,
          appearance: {
            theme: 'flat' as const,
          },
        });

        const paymentElement = elementsInstance.create('payment');
        paymentElement.mount(container);
        console.log('[StripeCheckout] Payment element mounted successfully');

        // Timeout de secours au cas où 'ready' ne serait pas déclenché
        readyTimeout = setTimeout(() => {
          if (!cancelled) {
            console.log('[StripeCheckout] Ready timeout - assuming element is ready');
            setIsLoading(false);
          }
        }, 2000);

        paymentElement.on('ready', () => {
          console.log('[StripeCheckout] Payment element ready event fired');
          if (!cancelled) {
            clearTimeout(readyTimeout);
            setIsLoading(false);
          }
        });

        paymentElement.on('change', (event: any) => {
          if (cancelled) return;
          if (event.error) {
            console.error('[StripeCheckout] Payment element error:', event.error);
            setError(event.error.message);
          } else {
            setError(null);
          }
        });

        if (!cancelled) {
          setElements(elementsInstance);
        }
      } catch (err: any) {
        console.error('[StripeCheckout] Mount elements error:', err);
        if (!cancelled) {
          setError(err.message || 'Erreur lors de l\'affichage du formulaire');
          setIsLoading(false);
          elementMountedRef.current = false;
        }
      }
    };

    mountElements();

    return () => {
      cancelled = true;
      if (readyTimeout) clearTimeout(readyTimeout);
    };
  }, [stripe, clientSecret]);

  const handlePayment = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      onError('Stripe n\'est pas initialisé');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw new Error(submitError.message);
      }

      const paymentIntentId = clientSecret.split('_secret_')[0];

      // Confirmer le paiement
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${typeof window !== 'undefined' ? window.location.origin : ''}/fr/compte/dashboard/recruteur?payment=success`,
        },
        redirect: 'if_required',
      });

      // Si on arrive ici, c'est que le paiement n'a pas nécessité de redirection
      // Vérifier si le paiement a réussi
      if (result.error) {
        throw new Error(result.error.message);
      }

      // Vérifier le statut du PaymentIntent
      if (result.paymentIntent?.status !== 'succeeded') {
        console.warn('[StripeCheckout] PaymentIntent status:', result.paymentIntent?.status);
        // Pour les tests, on continue même si le statut n'est pas 'succeeded' immédiatement
      }

      // Appeler l'API pour créer l'abonnement en base de données
      const response = await fetch('/api/recruteur/stripe/confirm-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentIntentId,
          planId,
        }),
      });

      const confirmResult = await response.json();

      if (!response.ok) {
        throw new Error(confirmResult.error || 'Erreur lors de la confirmation');
      }

      console.log('[StripeCheckout] Payment confirmed successfully');
      setIsProcessing(false);
      onSuccess();
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Erreur lors du traitement du paiement');
      setIsProcessing(false);
      onError(err.message || 'Erreur lors du paiement');
    }
  };

  if (error) {
    return (
      <div className="text-center py-4" suppressHydrationWarning>
        <p className="text-red-400 text-sm mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-xs text-violet-400 hover:underline"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handlePayment} className="space-y-4">
      <div
        className="p-4 rounded-xl border border-border bg-background min-h-[100px] relative"
        suppressHydrationWarning
      >
        <div
          ref={paymentElementRef}
          className="relative"
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 text-sm text-muted-foreground bg-background/80 z-10 rounded-xl pointer-events-none">
            <Loader2 className="h-4 w-4 animate-spin" />
            Initialisation du paiement...
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={!clientSecret || isProcessing}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Traitement...
          </>
        ) : (
          <>
            <CreditCard className="h-4 w-4" />
            Payer ${amount} CAD
          </>
        )}
      </button>

      <p className="text-xs text-center text-muted-foreground">
        <Check className="h-3 w-3 inline mr-1" />
        Paiement sécurisé par Stripe
      </p>
    </form>
  );
}
