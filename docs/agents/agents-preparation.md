# JDR Coffee - Agents Essentiels pour Démarrer

## Vue d'ensemble

8 agents stratégiques pour construire JDR Coffee de manière pragmatique et efficace.

## Résumé rapide

| # | Agent | Rôle | Priorité |
|---|-------|------|----------|
| 1 | **jdr-feature-planner** | Planification business/specs (non-tech) | 🔴 Critique |
| 2 | **jdr-monorepo-researcher** | Étude du monorepo (recherche, pas migration) | 🔴 Critique |
| 3 | **jdr-quality-gate** | Code review + build check | 🔴 Critique |
| 4 | **jdr-ux-challenger** | Validation cohérence design (mobile-first, pixel art) | 🔴 Critique |
| 5 | **jdr-historical-expert** | Recherche historique médiévale + corpus | 🟡 Important |
| 6 | **jdr-frontend-expert** | Implémentation React/Next.js | 🔴 Critique |
| 7 | **jdr-backend-expert** | API/Server Actions/Gemini | 🔴 Critique |
| 8 | **jdr-game-design-validator** | Validation économie/mécaniques/pricing | 🔴 Critique |

---

## 1. jdr-feature-planner

**Rôle** : Planificateur stratégique business

**Responsabilités** :
- Comprendre les besoins métier et game design
- Créer les specs fonctionnelles (non techniques)
- Définir les user stories et scénarios d'usage
- Identifier les contraintes business (mobile-first, French-first, médiéval)
- Préparer les critères d'acceptation

**Quand l'utiliser** :
- Avant de commencer toute nouvelle feature
- Pour clarifier un besoin utilisateur
- Pour valider l'alignement business

**Ce qu'il retourne** :
- Document de specs fonctionnelles
- User stories
- Critères d'acceptation
- Contraintes et exigences métier

**Modèle** : `sonnet` (raisonnement complexe)

---

## 2. jdr-monorepo-researcher

**Rôle** : Explorateur et documenteur du monorepo existant

**Responsabilités** :
- Explorer `/Users/tomo/Dev/jdr-coffee/` (monorepo source)
- Identifier le code, les données et patterns réutilisables
- Documenter ce qui existe (composants UI, données statiques, types)
- Analyser les choix techniques du monorepo
- **NE FAIT PAS** la migration, juste la recherche et documentation

**Quand l'utiliser** :
- Avant d'implémenter une feature qui pourrait exister dans le monorepo
- Pour identifier les assets à réutiliser (données, types, composants)
- Pour comprendre les patterns existants

**Ce qu'il retourne** :
- Liste des fichiers pertinents dans le monorepo
- Documentation des patterns trouvés
- Suggestions de code/données à réutiliser
- Analyse technique (dépendances, structure)

**Modèle** : `sonnet` (analyse complexe)

---

## 3. jdr-quality-gate

**Rôle** : Gardien de la qualité technique

**Responsabilités** :
- Code review (React 19, TypeScript strict, best practices)
- Validation TypeScript (`npm run type-check`)
- Build check (`npm run build`)
- Détection des anti-patterns
- Vérification de la sécurité (XSS, injection, etc.)

**Quand l'utiliser** :
- Après avoir implémenté une feature
- Avant de marquer une tâche comme complète
- Peut être auto-déclenché via hook `stop`

**Ce qu'il retourne** :
- 🔴 Critical Issues (must fix)
- 🟡 Warnings (should fix)
- 🟢 Suggestions (nice to have)
- Build status (PASS/FAIL)
- Type errors avec file:line

**Modèle** : `sonnet` (review complète)

---

## 4. jdr-ux-challenger

**Rôle** : Challenger de la cohérence UX/design

**Responsabilités** :
- Vérifier la conformité mobile-first (360px viewport)
- Valider les touch targets (min 44px × 44px)
- Contrôler les fonts (min 16px pour éviter le zoom iOS)
- Vérifier la cohérence de l'esthétique pixel art médiéval
- Détecter les overflow horizontaux
- Challenger les choix UX (navigation, interactions, hiérarchie visuelle)
- Valider l'accessibilité (contraste, WCAG)

