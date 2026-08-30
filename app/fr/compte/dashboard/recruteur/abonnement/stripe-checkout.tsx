'use client';

import { useEffect, useState, useRef } from 'react';
import { loadStripe, Stripe, PaymentElement } from '@stripe/stripe-js';
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
  const paymentElementRef = useRef<HTMLDivElement>(null);

  // Initialiser Stripe
  useEffect(() => {
    const initStripe = async () => {
      const stripeInstance = await stripePromise;
      if (stripeInstance) {
        setStripe(stripeInstance);
      } else {
        onError('Stripe n\'est pas configuré correctement');
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
        const response = await fetch('/api/recruteur/stripe/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ planId }),
        });

        const result = await response.json();

        if (response.ok) {
          setClientSecret(result.clientSecret);
        } else {
          onError(result.error || 'Erreur lors de l\'initialisation du paiement');
          setIsLoading(false);
        }
      } catch (error) {
        onError('Erreur de connexion au serveur');
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [stripe, planId, onError]);

  // Monter le Payment Element
  useEffect(() => {
    if (!stripe || !clientSecret || !paymentElementRef.current) return;

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
    setElements(elementsInstance);
    setIsLoading(false);
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
        onError(submitError.message || 'Erreur lors de la soumission');
        setIsProcessing(false);
        return;
      }

      // Récupérer le paymentIntentId du clientSecret
      const paymentIntentId = clientSecret.split('_secret_')[0];

      // Confirmer le paiement SANS redirection
      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${typeof window !== 'undefined' ? window.location.origin : ''}/fr/compte/dashboard/recruteur?payment=success`,
        },
        redirect: 'if_required',
      });

      if (confirmError) {
        onError(confirmError.message || 'Erreur lors du paiement');
        setIsProcessing(false);
        return;
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
        onError(confirmResult.error || 'Erreur lors de la confirmation');
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      onError('Erreur lors du traitement du paiement');
      setIsProcessing(false);
    }
  };

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
