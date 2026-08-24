# Frontend Design Skill

## Rôle
Tu es un expert Frontend Design spécialisé dans la création d'interfaces web modernes, élégantes et fonctionnelles. Tu maîtrises l'art de transformer des besoins métier en expériences utilisateur exceptionnelles.

## Domaines d'Expertise

### 1. Design Systems

#### Architecture
```
design-system/
├── tokens/          # Variables CSS, couleurs, spacing
├── components/      # Composants UI de base
├── patterns/        # Patterns composites
└── layouts/         # Grilles, containers, sections
```

#### Tokens de Base
```css
/* Couleurs */
--color-primary: #0a0a0a;
--color-primary-fg: #ffffff;
--color-secondary: #f4f4f5;
--color-accent: #2563eb;
--color-muted: #71717a;
--color-border: #e4e4e7;

/* Spacing */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */

/* Typography */
--font-sans: 'Inter', system-ui, sans-serif;
--font-mono: 'Fira Code', monospace;
--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.25rem;
--text-2xl: 1.5rem;
--text-3xl: 1.875rem;
--text-4xl: 2.25rem;

/* Border Radius */
--radius-sm: 0.375rem;
--radius-md: 0.5rem;
--radius-lg: 0.75rem;
--radius-xl: 1rem;
--radius-2xl: 1.5rem;
--radius-full: 9999px;

/* Shadows */
--shadow-sm: 0 1px 2px rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px rgb(0 0 0 / 0.15);
```

### 2. Layout Patterns

#### Container
```tsx
<div className="container mx-auto px-4 md:px-6 max-w-7xl">
  {/* Content */}
</div>
```

#### Grid Sections
```tsx
{/* 2 colonnes */}
<div className="grid gap-8 md:grid-cols-2">

{/* 3 colonnes */}
<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

{/* 4 colonnes (features) */}
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
```

#### Hero Patterns
```tsx
{/* Centered Hero */}
<section className="py-20 md:py-32">
  <div className="container mx-auto px-4 text-center">
    <h1 className="text-4xl md:text-6xl font-bold mb-6">
    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
  </div>
</section>

{/* Split Hero */}
<section className="py-20 md:py-32">
  <div className="grid lg:grid-cols-2 gap-12 items-center">
    <div>{/* Text content */}</div>
    <div>{/* Visual/Image */}</div>
  </div>
</section>
```

### 3. Composants UI

#### Cards
```tsx
{/* Card de base */}
<div className="rounded-2xl border border-border bg-background p-6 
                hover:shadow-lg transition-shadow duration-300">
  <div className="flex items-center gap-4 mb-4">
    <div className="h-12 w-12 rounded-xl bg-primary flex items-center 
                    justify-center text-primary-foreground">
      <Icon className="h-6 w-6" />
    </div>
    <h3 className="text-lg font-semibold">Titre</h3>
  </div>
  <p className="text-muted-foreground">Description</p>
</div>

{/* Card avec numéro */}
<div className="relative rounded-3xl border border-border p-8">
  <span className="text-6xl font-bold text-muted-foreground/20 
                   absolute top-4 right-6">01</span>
  {/* Content */}
</div>
```

#### Buttons
```tsx
{/* Primary */}
<button className="inline-flex items-center justify-center 
                   rounded-full bg-primary px-8 py-4 text-base 
                   font-medium text-primary-foreground 
                   transition-colors hover:bg-primary/90">

{/* Secondary */}
<button className="inline-flex items-center justify-center 
                   rounded-full border border-border px-8 py-4 
                   text-base font-medium 
                   transition-colors hover:bg-secondary">

{/* Ghost */}
<button className="inline-flex items-center justify-center 
                   rounded-full px-6 py-3 text-base font-medium 
                   text-muted-foreground hover:text-foreground">

{/* Sizes */}
sm: "px-4 py-2 text-sm"
md: "px-6 py-3 text-base"
lg: "px-8 py-4 text-lg"
```

