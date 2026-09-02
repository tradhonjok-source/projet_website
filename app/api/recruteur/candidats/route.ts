import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { createPrismaClient } from '@/lib/prisma';

// GET - Récupérer la liste des candidats validés (recruteurs avec abonnement actif)
export async function GET(request: NextRequest) {
  let prisma;
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Vérifier que l'utilisateur est recruteur
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const role = user.publicMetadata?.role as string;

    if (role !== 'recruteur') {
      return NextResponse.json({ error: 'Accès réservé aux recruteurs' }, { status: 403 });
    }

    prisma = createPrismaClient();

    // Vérifier que le recruteur a un abonnement actif
    const subscription = await prisma.recruiterSubscription.findUnique({
      where: { clerkUserId: userId },
    });

    if (!subscription || !subscription.isActive || new Date(subscription.endDate) < new Date()) {
      return NextResponse.json(
        { error: 'Abonnement requis pour accéder à la liste des candidats' },
        { status: 403 }
      );
    }

    // Récupérer uniquement les candidats validés
    const candidates = await prisma.candidateProfile.findMany({
      where: {
        isValidated: true,
      },
      include: {
        user: {
          select: {
            email: true,
            role: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    await prisma.$disconnect();

    // Formater les données pour l'affichage (sans données sensibles)
    const formattedCandidates = candidates.map(candidate => ({
      id: candidate.id,
      email: candidate.email,
      nomFamille: candidate.nomFamille,
      prenom: candidate.prenom,
      telephone: candidate.telephone,
      lieuNaissancePays: candidate.lieuNaissancePays,
      adresseVille: candidate.adresseVille,
      adressePays: candidate.adressePays,
      statutImmigration: candidate.statutImmigration,
      createdAt: candidate.createdAt,
      // On ne montre pas les infos de validation aux recruteurs
      userEmail: candidate.user.email,
    }));

    return NextResponse.json({ candidates: formattedCandidates });
  } catch (error) {
    console.error('Erreur GET candidats recruteur:', error);
    if (prisma) {
      await prisma?.$disconnect().catch(() => {});
    }
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des candidats' },
      { status: 500 }
    );
  }
}
