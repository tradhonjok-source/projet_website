import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import Stripe from 'stripe';
import { createPrismaClient } from '@/lib/prisma';

// Forfaits (prix en dollars CAD)
const PLANS = {
  mensuel: { price: 500, maxOffres: 1, durationDays: 30 },
  trimestriel: { price: 1000, maxOffres: 5, durationDays: 90 },
  annuel: { price: 1500, maxOffres: 12, durationDays: 365 },
};

const planNames: Record<string, string> = {
  mensuel: 'Forfait Mensuel',
  trimestriel: 'Forfait Trimestriel',
  annuel: 'Forfait Annuel',
};

/**
 * POST - Crée une Checkout Session Stripe (page de paiement hébergée par Stripe)
 * et renvoie l'URL vers laquelle rediriger le client.
 *
 * Remplace l'ancienne intégration Payment Element (dépréciée par Stripe) :
 * moins de code client, 3DS géré par Stripe, thème/UX cohérents.
 */
export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    return NextResponse.json(
      { error: 'Configuration Stripe manquante' },
      { status: 500 }
    );
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2026-08-26.dahlia',
  });

  let prisma;
  try {
    const body = await request.json();
    const { planId } = body;

    if (!planId || !['mensuel', 'trimestriel', 'annuel'].includes(planId)) {
      return NextResponse.json({ error: 'Forfait invalide' }, { status: 400 });
    }

    const plan = PLANS[planId as keyof typeof PLANS];

    prisma = createPrismaClient();

    // Email depuis Clerk (pré-renpli dans le checkout)
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);
    const email = clerkUser.emailAddresses[0]?.emailAddress || '';

    // Le recruteur doit être validé pour payer
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { isValidated: true, rejectedAt: true, role: true },
    });

    if (!dbUser || dbUser.role !== 'recruteur') {
      return NextResponse.json({ error: 'Rôle recruteur requis' }, { status: 403 });
    }
    if (!dbUser.isValidated) {
      return NextResponse.json(
        {
          error: dbUser.rejectedAt
            ? 'Votre compte recruteur a été rejeté par notre équipe.'
            : 'Votre compte recruteur est en attente de validation. Vous pourrez souscrire une fois validé.',
        },
        { status: 403 }
      );
    }

    await prisma.$disconnect();
    prisma = undefined;

    const origin = request.nextUrl.origin;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment', // paiement unique (pas d'abonnement récurrent Stripe)
      payment_method_types: ['card'],
      customer_email: email || undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'cad',
            unit_amount: plan.price * 100, // Stripe attend des cents
            product_data: {
              name: `${planNames[planId]} - Cabinet DETIE`,
              description: `${plan.maxOffres} offre(s) d'emploi, durée ${plan.durationDays} jours`,
            },
          },
        },
      ],
      metadata: {
        planId,
        userId,
        type: 'recruiter_subscription',
      },
      payment_intent_data: {
        metadata: { planId, userId, type: 'recruiter_subscription' },
      },
      success_url: `${origin}/fr/compte/dashboard/recruteur?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/fr/compte/dashboard/recruteur/abonnement?payment=cancelled`,
      locale: 'fr',
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error: any) {
    console.error('Erreur création Checkout Session Stripe:', error);
    if (prisma) {
      await prisma.$disconnect().catch(() => {});
    }
    return NextResponse.json(
      { error: `Stripe: ${error.message || 'Erreur inconnue'}` },
      { status: 500 }
    );
  }
}