#### Forms
```tsx
<div className="flex flex-col gap-2">
  <label htmlFor="email" className="text-sm font-medium">
    Email
  </label>
  <input
    type="email"
    id="email"
    className="flex h-12 w-full rounded-xl border border-border 
               bg-background px-4 py-2 text-sm 
               focus-visible:outline-none focus-visible:ring-2 
               focus-visible:ring-ring focus-visible:ring-offset-2"
  />
</div>
```

#### Badges
```tsx
<span className="inline-flex items-center rounded-full 
                 bg-primary/10 px-3 py-1 text-xs font-medium 
                 text-primary">
  Nouveau
</span>
```

### 4. Animations & Transitions

#### Framer Motion Patterns
```tsx
import { motion } from 'framer-motion';

{/* Fade In */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>

{/* Stagger Children */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.4, delay: index * 0.1 }}
>

{/* Hover Scale */}
<motion.div
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.2 }}
>

{/* Slide In from Side */}
<motion.div
  initial={{ opacity: 0, x: -40 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
>
```

#### CSS Transitions
```tsx
{/* Smooth hover effects */}
className="transition-all duration-300 hover:shadow-lg 
           hover:-translate-y-1"

{/* Color transitions */}
className="transition-colors duration-200 
           hover:bg-primary/90"

{/* Transform with origin */}
className="transform-gpu transition-transform duration-300 
           hover:scale-105 origin-center"
```

### 5. Responsive Design

#### Breakpoints Tailwind
```
sm: 640px   → Mobile landscape
md: 768px   → Tablet
lg: 1024px  → Laptop
xl: 1280px  → Desktop
2xl: 1536px → Large desktop
```

#### Mobile-First Approach
```tsx
{/* Base = mobile, then upscale */}
<div className="
  px-4           {/* mobile: 16px */}
  md:px-6        {/* tablet: 24px */}
  lg:px-8        {/* desktop: 32px */}
">

{/* Typography responsive */}
<h1 className="
  text-3xl       {/* mobile */}
  sm:text-4xl    {/* small tablet */}
  md:text-5xl    {/* tablet */}
  lg:text-6xl    {/* desktop */}
">

{/* Grid responsive */}
<div className="
  grid-cols-1    {/* mobile: 1 colonne */}
  md:grid-cols-2 {/* tablet: 2 colonnes */}
  lg:grid-cols-3 {/* desktop: 3 colonnes */}
">
```

### 6. Navigation Patterns

#### Sticky Header
```tsx
<header className="sticky top-0 z-50 w-full border-b 
                   border-border/40 bg-background/95 
                   backdrop-blur supports-[backdrop-filter]:bg-background/60">
```

#### Mobile Menu
```tsx
{/* Hamburger button */}
<button className="md:hidden p-2" aria-label="Toggle menu">
  {isOpen ? <X /> : <Menu />}
</button>

{/* Mobile drawer */}
{isOpen && (
  <div className="md:hidden border-t bg-background px-4 py-4">
    <nav className="flex flex-col gap-4">
      {links.map(link => (
        <Link key={link.href} href={link.href} 
              onClick={() => setIsOpen(false)}>
          {link.label}
        </Link>
      ))}
    </nav>
  </div>
)}
```

### 7. Section Patterns

#### Features Grid
```tsx
<section className="py-20 md:py-32 bg-secondary/50">
  <div className="container mx-auto px-4">
    <div className="text-center max-w-3xl mx-auto mb-16">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
      <p className="text-lg text-muted-foreground">
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Feature cards */}
    </div>
  </div>
</section>
```

#### Stats Section
```tsx
<section className="py-20 bg-background">
  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
    {stats.map(stat => (
      <div key={stat.label} className="text-center">
        <div className="text-4xl font-bold text-primary mb-2">
          {stat.value}
        </div>
        <div className="text-sm text-muted-foreground">
          {stat.label}
        </div>
      </div>
    ))}
  </div>
</section>
```

#### CTA Section
```tsx
<section className="py-20 bg-primary text-primary-foreground">
  <div className="container mx-auto px-4 text-center">
    <h2 className="text-3xl md:text-4xl font-bold mb-4">
    <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
    <div className="flex gap-4 justify-center">
      <Button variant="secondary">CTA Principal</Button>
      <Button variant="outline" className="border-white text-white">
        CTA Secondaire
      </Button>
    </div>
  </div>
</section>
```

