'use client';

import { useUser, SignOutButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import {
  Check, CreditCard, LogOut, ArrowLeft, DollarSign, Calendar, FileText,
  Sparkles, Shield, Zap
} from 'lucide-react';

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
    name: 'Monthly',
    price: 500,
    maxOffres: 1,
    period: 'month',
    features: [
      '1 job offer',
      'Duration: 30 days',
      'Email support',
      'Cancel anytime',
    ],
  },
  {
    id: 'trimestriel',
    name: 'Quarterly',
    price: 1000,
    maxOffres: 5,
    period: '3 months',
    features: [
      '5 job offers',
      'Duration: 90 days',
      'Priority support',
      'Advanced statistics',
      'Save 25%',
    ],
    popular: true,
  },
  {
    id: 'annuel',
    name: 'Annual',
    price: 1500,
    maxOffres: 12,
    period: 'year',
    features: [
      '12 job offers',
      'Duration: 365 days',
      'Dedicated 24/7 support',
      'Premium statistics',
      '"Verified Recruiter" badge',
      'Save 50%',
    ],
  },
];

function AbonnementContent() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal' | null>(null);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/en/compte/connexion');
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
        router.push('/en/compte/dashboard/recruteur?payment=success');
      } else {
        alert(result.error || 'Payment error');
      }
    } catch (error) {
      alert('Server connection error');
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
        throw new Error(result.error || 'Error creating PayPal order');
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
        router.push('/en/compte/dashboard/recruteur?payment=success');
      } else {
        alert(result.error || 'Error capturing payment');
      }
    } catch (error) {
      console.error('PayPal onApprove error:', error);
      alert('Server connection error');
    } finally {
      setIsProcessing(false);
      setPaymentMethod(null);
    }
  };

  const handlePayPalOnError = (error: Error) => {
    console.error('PayPal error:', error);
    alert('PayPal error: ' + error.message);
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
          <Link href="/en" className="text-xl font-bold gradient-text">Cabinet DETIE</Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user?.firstName || 'Recruiter'}
            </span>
            <SignOutButton>
              <button className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </SignOutButton>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Link
          href="/en/compte/dashboard/recruteur"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-violet-400">
            Choose Your Plan
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Access our recruitment services and post job offers to find the best international talents.
          </p>
        </div>

        {/* Info banner */}
        <div className="mb-12 rounded-2xl border border-violet-500/20 bg-violet-500/10 p-6 text-center">
          <p className="text-violet-300">
            <Shield className="h-5 w-5 inline mr-2" />
            Secure payment via PayPal - Credit card coming soon
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
                    Most Popular
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
                  {plan.maxOffres} offer{plan.maxOffres > 1 ? 's' : ''} included
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
                {selectedPlan === plan.id ? 'Selected' : 'Choose this plan'}
              </button>

              {selectedPlan === plan.id && (
                <div className="mt-4 space-y-3">
                  <p className="text-xs text-center text-muted-foreground">
                    Choose payment method:
                  </p>

                  {/* Stripe Button (mock for now) */}
                  <button
                    onClick={() => handleStripeSubscribe(plan.id)}
                    disabled={isProcessing && paymentMethod === 'stripe'}
                    className="w-full py-2 rounded-xl border border-border hover:border-violet-500/50 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    <CreditCard className="h-4 w-4" />
                    Credit Card
                    {isProcessing && paymentMethod === 'stripe' && (
                      <div className="h-3 w-3 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                    )}
                  </button>

                  {/* PayPal Buttons */}
                  <div className="relative min-h-[45px]">
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
            <h3 className="text-lg font-semibold mb-2">Instant Publishing</h3>
            <p className="text-sm text-muted-foreground">
              Your offers are published immediately after payment and visible to thousands of candidates.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 mx-auto mb-4">
              <Shield className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Verified Candidates</h3>
            <p className="text-sm text-muted-foreground">
              All candidates are verified and have complete profiles to facilitate your selection.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 mx-auto mb-4">
              <DollarSign className="h-6 w-6 text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Best Value</h3>
            <p className="text-sm text-muted-foreground">
              Our plans are designed to offer maximum value to recruiters of all budgets.
            </p>
          </div>
        </div>

        {/* FAQ section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <FAQItem
              question="Can I cancel my subscription at any time?"
              answer="Yes, you can cancel your subscription at any time. Your access will remain active until the end of the paid period."
            />
            <FAQItem
              question="What happens when I reach my offer limit?"
              answer="When you reach your plan's offer limit, you can either wait for renewal or upgrade to a higher plan."
            />
            <FAQItem
              question="Can expired offers be renewed?"
              answer="Yes, you can renew an expired offer by paying renewal fees (50% of original price)."
            />
            <FAQItem
              question="Do you accept invoice payments for companies?"
              answer="For annual plans, we accept bank invoice payments. Contact us for more information."
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
