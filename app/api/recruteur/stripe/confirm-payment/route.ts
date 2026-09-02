import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
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
    console.error('[Stripe Confirm] No userId');
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  console.log('[Stripe Confirm] Starting for userId:', userId);

  // Initialiser Stripe avec la clé secrète
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    console.error('[Stripe Confirm] Missing STRIPE_SECRET_KEY');
    return NextResponse.json(
      { error: 'Configuration Stripe manquante' },
      { status: 500 }
    );
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2026-08-26.dahlia',
  });

  try {
    const body = await request.json();
    const { paymentIntentId, planId } = body;

    console.log('[Stripe Confirm] Received paymentIntentId:', paymentIntentId, 'planId:', planId);

    if (!paymentIntentId || !planId) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
    }

    const plan = PLANS[planId as keyof typeof PLANS];

    // Vérifier le statut du PaymentIntent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    console.log('[Stripe Confirm] PaymentIntent status:', paymentIntent.status);

    // Accepter les statuts 'succeeded' et 'processing' (le paiement peut être en cours de traitement)
    if (!['succeeded', 'processing'].includes(paymentIntent.status)) {
      return NextResponse.json(
        { error: `Paiement non confirmé (statut: ${paymentIntent.status})` },
        { status: 400 }
      );
    }

    // Récupérer l'email de l'utilisateur depuis Clerk
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const email = user.emailAddresses[0]?.emailAddress || '';
    console.log('[Stripe Confirm] User email:', email);

    // Créer l'abonnement en base de données
    const prisma = createPrismaClient();

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.durationDays);

    // S'assurer que l'utilisateur existe dans la table User
    await prisma.user.upsert({
      where: { clerkId: userId },
      create: {
        clerkId: userId,
        email,
        role: 'recruteur',
      },
      update: {},
    });

    console.log('[Stripe Confirm] Creating subscription...');

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

    console.log('[Stripe Confirm] Subscription created:', subscription.id);

    await prisma.$disconnect();

    return NextResponse.json({
      success: true,
      subscription,
    });
  } catch (error) {
    console.error('Erreur confirmation paiement Stripe:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json(
      { error: 'Erreur serveur lors de la confirmation du paiement Stripe', details: errorMessage },
      { status: 500 }
    );
  }
}
