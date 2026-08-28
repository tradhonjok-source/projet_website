import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createPrismaClient } from '@/lib/prisma';

// Configuration des forfaits (prix en dollars CAD)
const PLANS = {
  mensuel: { price: 500, maxOffres: 1, durationDays: 30 },
  trimestriel: { price: 1000, maxOffres: 5, durationDays: 90 },
  annuel: { price: 1500, maxOffres: 12, durationDays: 365 },
};

// Noms des forfaits pour l'affichage PayPal
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

  try {
    const body = await request.json();
    const { planId } = body;

    if (!planId || !['mensuel', 'trimestriel', 'annuel'].includes(planId)) {
      return NextResponse.json({ error: 'Forfait invalide' }, { status: 400 });
    }

    const plan = PLANS[planId as keyof typeof PLANS];
    const amount = plan.price.toFixed(2); // Prix déjà en dollars (500 = $500)

    // Appeler l'API PayPal pour créer une commande
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

    // Créer la commande PayPal avec détails itemisés
    const orderResponse = await fetch(
      `${paypalApiUrl}/v2/checkout/orders`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [
            {
              name: `Abonnement ${planNames[planId as keyof typeof planNames]}`,
              description: `Service de recrutement - Cabinet DETIE`,
              custom_id: `subscription-${planId}-${userId}`,
              soft_descriptor: 'CABINETDETIE',
              amount: {
                currency_code: 'CAD',
                value: amount,
                breakdown: {
                  subtotal: {
                    currency_code: 'CAD',
                    value: amount,
                  },
                  shipping: {
                    currency_code: 'CAD',
                    value: '0.00',
                  },
                  tax_total: {
                    currency_code: 'CAD',
                    value: '0.00',
                  },
                },
              },
            },
          ],
          application_context: {
            brand_name: 'Cabinet DETIE',
            landing_page: 'LOGIN',
            user_action: 'PAY_NOW',
            no_shipping: 1,
            return_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/fr/compte/dashboard/recruteur?payment=success`,
            cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/fr/compte/dashboard/recruteur/abonnement?payment=cancelled`,
          },
        }),
      }
    );

    if (!orderResponse.ok) {
      console.error('PayPal order creation error:', await orderResponse.text());
      return NextResponse.json(
        { error: 'Erreur lors de la création de la commande PayPal' },
        { status: 500 }
      );
    }

    const orderData = await orderResponse.json();

    return NextResponse.json({
      orderId: orderData.id,
    });
  } catch (error) {
    console.error('Erreur création commande PayPal:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la création de la commande PayPal' },
      { status: 500 }
    );
  }
}
