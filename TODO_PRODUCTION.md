# 🚧 TODO Avant Production

## ✅ Corrigé (2026-08-30)

| Problème | Statut |
|----------|--------|
| DATABASE_URL exposée dans `.env` | ✅ Supprimée, remplacée par exemple |
| Routes `/admin` publiques | ✅ Protégées par middleware |
| API `/api/candidats` expose emails | ✅ Emails retirés |
| Page `/fr/contact` 404 | ✅ Créée + API d'envoi email |
| Page `/fr/compte/profil/parametres` 404 | ✅ Créée |
| Page `/fr/compte/dashboard/candidat/candidatures` 404 | ✅ Créée |
| Webhook Stripe manquant | ✅ Créé |
| Vérification abonnement API offres | ✅ Ajoutée |
| Formulaire contact sans envoi | ✅ nodemailer installé + API |
| `.env.example` pour production | ✅ Créé |
| `DEPLOYMENT.md` guide | ✅ Créé |

---

## ⚠️ Problèmes mineurs restants

### 1. Pages EN/ES non terminées

Les pages anglaises et espagnoles (`app/en/...`, `app/es/...`) sont des copies incomplètes des pages FR avec :
- Imports manquants (icônes Lucide)
- Types non définis pour les handlers
- Traductions partielles

**Recommandation** : Soit supprimer ces langues pour le MVP, soit terminer les traductions.

### 2. Type PayPal onError

```typescript
app/en/compte/dashboard/recruteur/abonnement/page.tsx(432,7)
```

Le handler `onError` de PayPal attend un type différent.

**Fix rapide** :
```typescript
const handlePayPalOnError = (error: Record<string, unknown>) => {
  console.error('PayPal error:', error);
  alert('Erreur PayPal');
};
```

### 3. Clerk `window.Clerk`

```typescript
app/en/compte/profil/candidat/page.tsx
app/fr/compte/profil/candidat/page.tsx
```

Utilisation de `window.Clerk` qui n'est pas dans les types.

**Fix** : Ajouter un type guard ou utiliser `useClerk()` hook.

---

## 📋 Checklist Finale Production

- [ ] **Variables d'environnement** : Configurer dans Vercel
- [ ] **DATABASE_URL** : Utiliser Prisma Postgres ou autre DB production
- [ ] **Stripe** : Passer en clés live (`pk_live_...`, `sk_live_...`)
- [ ] **Stripe Webhook** : Configurer l'URL dans le dashboard
- [ ] **PayPal** : Passer en mode production (retirer `sandbox`)
- [ ] **Clerk** : Vérifier que les URLs sont correctes en production
- [ ] **Email** : Configurer SMTP production (ex: SendGrid, Resend)
- [ ] **Nom de domaine** : Configurer dans Vercel
- [ ] **SSL** : Automatique avec Vercel
- [ ] **Tests manuels** :
  - [ ] Inscription candidat
  - [ ] Inscription recruteur
  - [ ] Paiement Stripe (carte test)
  - [ ] Paiement PayPal (sandbox)
  - [ ] Publication offre
  - [ ] Recherche candidats
  - [ ] Formulaire de contact
  - [ ] Webhook Stripe (via CLI local puis production)

---

## 🔧 Commandes utiles

```bash
# Déploiement local
npm run build
npm start

# Prisma migrations
npx prisma migrate deploy

# Stripe webhook local (pour testing)
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Vérifier les logs Vercel
vercel logs --follow
```

---

**Dernière mise à jour** : 2026-08-30
