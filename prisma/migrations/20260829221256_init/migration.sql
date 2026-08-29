-- CreateTable
CREATE TABLE "CandidateProfile" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nomFamille" TEXT,
    "prenom" TEXT,
    "dateNaissance" TIMESTAMP(3),
    "numeroPasseport" TEXT,
    "passeportDateDebut" TIMESTAMP(3),
    "passeportDateFin" TIMESTAMP(3),
    "lieuNaissanceVille" TEXT,
    "lieuNaissanceProvince" TEXT,
    "lieuNaissancePays" TEXT,
    "adresseNumero" TEXT,
    "adresseRue" TEXT,
    "adresseAppartement" TEXT,
    "adresseVille" TEXT,
    "adresseProvince" TEXT,
    "adresseCodePostal" TEXT,
    "adressePays" TEXT,
    "telephone" TEXT,
    "statutImmigration" TEXT,
    "controleEntreprise" BOOLEAN NOT NULL DEFAULT false,
    "controleEntrepriseDetails" TEXT,
    "etudes" JSONB,
    "experiences" JSONB,
    "declarationVille" TEXT,
    "declarationPays" TEXT,
    "declarationNomComplet" TEXT,
    "declarationSignature" TEXT,
    "declarationAcceptee" BOOLEAN NOT NULL DEFAULT false,
    "documents" JSONB,
    "fichiersUploades" JSONB,

    CONSTRAINT "CandidateProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'candidat',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecruiterQuestionnaire" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "entrepriseNom" TEXT,
    "entrepriseAdresse" TEXT,
    "entrepriseVille" TEXT,
    "entrepriseProvince" TEXT,
    "entrepriseCodePostal" TEXT,
    "entrepriseTelephone" TEXT,
    "entrepriseEmail" TEXT,
    "entrepriseSiteWeb" TEXT,
    "entrepriseNE" TEXT,
    "lobbyingInscrit" BOOLEAN NOT NULL DEFAULT false,
    "lobbyingNumero" TEXT,
    "lobbyingDetails" TEXT,
    "recrutementSecteur" TEXT,
    "recrutementPostesOuverts" INTEGER NOT NULL DEFAULT 0,
    "recrutementSalaires" TEXT,
    "recrutementAvantages" TEXT,
    "recrutementProcessus" TEXT,
    "internationalPays" TEXT,
    "internationalPartenaires" TEXT,
    "internationalExperience" TEXT,
    "permisRequis" BOOLEAN NOT NULL DEFAULT false,
    "permisTypes" TEXT,
    "ordreProfessionnel" TEXT,
    "ordreNumero" TEXT,
    "qcRegion" TEXT,
    "qcVillePrimaire" TEXT,
    "qcEtablissements" TEXT,
    "travailleurNom" TEXT,
    "travailleurPrenom" TEXT,
    "travailleurEmail" TEXT,
    "travailleurTelephone" TEXT,
    "travailleurNationalite" TEXT,
    "travailleurPasseport" TEXT,
    "travailleurFormation" TEXT,
    "travailleurExperience" TEXT,
    "travailleurCompetences" TEXT,
    "travailleurLangues" TEXT,
    "declarationAcceptee" BOOLEAN NOT NULL DEFAULT false,
    "declarationNom" TEXT,
    "declarationDate" TEXT,
    "declarationSignature" TEXT,

    CONSTRAINT "RecruiterQuestionnaire_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecruiterSubscription" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "plan" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "maxOffres" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "paymentMethod" TEXT NOT NULL,
    "paymentStatus" TEXT NOT NULL,
    "paymentIntentId" TEXT,

    CONSTRAINT "RecruiterSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobPosting" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requirements" TEXT,
    "salary" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "JobPosting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CandidateProfile_clerkUserId_key" ON "CandidateProfile"("clerkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RecruiterQuestionnaire_clerkUserId_key" ON "RecruiterQuestionnaire"("clerkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "RecruiterSubscription_clerkUserId_key" ON "RecruiterSubscription"("clerkUserId");

-- AddForeignKey
ALTER TABLE "CandidateProfile" ADD CONSTRAINT "CandidateProfile_clerkUserId_fkey" FOREIGN KEY ("clerkUserId") REFERENCES "User"("clerkId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecruiterQuestionnaire" ADD CONSTRAINT "RecruiterQuestionnaire_clerkUserId_fkey" FOREIGN KEY ("clerkUserId") REFERENCES "User"("clerkId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecruiterSubscription" ADD CONSTRAINT "RecruiterSubscription_clerkUserId_fkey" FOREIGN KEY ("clerkUserId") REFERENCES "User"("clerkId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobPosting" ADD CONSTRAINT "JobPosting_clerkUserId_fkey" FOREIGN KEY ("clerkUserId") REFERENCES "User"("clerkId") ON DELETE CASCADE ON UPDATE CASCADE;
