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
      orderBy: {
        createdAt: 'desc',
      },
    });

    await prisma.$disconnect();

    // Formater les données pour l'affichage - données minimales pour respecter RGPD/Loi 25
    // Seules les informations strictement nécessaires sont exposées
    const formattedCandidates = candidates.map(candidate => ({
      id: candidate.id,
      nomFamille: candidate.nomFamille,
      prenom: candidate.prenom,
      // Ville et pays de résidence uniquement - pas de téléphone ni email direct
      adresseVille: candidate.adresseVille,
      adressePays: candidate.adressePays,
      statutImmigration: candidate.statutImmigration,
      createdAt: candidate.createdAt,
      // Email du candidat masqué - contact via le système uniquement
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
