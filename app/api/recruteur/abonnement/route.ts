import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

// Configuration des forfaits
const PLANS = {
  mensuel: { price: 500, maxOffres: 1, durationDays: 30 },
  trimestriel: { price: 1000, maxOffres: 5, durationDays: 90 },
  annuel: { price: 1500, maxOffres: 12, durationDays: 365 },
};

// POST - Créer un abonnement
export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { planId, paymentMethod } = body;

    if (!planId || !['mensuel', 'trimestriel', 'annuel'].includes(planId)) {
      return NextResponse.json({ error: 'Forfait invalide' }, { status: 400 });
    }

    if (!paymentMethod || !['stripe', 'paypal'].includes(paymentMethod)) {
      return NextResponse.json({ error: 'Mode de paiement invalide' }, { status: 400 });
    }

    const plan = PLANS[planId as keyof typeof PLANS];
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.durationDays);

    const subscription = await prisma.recruiterSubscription.upsert({
      where: { clerkUserId: userId },
      create: {
        clerkUserId: userId,
        plan: planId,
        price: plan.price,
        maxOffres: plan.maxOffres,
        startDate: new Date(),
        endDate,
        isActive: true,
        paymentMethod,
        paymentStatus: 'completed',
      },
      update: {
        plan: planId,
        price: plan.price,
        maxOffres: plan.maxOffres,
        endDate,
        isActive: true,
        paymentMethod,
        paymentStatus: 'completed',
        updatedAt: new Date(),
      },
    });

    await prisma.$disconnect();

    return NextResponse.json({
      success: true,
      subscription,
    });
  } catch (error) {
    console.error('Erreur création abonnement:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la création de l\'abonnement' },
      { status: 500 }
    );
  }
}

// GET - Récupérer l'abonnement du recruteur
export async function GET(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    const subscription = await prisma.recruiterSubscription.findUnique({
      where: { clerkUserId: userId },
    });

    await prisma.$disconnect();

    if (!subscription) {
      return NextResponse.json({ hasSubscription: false });
    }

    const now = new Date();
    const isActive = subscription.isActive && subscription.endDate > now;

    // Compter les offres actives
    const prisma2 = new PrismaClient();
    const activePostings = await prisma2.jobPosting.count({
      where: {
        clerkUserId: userId,
        isActive: true,
      },
    });
    await prisma2.$disconnect();

    return NextResponse.json({
      hasSubscription: true,
      subscription: {
        ...subscription,
        isActive,
        remainingOffres: subscription.maxOffres - activePostings,
        totalOffres: subscription.maxOffres,
      },
    });
  } catch (error) {
    console.error('Erreur récupération abonnement:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération de l\'abonnement' },
      { status: 500 }
    );
  }
}
