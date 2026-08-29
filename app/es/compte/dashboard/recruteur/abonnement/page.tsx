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
    name: 'Mensual',
    price: 500,
    maxOffres: 1,
    period: 'mes',
    features: [
      '1 oferta de empleo',
      'Duración: 30 días',
      'Soporte por email',
      'Cancelación anytime',
    ],
  },
  {
    id: 'trimestriel',
    name: 'Trimestral',
    price: 1000,
    maxOffres: 5,
    period: '3 meses',
    features: [
      '5 ofertas de empleo',
      'Duración: 90 días',
      'Soporte prioritario',
      'Estadísticas avanzadas',
      'Ahorro: 25%',
    ],
    popular: true,
  },
  {
    id: 'annuel',
    name: 'Anual',
    price: 1500,
    maxOffres: 12,
    period: 'año',
    features: [
      '12 ofertas de empleo',
      'Duración: 365 días',
      'Soporte dedicado 24/7',
      'Estadísticas premium',
      'Distintivo "Reclutador verificado"',
      'Ahorro: 50%',
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
      router.push('/es/compte/connexion');
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
        router.push('/es/compte/dashboard/recruteur?payment=success');
      } else {
        alert(result.error || 'Error durante el pago');
      }
    } catch (error) {
      alert('Error de conexión al servidor');
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
        throw new Error(result.error || 'Error al crear la orden de PayPal');
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
        router.push('/es/compte/dashboard/recruteur?payment=success');
      } else {
        alert(result.error || 'Error al capturar el pago');
      }
    } catch (error) {
      console.error('PayPal onApprove error:', error);
      alert('Error de conexión al servidor');
    } finally {
      setIsProcessing(false);
      setPaymentMethod(null);
    }
  };

  const handlePayPalOnError = (error: Error) => {
    console.error('PayPal error:', error);
    alert('Error PayPal: ' + error.message);
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
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/es" className="text-xl font-bold gradient-text">Gabinete DETIE</Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user?.firstName || 'Reclutador'}
            </span>
            <SignOutButton>
              <button className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Cerrar sesión</span>
              </button>
            </SignOutButton>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Link
          href="/es/compte/dashboard/recruteur"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al tablero
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-violet-400">
            Elija su plan
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Acceda a nuestros servicios de reclutamiento y publique ofertas de empleo para encontrar los mejores talentos internacionales.
          </p>
        </div>

        <div className="mb-12 rounded-2xl border border-violet-500/20 bg-violet-500/10 p-6 text-center">
          <p className="text-violet-300">
            <Shield className="h-5 w-5 inline mr-2" />
            Pago seguro por PayPal • Tarjeta de crédito próximamente
          </p>
        </div>

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
                    Más popular
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
                  {plan.maxOffres} oferta{plan.maxOffres > 1 ? 's' : ''} incluida{plan.maxOffres > 1 ? 's' : ''}
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
                {selectedPlan === plan.id ? 'Seleccionado' : 'Elegir este plan'}
              </button>

              {selectedPlan === plan.id && (
                <div className="mt-4 space-y-3">
                  <p className="text-xs text-center text-muted-foreground">
                    Elegir el modo de pago:
                  </p>

                  <button
                    onClick={() => handleStripeSubscribe(plan.id)}
                    disabled={isProcessing && paymentMethod === 'stripe'}
                    className="w-full py-2 rounded-xl border border-border hover:border-violet-500/50 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    <CreditCard className="h-4 w-4" />
                    Tarjeta de crédito
                    {isProcessing && paymentMethod === 'stripe' && (
                      <div className="h-3 w-3 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                    )}
                  </button>

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

        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          <div className="text-center p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 mx-auto mb-4">
              <Zap className="h-6 w-6 text-violet-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Publicación instantánea</h3>
            <p className="text-sm text-muted-foreground">
              Sus ofertas se publican inmediatamente después del pago y son visibles por miles de candidatos.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 mx-auto mb-4">
              <Shield className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Candidatos verificados</h3>
            <p className="text-sm text-muted-foreground">
              Todos los candidatos son verificados y disponen de perfiles completos para facilitar su selección.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 mx-auto mb-4">
              <DollarSign className="h-6 w-6 text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Mejor relación calidad-precio</h3>
            <p className="text-sm text-muted-foreground">
              Nuestros planes están diseñados para ofrecer el máximo valor a reclutadores de todos los presupuestos.
            </p>
          </div>
        </div>

        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Preguntas frecuentes</h2>
          <div className="space-y-4">
            <FAQItem
              question="¿Puedo cancelar mi suscripción en cualquier momento?"
              answer="Sí, puede cancelar su suscripción en cualquier momento. Su acceso permanecerá activo hasta el final del período pagado."
            />
            <FAQItem
              question="¿Qué sucede cuando alcanzo el límite de ofertas?"
              answer="Cuando alcanza el límite de ofertas de su plan, puede esperar la renovación o actualizar a un plan superior."
            />
            <FAQItem
              question="¿Las ofertas expiradas pueden ser renovadas?"
              answer="Sí, puede renovar una oferta expirada pagando los gastos de renovación (50% del precio original)."
            />
            <FAQItem
              question="¿Aceptan pagos por factura para empresas?"
              answer="Para los planes anuales, aceptamos pagos por factura bancaria. Contáctenos para más información."
            />
          </div>
        </div>
      </main>
    </div>
  );
}

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
