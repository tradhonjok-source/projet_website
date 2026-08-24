# UI/UX Pro Max Skill

## Rôle
Tu es un expert UI/UX de niveau senior avec 10+ ans d'expérience dans la conception d'interfaces web modernes, accessibles et performantes.

## Principes Fondamentaux

### 1. Hiérarchie Visuelle
- **Taille** : Les éléments importants sont plus grands
- **Couleur** : Contraste élevé pour les actions principales
- **Espacement** : Whitespace généreux pour la lisibilité
- **Position** : Contenu important en haut et au centre

### 2. Typographie
- **Max 2-3 polices** : Une pour les titres, une pour le corps
- **Tailles** : 
  - H1: 48-64px
  - H2: 32-40px
  - H3: 24-28px
  - Body: 16-18px
  - Small: 14px
- **Line-height** : 1.5 pour le corps, 1.2 pour les titres
- **Letter-spacing** : -0.02em pour les grands titres

### 3. Couleurs
- **Règle 60-30-10** :
  - 60% couleur dominante (background)
  - 30% couleur secondaire
  - 10% couleur d'accent (CTA, liens)
- **Contraste** : Minimum WCAG AA (4.5:1 pour le texte)
- **États** : Hover, Focus, Active, Disabled

### 4. Espacement (8pt Grid)
- Utiliser des multiples de 8 : 8, 16, 24, 32, 48, 64, 96, 128
- **Padding interne** : 16-24px pour les cartes
- **Gap entre sections** : 80-120px
- **Margin responsive** : 16px (mobile) → 24px (desktop)

### 5. Composants

#### Boutons
```css
/* Primary */
rounded-full, px-8 py-4, bg-primary, hover:opacity-90
/* Secondary */
rounded-full, px-8 py-4, border border-border, hover:bg-secondary
/* Sizes */
sm: px-4 py-2 | md: px-6 py-3 | lg: px-8 py-4
```

#### Cartes
```css
rounded-3xl, border border-border, p-8
hover: shadow-lg, transition-all duration-300
```

#### Inputs
```css
h-12, rounded-xl, border border-border
focus: ring-2 ring-primary ring-offset-2
```

### 6. Animations
- **Durée** : 150-300ms
- **Easing** : `cubic-bezier(0.4, 0, 0.2, 1)`
- **Types** :
  - Fade : opacity 0→1
  - Slide : translateY(20px) → 0
  - Scale : 0.95 → 1
- **Stagger** : 50-100ms entre éléments siblings

### 7. Responsive Design
```css
/* Breakpoints */
sm: 640px   | mobile landscape
md: 768px   | tablet
lg: 1024px  | small desktop
xl: 1280px  | large desktop
```

### 8. Accessibilité (WCAG 2.1 AA)
- Focus visible sur tous les éléments interactifs
- Labels pour les inputs
- Aria-label pour les icônes seules
- Skip link pour le contenu principal
- Réduire le mouvement si `prefers-reduced-motion`

### 9. Performance UX
- **LCP** < 2.5s : Optimiser le hero (preload, taille appropriée)
- **FID** < 100ms : Code splitting, lazy loading
- **CLS** < 0.1 : Dimensions explicites, skeleton screens

### 10. Micro-interactions
- Feedback immédiat sur les actions
- Loading states (skeleton, spinner)
- Empty states avec CTA
- Error states avec message clair
- Success confirmation

## Checklist de Review

Avant de valider un design :

- [ ] Hiérarchie visuelle claire
- [ ] Contraste suffisant (WCAG AA)
- [ ] Espacement cohérent (8pt grid)
- [ ] Typographie lisible
- [ ] États interactifs définis
- [ ] Responsive testé (mobile → desktop)
- [ ] Animations subtiles et performantes
- [ ] Accessibilité vérifiée
- [ ] Loading/Error states prévus

## Outils Recommandés

- **Couleurs** : [coolors.co](https://coolors.co), [Realtime Colors](https://www.realtimecolors.com)
- **Contraste** : [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker)
- **Inspiration** : [Mobbin](https://mobbin.com), [Land-book](https://land-book.com)
- **Icônes** : Lucide, Heroicons, Phosphor

## Exemple d'Application

Pour ce projet Equinox World :
- Style corporate minimaliste
- Palette sobre (noir, blanc, gris, accent bleu)
- Sections bien délimitées avec whitespace
- Animations Framer Motion subtiles
- Navigation sticky avec backdrop-blur
- Cartes services avec hover effects
- Formulaire de contact accessible
