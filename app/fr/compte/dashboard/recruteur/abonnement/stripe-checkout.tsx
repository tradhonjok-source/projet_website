'use client';

import { useEffect, useState } from 'react';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
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
  const [elements, setElements] = useState<StripeElements | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  useEffect(() => {
    const initStripe = async () => {
      const stripeInstance = await stripePromise;
      if (stripeInstance) {
        setStripe(stripeInstance);
      }
    };
    initStripe();
  }, []);

  useEffect(() => {
    if (!stripe) return;

    const createPaymentIntent = async () => {
      setIsLoading(true);
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
        }
      } catch (error) {
        onError('Erreur de connexion au serveur');
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [stripe, planId, onError]);

  useEffect(() => {
    if (!stripe || !clientSecret) return;

    const elementsInstance = stripe.elements({
      clientSecret,
      appearance: {
        theme: 'stripe',
        variables: {
          colorPrimary: '#7c3aed',
          colorBackground: '#18181b',
          colorText: '#fafafa',
          colorDanger: '#ef4444',
          fontFamily: 'Inter, system-ui, sans-serif',
          spacingUnit: '4px',
          borderRadius: '8px',
        },
      },
    });

    setElements(elementsInstance);
  }, [stripe, clientSecret]);

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/fr/compte/dashboard/recruteur?payment=success`,
          payment_method_data: {
            billing_details: {
              name: 'Cabinet DETIE',
            },
          },
        },
        redirect: 'if_required',
      });

      if (error) {
        onError(error.message || 'Erreur lors du paiement');
      } else {
        // Paiement réussi - confirmer dans la base de données
        const response = await fetch('/api/recruteur/stripe/confirm-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentIntentId: elements.getElement()?.type === 'payment'
              ? (elements.getElement() as any).client_secret?.split('_secret_')[0]
              : clientSecret.split('_secret_')[0],
            planId,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          setPaymentConfirmed(true);
          onSuccess();
        } else {
          onError(result.error || 'Erreur lors de la confirmation');
        }
      }
    } catch (error) {
      onError('Erreur lors du traitement du paiement');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Initialisation du paiement...
      </div>
    );
  }

  if (paymentConfirmed) {
    return (
      <div className="flex items-center justify-center gap-2 text-sm text-emerald-400">
        <Check className="h-4 w-4" />
        Paiement confirmé !
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Element Stripe pour la carte */}
      {elements && (
        <div className="p-4 rounded-xl border border-border bg-background">
          <div id="payment-element">
            {/* Stripe Payment Element sera monté ici */}
          </div>
        </div>
      )}

      {/* Bouton de paiement */}
      <button
        onClick={handlePayment}
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

      {/* Script pour monter le Payment Element */}
      {elements && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var elements = ${JSON.stringify({ clientSecret })};
                var paymentElement = elements.create('payment');
                paymentElement.mount('#payment-element');
              })();
            `,
          }}
        />
      )}
    </div>
  );
}
