'use client';

import { useState } from 'react';
import { CreditCard, Loader2 } from 'lucide-react';

interface StripeCheckoutProps {
  planId: string;
  planName: string;
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

/**
 * Paiement Stripe via Checkout Sessions (page hébergée par Stripe).
 * Remplace l'ancienne intégration Payment Element (dépréciée) :
 * on crée une session côté serveur puis on redirige vers l'URL Stripe.
 * Le succès est confirmé par le webhook checkout.session.completed.
 */
export default function StripeCheckout({
  planId,
  planName,
  amount,
  onError,
}: StripeCheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      const response = await fetch('/api/recruteur/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });

      const result = await response.json();

      if (!response.ok || !result.url) {
        throw new Error(result.error || 'Erreur lors de la création du paiement');
      }

      // Redirection vers la page de paiement hébergée par Stripe
      window.location.href = result.url;
      // onSuccess sera déclenché au retour via ?payment=success (géré par la page parente)
    } catch (err: any) {
      setIsProcessing(false);
      onError(err.message || 'Erreur Stripe');
    }
  };

  return (
    <form onSubmit={handlePayment} className="space-y-4">
      <button
        type="submit"
        disabled={isProcessing}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Redirection vers Stripe...
          </>
        ) : (
          <>
            <CreditCard className="h-4 w-4" />
            Payer ${amount} CAD — {planName}
          </>
        )}
      </button>

      <p className="text-xs text-center text-muted-foreground">
        Paiement sécurisé par Stripe (page hébergée Stripe)
      </p>
    </form>
  );
}
