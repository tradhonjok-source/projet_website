'use client';

import { useUser, SignOutButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import {
  Check, CreditCard, LogOut, ArrowLeft, DollarSign, Calendar, FileText,
  Sparkles, Shield, Zap, X
} from 'lucide-react';
import dynamic from 'next/dynamic';

const StripeCheckout = dynamic(
  () => import('./stripe-checkout'),
  { ssr: false, loading: () => <div className="text-sm text-muted-foreground">Chargement du paiement...</div> }
);

interface Plan {
  id: 'mensuel' | 'trimestriel' | 'annuel';
  name: string;
  price: number;
  maxOffres: number;
  period: string;
  features: string[];
  popular?: boolean;
}

const plans: Plan[] = [
  {
    id: 'mensuel',
    name: 'Mensuel',
    price: 500,
    maxOffres: 1,
    period: 'mois',
    features: [
      '1 offre d\'emploi',
      'Durée: 30 jours',
      'Support par email',
      'Annulation anytime',
    ],
  },
  {
    id: 'trimestriel',
    name: 'Trimestriel',
    price: 1000,
    maxOffres: 5,
    period: '3 mois',
    features: [
      '5 offres d\'emploi',
      'Durée: 90 jours',
      'Support prioritaire',
      'Statistiques avancées',
      'Économie: 25%',
    ],
    popular: true,
  },
  {
    id: 'annuel',
    name: 'Annuel',
    price: 1500,
    maxOffres: 12,
    period: 'an',
    features: [
      '12 offres d\'emploi',
      'Durée: 365 jours',
      'Support dédié 24/7',
      'Statistiques premium',
      'Badge "Recruteur vérifié"',
      'Économie: 50%',
    ],
  },
];

function AbonnementContent() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal' | null>(null);
  const [showStripeCheckout, setShowStripeCheckout] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/fr/compte/connexion');
    }
  }, [isLoaded, isSignedIn, router]);

  const handleStripeSubscribe = async (planId: string) => {
    setIsProcessing(true);
    setPaymentMethod('stripe');

    try {
      const response = await fetch('/api/recruteur/abonnement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          paymentMethod: 'stripe',
        }),
      });

      const result = await response.json();

      if (response.ok) {
        router.push('/fr/compte/dashboard/recruteur?payment=success');
      } else {
        alert(result.error || 'Erreur lors du paiement');
      }
    } catch (error) {
      alert('Erreur de connexion au serveur');
    } finally {
      setIsProcessing(false);
      setPaymentMethod(null);
    }
  };

  const handlePayPalCreateOrder = async (planId: string) => {
    try {
      const response = await fetch('/api/recruteur/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });

      const result = await response.json();

      if (response.ok) {
        return result.orderId;
      } else {
        throw new Error(result.error || 'Erreur lors de la création de la commande PayPal');
      }
    } catch (error) {
      console.error('PayPal createOrder error:', error);
      throw error;
    }
  };

  const handlePayPalOnApprove = async (data: { orderID: string }, planId: string) => {
    setIsProcessing(true);
    setPaymentMethod('paypal');

    try {
      const response = await fetch('/api/recruteur/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: data.orderID,
          planId,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        router.push('/fr/compte/dashboard/recruteur?payment=success');
      } else {
        alert(result.error || 'Erreur lors de la capture du paiement');
      }
    } catch (error) {
      console.error('PayPal onApprove error:', error);
      alert('Erreur de connexion au serveur');
    } finally {
      setIsProcessing(false);
      setPaymentMethod(null);
    }
  };

  const handlePayPalOnError = (error: Error) => {
    console.error('PayPal error:', error);
    alert('Erreur PayPal: ' + error.message);
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950/30 via-background to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/fr" className="text-xl font-bold gradient-text">Cabinet DETIE</Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user?.firstName || 'Recruteur'}
            </span>
            <SignOutButton>
              <button className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </SignOutButton>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Link
          href="/fr/compte/dashboard/recruteur"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au dashboard
        </Link>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-violet-400">
            Choisissez votre forfait
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Accédez à nos services de recrutement et publiez des offres d'emploi pour trouver les meilleurs talents internationaux.
          </p>
        </div>

        {/* Info banner */}
        <div className="mb-12 rounded-2xl border border-violet-500/20 bg-violet-500/10 p-6 text-center">
          <p className="text-violet-300">
            <Shield className="h-5 w-5 inline mr-2" />
            Paiement sécurisé par PayPal • Carte de crédit bientôt disponible
          </p>
        </div>

        {/* Plans */}
        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border p-8 transition-all ${
                plan.popular
                  ? 'border-violet-500 bg-violet-500/10 scale-105 shadow-xl shadow-violet-500/20'
                  : 'border-border bg-background/50 hover:border-violet-500/30'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-medium px-4 py-1 rounded-full flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Plus populaire
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold gradient-text">
                    ${plan.price}
                  </span>
                  <span className="text-muted-foreground">/ {plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {plan.maxOffres} offre{plan.maxOffres > 1 ? 's' : ''} incluse{plan.maxOffres > 1 ? 's' : ''}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setSelectedPlan(plan.id)}
                disabled={isProcessing}
                className={`w-full py-3 rounded-xl font-medium transition-all ${
                  selectedPlan === plan.id
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white'
                    : 'border border-border hover:border-violet-500/50'
                } disabled:opacity-50`}
              >
                {selectedPlan === plan.id ? 'Sélectionné' : 'Choisir ce forfait'}
              </button>

              {selectedPlan === plan.id && (
                <div className="mt-4 space-y-3">
                  <p className="text-xs text-center text-muted-foreground">
                    Choisir le mode de paiement :
                  </p>

                  {/* Bouton Stripe - Affiche le formulaire si cliqué */}
                  {mounted && showStripeCheckout === plan.id ? (
                    <div className="relative">
                      <button
                        onClick={() => setShowStripeCheckout(null)}
                        className="absolute -top-3 -right-3 p-1 rounded-full bg-background border border-border hover:bg-destructive/10 z-10"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <StripeCheckout
                        key={`stripe-${plan.id}`}
                        planId={plan.id}
                        planName={plan.name}
                        amount={plan.price}
                        onSuccess={() => {
                          router.push('/fr/compte/dashboard/recruteur?payment=success');
                        }}
                        onError={(error) => {
                          alert(error);
                          setShowStripeCheckout(null);
                        }}
                      />
                    </div>
                  ) : mounted ? (
                    <button
                      type="button"
                      onClick={() => setShowStripeCheckout(plan.id)}
                      disabled={isProcessing}
                      className="w-full py-2 rounded-xl border border-border hover:border-violet-500/50 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                      <CreditCard className="h-4 w-4" />
                      Carte de crédit (Stripe)
                    </button>
                  ) : (
                    <div className="w-full py-2 rounded-xl border border-border flex items-center justify-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-violet-500 border-t-transparent rounded-full" />
                    </div>
                  )}

                  {/* Boutons PayPal */}
                  <div className="relative min-h-[45px]">
                    {mounted && (
                      <PayPalButtonsWrapper
                        planId={plan.id}
                        isProcessing={isProcessing}
                        paymentMethod={paymentMethod}
                        onCreateOrder={() => handlePayPalCreateOrder(plan.id)}
                        onApprove={(data) => handlePayPalOnApprove(data, plan.id)}
                        onError={handlePayPalOnError}
                        onCancel={() => {
                          setIsProcessing(false);
                          setPaymentMethod(null);
                        }}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Features section */}
        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          <div className="text-center p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 mx-auto mb-4">
              <Zap className="h-6 w-6 text-violet-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Publication instantanée</h3>
            <p className="text-sm text-muted-foreground">
              Vos offres sont publiées immédiatement après paiement et visibles par des milliers de candidats.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 mx-auto mb-4">
              <Shield className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Candidats vérifiés</h3>
            <p className="text-sm text-muted-foreground">
              Tous les candidats sont vérifiés et disposent de profils complets pour faciliter votre sélection.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 mx-auto mb-4">
              <DollarSign className="h-6 w-6 text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Meilleur rapport qualité-prix</h3>
            <p className="text-sm text-muted-foreground">
              Nos forfaits sont conçus pour offrir le maximum de valeur aux recruteurs de tous budgets.
            </p>
          </div>
        </div>

        {/* FAQ section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Questions fréquentes</h2>
          <div className="space-y-4">
            <FAQItem
              question="Puis-je annuler mon abonnement à tout moment ?"
              answer="Oui, vous pouvez annuler votre abonnement à tout moment. Votre accès restera actif jusqu'à la fin de la période payée."
            />
            <FAQItem
              question="Que se passe-t-il lorsque j'atteins la limite d'offres ?"
              answer="Lorsque vous atteignez la limite d'offres de votre forfait, vous pouvez soit attendre le renouvellement, soit upgrade vers un forfait supérieur."
            />
            <FAQItem
              question="Les offres expirées peuvent-elles être renouvelées ?"
              answer="Oui, vous pouvez renouveler une offre expirée en payant les frais de renouvellement (50% du prix original)."
            />
            <FAQItem
              question="Acceptez-vous les paiements par facture pour les entreprises ?"
              answer="Pour les forfaits annuels, nous acceptons les paiements par facture bancaire. Contactez-nous pour plus d'informations."
            />
          </div>
        </div>
      </main>
    </div>
  );
}

// Wrapper component avec PayPalScriptProvider
function AbonnementRecruteurPage() {
  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'sb',
        intent: 'capture',
        currency: 'CAD',
      }}
    >
      <AbonnementContent />
    </PayPalScriptProvider>
  );
}

export default AbonnementRecruteurPage;

// Wrapper pour PayPalButtons avec gestion du chargement
function PayPalButtonsWrapper({
  planId,
  isProcessing,
  paymentMethod,
  onCreateOrder,
  onApprove,
  onError,
  onCancel,
}: {
  planId: string;
  isProcessing: boolean;
  paymentMethod: 'stripe' | 'paypal' | null;
  onCreateOrder: () => Promise<string>;
  onApprove: (data: { orderID: string }) => Promise<void>;
  onError: (error: Error) => void;
  onCancel: () => void;
}) {
  const [{ isPending }] = usePayPalScriptReducer();

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-[45px]">
        <div className="animate-spin h-5 w-5 border-2 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <PayPalButtons
      fundingSource="paypal"
      style={{
        layout: 'horizontal',
        color: 'gold',
        shape: 'rect',
        label: 'pay',
        height: 40,
      }}
      createOrder={onCreateOrder}
      onApprove={onApprove}
      onError={onError}
      onCancel={onCancel}
      disabled={isProcessing && paymentMethod !== 'paypal'}
    />
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-xl border border-border bg-background/50 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-border/10 transition-colors"
      >
        <span className="font-medium">{question}</span>
        <svg
          className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 pb-4 text-sm text-muted-foreground">
          {answer}
        </div>
      )}
    </div>
  );
}
