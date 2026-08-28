import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createPrismaClient } from '@/lib/prisma';

// Configuration des forfaits (prix en dollars CAD)
const PLANS = {
  mensuel: { price: 500, maxOffres: 1, durationDays: 30 },
  trimestriel: { price: 1000, maxOffres: 5, durationDays: 90 },
  annuel: { price: 1500, maxOffres: 12, durationDays: 365 },
};

export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { orderId, planId } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID manquant' }, { status: 400 });
    }

    if (!planId || !['mensuel', 'trimestriel', 'annuel'].includes(planId)) {
      return NextResponse.json({ error: 'Forfait invalide' }, { status: 400 });
    }

    const plan = PLANS[planId as keyof typeof PLANS];

    // Récupérer les credentials PayPal
    const paypalApiUrl = process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error('PayPal credentials missing');
      return NextResponse.json(
        { error: 'Configuration PayPal manquante' },
        { status: 500 }
      );
    }

    // Obtenir un access token
    const tokenResponse = await fetch(
      `${paypalApiUrl}/v1/oauth2/token`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
      }
    );

    if (!tokenResponse.ok) {
      console.error('PayPal token error:', await tokenResponse.text());
      return NextResponse.json(
        { error: 'Erreur de connexion à PayPal' },
        { status: 500 }
      );
    }

    const { access_token } = await tokenResponse.json();

    // Capturer la commande PayPal
    const captureResponse = await fetch(
      `${paypalApiUrl}/v2/checkout/orders/${orderId}/capture`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!captureResponse.ok) {
      const errorText = await captureResponse.text();
      console.error('PayPal capture error:', errorText);

      // Vérifier si c'est une erreur de commande déjà capturée
      if (captureResponse.status === 400) {
        // Essayer de récupérer les détails de la commande
        const detailsResponse = await fetch(
          `${paypalApiUrl}/v2/checkout/orders/${orderId}`,
          {
            headers: {
              'Authorization': `Bearer ${access_token}`,
            },
          }
        );

        if (detailsResponse.ok) {
          const details = await detailsResponse.json();
          // Si la commande est déjà complétée, on continue
          if (details.status !== 'COMPLETED') {
            return NextResponse.json(
              { error: 'Le paiement n\'a pas pu être capturé' },
              { status: 400 }
            );
          }
        }
      } else {
        return NextResponse.json(
          { error: 'Erreur lors de la capture du paiement PayPal' },
          { status: 500 }
        );
      }
    }

    const captureData = captureResponse.ok ? await captureResponse.json() : null;
    const paymentIntentId = captureData?.purchase_units?.[0]?.payments?.captures?.[0]?.id || orderId;

    // Créer l'abonnement en base de données
    const prisma = createPrismaClient();

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
        paymentMethod: 'paypal',
        paymentStatus: 'completed',
        paymentIntentId: paymentIntentId,
      },
      update: {
        plan: planId,
        price: plan.price,
        maxOffres: plan.maxOffres,
        endDate,
        isActive: true,
        paymentMethod: 'paypal',
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
    console.error('Erreur capture PayPal:', error);
    if (prisma) {
      await prisma.$disconnect().catch(() => {});
    }
    return NextResponse.json(
      { error: 'Erreur serveur lors de la capture du paiement PayPal' },
      { status: 500 }
    );
  }
}