**Quand l'utiliser** :
- Après avoir créé/modifié des composants UI
- Lors de la review d'une feature frontend
- Pour valider une nouvelle page ou écran

**Ce qu'il retourne** :
- ✅ UX cohérente / ⚠️ Incohérences / ❌ Violations
- Liste des problèmes avec file:line
- Suggestions d'amélioration UX
- Score de conformité mobile

**Modèle** : `sonnet` (analyse UX nécessite raisonnement)

---

## 5. jdr-historical-expert

**Rôle** : Expert en authenticité historique médiévale

**Responsabilités** :
- Rechercher des sources historiques fiables en ligne
- Valider l'authenticité médiévale (périodes, matériaux, économie)
- Documenter le corpus historique au fur et à mesure
- Fournir des références pour les prix, objets, contextes
- Vérifier la cohérence des périodes (Bronze Age, Medieval, Renaissance)

**Quand l'utiliser** :
- Lors de la création d'items, matériaux, périodes
- Pour valider des prix ou valeurs économiques historiques
- Quand on a besoin de références médiévales authentiques
- Pour enrichir le corpus de connaissances du projet

**Ce qu'il retourne** :
- Références historiques avec sources
- Validation de l'authenticité (✅ cohérent / ❌ anachronique)
- Documentation du corpus (ajout à un fichier de référence)
- Suggestions basées sur l'histoire réelle

**Modèle** : `sonnet` (recherche + analyse critique des sources)

**Note** : Cet agent utilise WebSearch/WebFetch pour accéder à des sources fiables (musées, universités, sites historiques reconnus).

---

## 6. jdr-frontend-expert

**Rôle** : Expert développement frontend React/Next.js

**Responsabilités** :
- Implémenter les composants UI selon les specs
- Maîtriser React 19 (Server Components, "use client", hooks modernes)
- Connaître Next.js 15+ App Router en profondeur
- Optimiser les performances frontend
- Gérer le state management (Zustand, Context, etc.)
- Implémenter les patterns de composition de composants
- Lazy loading, code splitting, optimisations d'images

**Quand l'utiliser** :
- Pour implémenter des features frontend complexes
- Quand on a besoin de conseils sur les patterns React/Next.js
- Pour optimiser les performances frontend
- Lors de la création de composants réutilisables

**Ce qu'il retourne** :
- Code React/Next.js optimisé
- Recommandations de patterns
- Solutions aux problèmes de performance
- Choix architecturaux frontend

**Modèle** : `sonnet` (implémentation complexe)

**Expertise spécifique** :
- Server Components vs Client Components
- Data fetching patterns (fetch, SWR, React Query)
- Routing App Router
- Metadata API
- Streaming et Suspense
- Error boundaries
- Loading states

---

## 7. jdr-backend-expert

**Rôle** : Expert API et logique backend

**Responsabilités** :
- Implémenter les API routes Next.js
- Gérer les Server Actions
- Implémenter la logique métier côté serveur
- Intégrer des APIs externes (Gemini pour génération de contenu)
- Gérer la validation des données (Zod)
- Optimiser les requêtes et la performance backend
- Sécuriser les endpoints (auth, validation, rate limiting)

**Quand l'utiliser** :
- Pour créer des API endpoints
- Pour implémenter de la logique métier serveur
- Pour intégrer des services externes (Gemini API)
- Pour des questions d'architecture backend

**Ce qu'il retourne** :
- API routes implémentées
- Server Actions
- Logique métier serveur
- Schémas de validation
- Recommandations de sécurité

**Modèle** : `sonnet` (logique complexe)

**Expertise spécifique** :
- Next.js API Routes (App Router)
- Server Actions (form handling, mutations)
- Zod validation côté serveur
- Gemini API integration (pour génération NPC descriptions, etc.)
- Error handling et logging
- Rate limiting et sécurité
- Caching strategies

---

## 8. jdr-game-design-validator

**Rôle** : Validateur de game design et balance

**Responsabilités** :
- Valider les mécaniques de jeu (pricing, rareté, progression)
- Vérifier l'équilibre économique (formule de pricing)
- Tester les formules avec des cas limites
- Valider la cohérence des multipliers (matériaux, qualité, rareté)
- Vérifier que l'économie est fun pour les GMs
- Challenger les choix de game design