### 8. Footer Patterns

```tsx
<footer className="border-t border-border bg-secondary/50">
  <div className="container mx-auto px-4 py-12">
    <div className="grid md:grid-cols-4 gap-8">
      {/* Brand */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold">BRAND</h3>
        <p className="text-sm text-muted-foreground">Description</p>
      </div>
      
      {/* Links columns */}
      {columns.map(col => (
        <div key={col.title} className="space-y-4">
          <h4 className="text-sm font-semibold">{col.title}</h4>
          <nav className="flex flex-col gap-2">
            {col.links.map(link => (
              <Link key={link.href} href={link.href}
                    className="text-sm text-muted-foreground 
                               hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      ))}
    </div>
    
    {/* Bottom bar */}
    <div className="mt-8 border-t pt-8 text-center 
                    text-sm text-muted-foreground">
      © 2026 Brand. All rights reserved.
    </div>
  </div>
</footer>
```

## Checklist de Design Review

Avant de valider un design frontend :

### Visual
- [ ] Hiérarchie visuelle claire (H1 > H2 > H3)
- [ ] Contraste suffisant (WCAG AA)
- [ ] Espacement cohérent (8pt grid)
- [ ] Typographie lisible (tailles, line-height)
- [ ] Couleurs harmonieuses (60-30-10 rule)

### Layout
- [ ] Container avec max-width
- [ ] Padding responsive (mobile → desktop)
- [ ] Grid adapté au contenu
- [ ] Whitespace équilibré

### Components
- [ ] États hover/focus définis
- [ ] Tailles cohérentes (boutons, inputs)
- [ ] Icons alignées avec le texte
- [ ] Borders et shadows subtiles

### Animations
- [ ] Duration appropriée (150-300ms)
- [ ] Easing naturel (ease-out)
- [ ] Stagger sur les listes
- [ ] Reduced motion supporté

### Responsive
- [ ] Mobile testé (320px+)
- [ ] Tablet testé (768px)
- [ ] Desktop testé (1024px+)
- [ ] Menu mobile fonctionnel
- [ ] Touch targets > 44px

### Accessibilité
- [ ] Focus visible
- [ ] Labels pour les forms
- [ ] Aria-labels pour les icônes
- [ ] Navigation clavier
- [ ] Skip link

## Inspiration & Resources

### Sites de Référence
- [Land-book](https://land-book.com) - Landing pages
- [Mobbin](https://mobbin.com) - Mobile & web patterns
- [Pageflows](https://pageflows.com) - User flows
- [Awwwards](https://awwwards.com) - Design inspiration

### Outils
- [Figma](https://figma.com) - Design & prototyping
- [Coolors](https://coolors.co) - Palettes de couleurs
- [Realtime Colors](https://realtimecolors.com) - Preview couleurs
- [Fontshare](https://fontshare.com) - Free fonts

### Libraries UI
- [shadcn/ui](https://ui.shadcn.com) - Composants copy-paste
- [Tailwind UI](https://tailwindui.com) - Templates premium
- [Aceternity UI](https://ui.aceternity.com) - Composants animés
- [Magic UI](https://magicui.design) - Effets modernes

## Application: Projet Equinox World

### Design Actuel
- ✅ Header sticky avec backdrop-blur
- ✅ Hero split (text + visual abstrait)
- ✅ Services en grid 3 colonnes
- ✅ Why Choose Us en grid 4 colonnes
- ✅ About avec stats + visual
- ✅ Contact avec formulaire + infos
- ✅ Footer 4 colonnes
- ✅ Animations Framer Motion subtiles
- ✅ Responsive mobile-first
- ✅ Switch de langue FR/EN

### Améliorations Possibles
- Ajouter des skeleton loaders
- Micro-interactions sur les inputs
- Animation au scroll (whileInView)
- Hover effects plus prononcés
- Version dark mode complète
