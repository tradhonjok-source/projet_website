'use client';

import { useEffect, useState, useRef } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { CreditCard, Check, Loader2, X } from 'lucide-react';

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

  // Debug: component mounted
  useEffect(() => {
    console.log('[StripeCheckout] Component mounted for plan:', planId);
  }, [planId]);

  // Initialiser Stripe
  useEffect(() => {
    console.log('[StripeCheckout] Initializing Stripe...');
    const initStripe = async () => {
      try {
        const stripeInstance = await stripePromise;
        console.log('[StripeCheckout] Stripe promise resolved:', stripeInstance ? 'success' : 'null');
        if (!stripeInstance) {
          throw new Error('Stripe n\'a pas pu être initialisé');
        }
        setStripe(stripeInstance);
      } catch (err: any) {
        console.error('[StripeCheckout] Stripe init error:', err);
        onError(err.message || 'Erreur Stripe');
        setIsLoading(false);
      }
    };
    initStripe();
  }, [onError]);

  // Créer le PaymentIntent
  useEffect(() => {
    if (!stripe) return;

    const createPaymentIntent = async () => {
      try {
        console.log('Creating payment intent for plan:', planId);
        const response = await fetch('/api/recruteur/stripe/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ planId }),
        });

        const result = await response.json();
        console.log('Payment intent response:', result);

        if (!response.ok) {
          throw new Error(result.error || 'Erreur lors de l\'initialisation du paiement');
        }

        if (!result.clientSecret) {
          throw new Error('clientSecret manquant dans la réponse');
        }

        setClientSecret(result.clientSecret);
      } catch (err: any) {
        console.error('Create payment intent error:', err);
        setError(err.message || 'Erreur de connexion au serveur');
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [stripe, planId]);

  // Monter le Payment Element
  useEffect(() => {
    if (!stripe || !clientSecret || !paymentElementRef.current) return;

    const mountElements = async () => {
      try {
        console.log('Mounting Stripe elements...');
        const elementsInstance = stripe.elements({
          clientSecret,
          appearance: {
            theme: 'night' as const,
            variables: {
              colorPrimary: '#8b5cf6',
              colorBackground: '#18181b',
              colorText: '#fafafa',
              colorDanger: '#ef4444',
              fontFamily: 'Inter, system-ui, sans-serif',
              spacingUnit: '8px',
              borderRadius: '8px',
            },
          },
        });

        const paymentElement = elementsInstance.create('payment');
        paymentElement.mount(paymentElementRef.current!);

        paymentElement.on('ready', () => {
          console.log('Payment element ready');
          setIsLoading(false);
        });

        paymentElement.on('change', (event: any) => {
          if (event.error) {
            setError(event.error.message);
          } else {
            setError(null);
          }
        });

        setElements(elementsInstance);
      } catch (err: any) {
        console.error('Mount elements error:', err);
        setError(err.message || 'Erreur lors de l\'affichage du formulaire');
        setIsLoading(false);
      }
    };

    mountElements();
  }, [stripe, clientSecret]);

  const handlePayment = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      onError('Stripe n\'est pas initialisé');
      return;
    }

    setIsProcessing(true);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw new Error(submitError.message);
      }

      // Récupérer le paymentIntentId du clientSecret
      const paymentIntentId = clientSecret.split('_secret_')[0];

      // Confirmer le paiement
      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${typeof window !== 'undefined' ? window.location.origin : ''}/fr/compte/dashboard/recruteur?payment=success`,
        },
        redirect: 'if_required',
      });

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      // Paiement réussi - confirmer dans la base de données
      const response = await fetch('/api/recruteur/stripe/confirm-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentIntentId,
          planId,
        }),
      });

      const confirmResult = await response.json();

      if (response.ok) {
        onSuccess();
      } else {
        throw new Error(confirmResult.error || 'Erreur lors de la confirmation');
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      onError(err.message || 'Erreur lors du traitement du paiement');
      setIsProcessing(false);
    }
  };

  if (error) {
    return (
      <div className="text-center py-4">
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-4">
        <Loader2 className="h-4 w-4 animate-spin" />
        Initialisation du paiement...
      </div>
    );
  }

  return (
    <form onSubmit={handlePayment} className="space-y-4">
      {/* Element Stripe pour la carte */}
      <div
        ref={paymentElementRef}
        className="p-4 rounded-xl border border-border bg-background"
      />

      {/* Bouton de paiement */}
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

      {/* Note de sécurité */}
      <p className="text-xs text-center text-muted-foreground">
        <Check className="h-3 w-3 inline mr-1" />
        Paiement sécurisé par Stripe
      </p>
    </form>
  );
}
