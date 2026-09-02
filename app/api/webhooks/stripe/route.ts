import { NextRequest, NextResponse } from 'next/server';
import { createPrismaClient } from '@/lib/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-08-26.dahlia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!webhookSecret) {
  throw new Error('STRIPE_WEBHOOK_SECRET non configuré dans les variables d\'environnement');
}

// POST - Gérer les webhooks Stripe
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Signature Stripe manquante' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    // Vérifier la signature du webhook
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Erreur validation webhook Stripe:', err);
    return NextResponse.json(
      { error: 'Webhook Error: Invalid signature' },
      { status: 400 }
    );
  }

  const prisma = createPrismaClient();

  // Gérer les événements de paiement
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      try {
        const { planId, userId } = paymentIntent.metadata;

        if (!planId || !userId) {
          console.error('Métadonnées manquantes:', paymentIntent.metadata);
          break;
        }

        // Déterminer les détails du plan
        const planDetails = getPlanDetails(planId);

        // Calculer la date de fin
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + planDetails.months);

        // Créer ou mettre à jour l'abonnement
        await prisma.recruiterSubscription.upsert({
          where: { clerkUserId: userId },
          update: {
            plan: planDetails.plan as 'mensuel' | 'trimestriel' | 'annuel',
            price: planDetails.price,
            maxOffres: planDetails.maxOffres,
            endDate,
            isActive: true,
            paymentMethod: 'stripe',
            paymentStatus: 'completed',
            paymentIntentId: paymentIntent.id,
            updatedAt: new Date(),
          },
          create: {
            clerkUserId: userId,
            plan: planDetails.plan as 'mensuel' | 'trimestriel' | 'annuel',
            price: planDetails.price,
            maxOffres: planDetails.maxOffres,
            endDate,
            isActive: true,
            paymentMethod: 'stripe',
            paymentStatus: 'completed',
            paymentIntentId: paymentIntent.id,
          },
        });

        // S'assurer que l'utilisateur existe dans la table User
        await prisma.user.upsert({
          where: { clerkId: userId },
          update: {
            role: 'recruteur',
          },
          create: {
            clerkId: userId,
            email: paymentIntent.receipt_email || '',
            role: 'recruteur',
          },
        });

        console.log(`Abonnement Stripe confirmé pour ${userId}`);
      } catch (error) {
        console.error('Erreur traitement payment_intent.succeeded:', error);
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      try {
        const { userId } = paymentIntent.metadata;

        if (userId) {
          // Marquer l'abonnement comme inactif
          await prisma.recruiterSubscription.update({
            where: { clerkUserId: userId },
            data: {
              isActive: false,
              paymentStatus: 'failed',
              updatedAt: new Date(),
            },
          }).catch(() => {});

          console.log(`Paiement échoué pour ${userId}: ${paymentIntent.last_payment_error?.message}`);
        }
      } catch (error) {
        console.error('Erreur traitement payment_intent.payment_failed:', error);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;

      try {
        const { userId } = subscription.metadata;

        if (userId) {
          await prisma.recruiterSubscription.update({
            where: { clerkUserId: userId },
            data: {
              isActive: false,
              paymentStatus: 'cancelled',
              updatedAt: new Date(),
            },
          }).catch(() => {});

          console.log(`Abonnement annulé pour ${userId}`);
        }
      } catch (error) {
        console.error('Erreur traitement customer.subscription.deleted:', error);
      }
      break;
    }

    default:
      console.log(`Événement Stripe non géré: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

function getPlanDetails(planId: string) {
  switch (planId) {
    case 'mensuel':
      return { plan: 'mensuel', price: 500, maxOffres: 1, months: 1 };
    case 'trimestriel':
      return { plan: 'trimestriel', price: 1500, maxOffres: 5, months: 3 };
    case 'annuel':
      return { plan: 'annuel', price: 1500, maxOffres: 12, months: 12 };
    default:
      return { plan: 'mensuel', price: 500, maxOffres: 1, months: 1 };
  }
}
