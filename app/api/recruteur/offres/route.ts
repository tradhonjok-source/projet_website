import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createPrismaClient } from '@/lib/prisma';

// GET - Récupérer toutes les offres ou une offre spécifique
export async function GET(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  try {
    const prisma = createPrismaClient();

    if (id) {
      // Récupérer une offre spécifique
      const offre = await prisma.jobPosting.findUnique({
        where: { id },
      });

      if (!offre) {
        return NextResponse.json({ error: 'Offre non trouvée' }, { status: 404 });
      }

      // Vérifier que l'offre appartient à l'utilisateur
      if (offre.clerkUserId !== userId) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
      }

      return NextResponse.json(offre);
    } else {
      // Récupérer toutes les offres de l'utilisateur
      const offres = await prisma.jobPosting.findMany({
        where: { clerkUserId: userId },
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json(offres);
    }
  } catch (error) {
    console.error('Erreur GET offres:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des offres' },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle offre
export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, company, location, description, requirements, salary } = body;

    if (!title || !company || !location || !description) {
      return NextResponse.json(
        { error: 'Les champs obligatoires sont requis' },
        { status: 400 }
      );
    }

    const prisma = createPrismaClient();

    // Vérifier que l'utilisateur a un abonnement actif
    const subscription = await prisma.recruiterSubscription.findUnique({
      where: { clerkUserId: userId },
    });

    if (!subscription || !subscription.isActive) {
      return NextResponse.json(
        { error: 'Abonnement requis pour publier une offre' },
        { status: 403 }
      );
    }

    // Vérifier qu'il reste des offres disponibles
    const activeOffresCount = await prisma.jobPosting.count({
      where: {
        clerkUserId: userId,
        isActive: true,
      },
    });

    if (activeOffresCount >= subscription.maxOffres) {
      return NextResponse.json(
        { error: `Limite d'offres atteinte (${subscription.maxOffres}). Veuillez upgrade votre forfait.` },
        { status: 403 }
      );
    }

    // Calculer la date d'expiration (30 jours par défaut)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const offre = await prisma.jobPosting.create({
      data: {
        clerkUserId: userId,
        title,
        company,
        location,
        description,
        requirements: requirements || null,
        salary: salary || null,
        expiresAt,
        isActive: true,
      },
    });

    return NextResponse.json(offre, { status: 201 });
  } catch (error) {
    console.error('Erreur POST offre:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la création de l\'offre' },
      { status: 500 }
    );
  }
}

// PUT - Modifier une offre
export async function PUT(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID de l\'offre requis' }, { status: 400 });
    }

    const body = await request.json();
    const { title, company, location, description, requirements, salary } = body;

    if (!title || !company || !location || !description) {
      return NextResponse.json(
        { error: 'Les champs obligatoires sont requis' },
        { status: 400 }
      );
    }

    const prisma = createPrismaClient();

    // Vérifier que l'offre existe et appartient à l'utilisateur
    const existingOffre = await prisma.jobPosting.findUnique({
      where: { id },
    });

    if (!existingOffre) {
      return NextResponse.json({ error: 'Offre non trouvée' }, { status: 404 });
    }

    if (existingOffre.clerkUserId !== userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const offre = await prisma.jobPosting.update({
      where: { id },
      data: {
        title,
        company,
        location,
        description,
        requirements: requirements || null,
        salary: salary || null,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(offre);
  } catch (error) {
    console.error('Erreur PUT offre:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la modification de l\'offre' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une offre
export async function DELETE(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID de l\'offre requis' }, { status: 400 });
    }

    const prisma = createPrismaClient();

    // Vérifier que l'offre existe et appartient à l'utilisateur
    const existingOffre = await prisma.jobPosting.findUnique({
      where: { id },
    });

    if (!existingOffre) {
      return NextResponse.json({ error: 'Offre non trouvée' }, { status: 404 });
    }

    if (existingOffre.clerkUserId !== userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    await prisma.jobPosting.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur DELETE offre:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la suppression de l\'offre' },
      { status: 500 }
    );
  }
}
