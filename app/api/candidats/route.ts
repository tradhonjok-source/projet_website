import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createPrismaClient } from '@/lib/prisma';

// GET - Récupérer tous les candidats ou rechercher
export async function GET(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const prisma = createPrismaClient();

    // Vérifier que l'utilisateur a un abonnement actif
    const subscription = await prisma.recruiterSubscription.findUnique({
      where: { clerkUserId: userId },
    });

    if (!subscription || !subscription.isActive) {
      return NextResponse.json(
        { error: 'Abonnement requis pour accéder aux candidats' },
        { status: 403 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const secteur = searchParams.get('secteur') || '';
    const langue = searchParams.get('langue') || '';

    // Récupérer tous les profils candidats (sans email pour confidentialité)
    const candidats = await prisma.candidateProfile.findMany({
      include: {
        user: {
          select: {
            clerkId: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Filtrage côté client pour les champs JSON
    let result = candidats.filter((candidat: any) => {
      let match = true;

      // Filtre par recherche textuelle
      if (search) {
        const searchLower = search.toLowerCase();
        const nom = (candidat.nomFamille || '').toLowerCase();
        const prenom = (candidat.prenom || '').toLowerCase();
        const ville = (candidat.adresseVille || '').toLowerCase();

        // Recherche dans les études
        const etudes = candidat.etudes || [];
        const ecoleMatch = Array.isArray(etudes) && etudes.some((e: any) =>
          e.ecole?.toLowerCase().includes(searchLower)
        );

        // Recherche dans les expériences
        const experiences = candidat.experiences || [];
        const entrepriseMatch = Array.isArray(experiences) && experiences.some((e: any) =>
          e.entreprise?.toLowerCase().includes(searchLower) ||
          e.poste?.toLowerCase().includes(searchLower)
        );

        if (!nom.includes(searchLower) &&
            !prenom.includes(searchLower) &&
            !ville.includes(searchLower) &&
            !ecoleMatch &&
            !entrepriseMatch) {
          match = false;
        }
      }

      // Filtre par secteur (basé sur les expériences)
      if (secteur && match) {
        const experiences = candidat.experiences || [];
        const secteurMatch = Array.isArray(experiences) && experiences.some((e: any) =>
          e.secteur?.toLowerCase().includes(secteur.toLowerCase())
        );
        if (!secteurMatch) match = false;
      }

      // Filtre par langue (basé sur les compétences)
      if (langue && match) {
        const competences = (candidat.competences || '').toLowerCase();
        if (!competences.includes(langue.toLowerCase())) match = false;
      }

      return match;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Erreur GET candidats:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des candidats' },
      { status: 500 }
    );
  }
}
