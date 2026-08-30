import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import Stripe from 'stripe';

// Configuration des forfaits (prix en cents CAD)
const PLANS = {
  mensuel: { price: 50000, maxOffres: 1, durationDays: 30 },
  trimestriel: { price: 150000, maxOffres: 5, durationDays: 90 },
  annuel: { price: 150000, maxOffres: 12, durationDays: 365 },
};

const planNames = {
  mensuel: 'Forfait Mensuel',
  trimestriel: 'Forfait Trimestriel',
  annuel: 'Forfait Annuel',
};

export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  // Initialiser Stripe avec la clé secrète
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    return NextResponse.json(
      { error: 'Configuration Stripe manquante' },
      { status: 500 }
    );
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2025-09-08.atlas',
  });

  try {
    const body = await request.json();
    const { planId } = body;

    if (!planId || !['mensuel', 'trimestriel', 'annuel'].includes(planId)) {
      return NextResponse.json({ error: 'Forfait invalide' }, { status: 400 });
    }

    const plan = PLANS[planId as keyof typeof PLANS];

    // Créer un PaymentIntent Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: plan.price,
      currency: 'cad',
      description: `Abonnement ${planNames[planId as keyof typeof planNames]} - Cabinet DETIE`,
      metadata: {
        planId,
        userId,
        type: 'recruiter_subscription',
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Erreur création PaymentIntent Stripe:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la création du paiement Stripe' },
      { status: 500 }
    );
  }
}
