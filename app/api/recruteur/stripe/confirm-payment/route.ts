import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createPrismaClient } from '@/lib/prisma';
import Stripe from 'stripe';

// Configuration des forfaits (prix en cents CAD)
const PLANS = {
  mensuel: { price: 50000, maxOffres: 1, durationDays: 30 },
  trimestriel: { price: 100000, maxOffres: 5, durationDays: 90 },
  annuel: { price: 150000, maxOffres: 12, durationDays: 365 },
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
    const { paymentIntentId, planId } = body;

    if (!paymentIntentId || !planId) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
    }

    const plan = PLANS[planId as keyof typeof PLANS];

    // Vérifier le statut du PaymentIntent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json(
        { error: 'Paiement non confirmé' },
        { status: 400 }
      );
    }

    // Créer l'abonnement en base de données
    const prisma = createPrismaClient();

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.durationDays);

    const subscription = await prisma.recruiterSubscription.upsert({
      where: { clerkUserId: userId },
      create: {
        clerkUserId: userId,
        plan: planId,
        price: plan.price / 100, // Convertir en dollars
        maxOffres: plan.maxOffres,
        startDate: new Date(),
        endDate,
        isActive: true,
        paymentMethod: 'stripe',
        paymentStatus: 'completed',
        paymentIntentId: paymentIntentId,
      },
      update: {
        plan: planId,
        price: plan.price / 100,
        maxOffres: plan.maxOffres,
        endDate,
        isActive: true,
        paymentMethod: 'stripe',
        paymentStatus: 'completed',
        paymentIntentId: paymentIntentId,
        updatedAt: new Date(),
      },
    });

    await prisma.$disconnect();

    return NextResponse.json({
      success: true,
      subscription,
    });
  } catch (error) {
    console.error('Erreur confirmation paiement Stripe:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la confirmation du paiement Stripe' },
      { status: 500 }
    );
  }
}