**Quand l'utiliser** :
- Lors de l'implémentation du système de pricing
- Après avoir créé/modifié des items
- Pour valider des formules économiques
- Quand on ajoute des contextes (périodes, matériaux, etc.)

**Ce qu'il retourne** :
- ✅ Balanced / ⚠️ Needs Tuning / ❌ Broken
- Résultats de tests (cas limites, edge cases)
- Recommandations d'ajustement
- Validation de la formule de pricing

**Modèle** : `sonnet` (raisonnement game design complexe)

**Formule de pricing à valider** :
```
Final Price = Base Price × Material × Quality × Period × Rarity × Location × Economy
```

---

## Ordre de création recommandé

### Phase 0 : Setup (Semaine 1)

1. **jdr-monorepo-researcher** (premier !)
   - Pour identifier ce qui existe et peut être réutilisé
   - Créer le corpus de référence technique

2. **jdr-quality-gate**
   - Pour garantir la qualité dès le début
   - Setup des checks TypeScript/build

3. **jdr-feature-planner**
   - Pour planifier les premières features métier

### Phase 1 : Core Features & Data (Semaine 2-3)

4. **jdr-historical-expert**
   - Pour commencer à construire le corpus historique
   - Valider les premières données (matériaux, périodes)

5. **jdr-backend-expert**
   - Pour implémenter la logique métier serveur
   - Setup des Server Actions et validation Zod

6. **jdr-game-design-validator**
   - Pour implémenter et valider le pricing engine
   - Feature critique du projet

### Phase 2 : Frontend & UI (Semaine 3-4)

7. **jdr-frontend-expert**
   - Pour implémenter les composants UI
   - Setup des patterns React/Next.js

8. **jdr-ux-challenger**
   - Pour valider le design mobile-first
   - Garantir la cohérence UX dès le début

---

## Workflow type avec ces agents

### Exemple : Créer le système de pricing

1. **jdr-feature-planner** → Specs business du pricing system
2. **jdr-monorepo-researcher** → Chercher s'il y a déjà un pricing engine dans le monorepo
3. **jdr-historical-expert** → Valider les prix médiévaux de référence
4. **jdr-backend-expert** → Implémenter la logique de calcul de prix (Server Actions, Zod validation)
5. **jdr-game-design-validator** → Tester la formule, valider l'équilibre
6. **jdr-quality-gate** → Code review + build check

### Exemple : Créer une scène (Taverne)

1. **jdr-feature-planner** → Specs de la scène Taverne
2. **jdr-historical-expert** → Références authentiques pour une auberge médiévale
3. **jdr-monorepo-researcher** → Chercher des composants UI réutilisables
4. **jdr-backend-expert** → Implémenter les Server Actions
5. **jdr-frontend-expert** → Créer la page Taverne + composants UI
6. **jdr-ux-challenger** → Valider le design mobile-first
7. **jdr-game-design-validator** → Valider les prix des services
8. **jdr-quality-gate** → Review final + build check

---

## Fichiers à créer

```
.claude/
├── agents/
│   ├── jdr-feature-planner.md
│   ├── jdr-monorepo-researcher.md
│   ├── jdr-quality-gate.md
│   ├── jdr-ux-challenger.md
│   ├── jdr-historical-expert.md
│   ├── jdr-frontend-expert.md
│   ├── jdr-backend-expert.md
│   └── jdr-game-design-validator.md
```

---

## Notes importantes

- **Pas de sur-ingénierie** : Ces 8 agents couvrent tous les besoins essentiels
- **Évolution** : On peut ajouter des agents plus tard si besoin
- **Simplicité** : Chaque agent a un rôle clair et unique
- **Complémentarité** : Les agents se complètent dans le workflow

**Séparation des responsabilités** :
- **Planning** : feature-planner (business)
- **Research** : monorepo-researcher, historical-expert
- **Quality** : quality-gate, ux-challenger
- **Implementation** : frontend-expert, backend-expert
- **Validation** : game-design-validator
