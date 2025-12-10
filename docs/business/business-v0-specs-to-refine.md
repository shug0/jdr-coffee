# JDR Coffee - Business Scope & Features

## 🎯 Vision & Mission

**JDR Coffee** est un assistant mobile contextuel pour Maîtres du Jeu (MJ) qui génère du contenu pertinent en temps réel pendant les sessions de JDR, avec un système d'items intelligent adapté au contexte narratif.

### Mission Principale
Permettre aux MJ d'improviser facilement en fournissant instantanément du contenu cohérent (PNJ, items, services) selon la situation narrative actuelle de la partie.

## 📱 Format & Positionnement

- **Format**: Mobile-first (800px × 360px)
- **Usage**: Pendant la partie (pas préparation)
- **Design**: Minimaliste, pixel art, médiéval-fantastique
- **Cible**: MJ francophones improvisateurs

## 🏗️ Architecture Conceptuelle

### Navigation par Scènes
L'app organise les outils par **scènes narratives** correspondant aux lieux typiques d'une campagne JDR.

```
Header (logo JDR Coffee)
    ↓
Sélecteur de scène
    ↓
Cartes d'outils contextuels
```

**Scènes MVP:**
- 🍺 Taverne
- 🏪 Marché
- ⚒️ Boutique (Forgeron/Apothicaire)
- 🛤️ Grand Chemin

**Scènes futures:**
- Temple/Église
- Donjon/Ruines
- Palais/Château
- Port/Quai
- Forêt/Nature

### Système d'Items Contextuels (Innovation Clé)

Un même objet peut avoir **plusieurs variantes** selon des filtres contextuels superposés:

```
Objet de base: "Épée longue"
    ↓
Contextes appliqués:
├─ Période: Médiéval / Renaissance / Antique
├─ Univers: Fantasy / Historique / Dark Fantasy
├─ Matériau: Fer / Acier / Mithril
├─ Qualité: Commune / Fine / Exceptionnelle
├─ Lieu: Rural / Urbain / Noble
└─ Économie: Effondrement / Standard / Prospérité
    ↓
Résultat: "Épée longue en acier (Renaissance, Fine)"
Prix: 35po (calculé dynamiquement)
```

**Exemples de variations:**
- Épée longue (medieval, fer, commune, rural) = 12po
- Épée longue (medieval, acier, fine, urbain) = 45po
- Épée longue (medieval, mithril, exceptionnelle, noble) = 850po

## 🎮 Features Principales

### 1. Générateur de PNJ Contextuels
- **Design**: Silhouette sombre + bulle dialogue pixel art
- **Contenu**:
  - Nom généré (Markov chains)
  - Phrase d'accroche liée au lieu
  - Description physique rapide
  - Traits de caractère
  - Détails étendus (sur demande)
- **Contexte**: Adapté à la scène (aubergiste, marchand, forgeron...)

### 2. Générateur d'Items Dynamiques
- **Base de données**: 50-100 items de base (MVP)
- **Catégories**:
  - ⚔️ Armes
  - 🛡️ Armures
  - 🍖 Nourriture
  - 🧪 Potions/Herbes
  - 🎒 Équipement (cordes, torches, outils)
  - 🏠 Services (chambre, écurie, réparation)

- **Calcul de prix dynamique**:
```
Prix Final = Prix Base × Multiplicateurs

Multiplicateurs:
├─ Matériau: ×1 (fer) à ×50 (mithril)
├─ Qualité: ×0.8 (commune) à ×3 (exceptionnelle)
├─ Période: ×0.7 (antique) à ×1.5 (renaissance)
├─ Rareté: ×1 (commun) à ×10 (légendaire)
├─ Lieu: ×0.7 (rural) à ×2 (capitale)
└─ Économie: ×0.5 (crise) à ×1.5 (prospérité)
```

### 3. Services Contextuels par Scène
- **Taverne**: Chambres, écuries, bains, repas
- **Forgeron**: Réparations, commandes sur-mesure, affûtage
- **Apothicaire**: Soins, antidotes, identification
- **Marché**: Troc, nouvelles/rumeurs, location de montures

### 4. Générateurs Spécialisés
- **Plat du jour** (taverne)
- **Quête secondaire** (marchands)
- **Événement aléatoire** (grand chemin)
- **Rumeur/nouvelle** (marché)

### 5. Gestion du Contexte Global
Interface de configuration permettant de définir:
- Période historique (Antique / Médiéval / Renaissance)
- Univers (High Fantasy / Low Fantasy / Dark / Historique)
- État économique (Crise / Standard / Prospérité)
- Système monétaire (D&D / Historique / Custom)

## 🎨 Design System

### Principes Visuels
- **Minimalisme**: Pas de fioritures, formes simples
- **Pixel Art**: Bulles de dialogue, icônes rétro
- **Silhouettes**: PNJ représentés par formes sombres
- **Contraste**: Noir/blanc avec touches de couleur
- **Cartes modulaires**: Chaque outil = 1 carte indépendante

### Typographie
- **Titre**: Medieval/Fantasy font pour l'ambiance
- **Corps**: Font lisible sur mobile (16px minimum)
- **Code/Prix**: Monospace pour données chiffrées

### Logo
Logo fourni utilisé dans header fixe comme ancre visuelle.

## 🔧 Connaissances Utiles & Domaines

### Jeux de Rôle & Game Design
- **Systèmes JDR**: D&D 5e, Pathfinder, OSR
- **Économie médiévale-fantastique**: Prix cohérents, systèmes monétaires
- **Création de PNJ**: Archétypes, motivations, traits
- **Tables aléatoires**: Génération procédurale de contenu
- **Improvisation MJ**: Besoins réels en session

### Histoire & Contexte
- **Périodes historiques**:
  - Antiquité (-500 à 500)
  - Haut Moyen-Âge (500-1000)
  - Moyen-Âge classique (1000-1400)
  - Renaissance (1400-1700)

- **Économie médiévale**:
  - Valeur relative des biens
  - Systèmes monétaires (deniers, florins, ducats)
  - Commerce et troc
  - Salaires et coûts de vie

- **Métiers médiévaux**:
  - Forgeron, tanneur, apothicaire
  - Aubergiste, marchand, tisserand
  - Structures de prix et services

### Matériaux & Craft
- **Métaux**: Fer, acier, bronze, cuivre
- **Métaux fantastiques**: Mithril, adamantium, orichalque
- **Matériaux naturels**: Bois, cuir, chanvre, laine
- **Pierres précieuses**: Rubis, saphir, émeraude
- **Matériaux magiques**: Cristaux, essences, poudres

### Génération Procédurale
- **Chaînes de Markov**: Génération de noms
- **Tables pondérées**: Distribution réaliste
- **Seeds aléatoires**: Reproductibilité
- **Règles combinatoires**: Assemblage cohérent

### Intelligence Artificielle
- **Google Gemini API**: Génération de descriptions narratives
- **Prompts engineering**: Création de descriptions PNJ contextuelles
- **Génération d'items uniques**: Armes/armures légendaires
- **Consistency**: Maintenir cohérence narrative

## 🚀 Roadmap Business

### Phase 1: MVP Médiéval-Fantasy (Q1)
**Scope:**
- 4 scènes de base (Taverne, Marché, Forgeron, Grand Chemin)
- 50-100 items avec variations matériaux
- Générateur PNJ basique (noms + descriptions IA)
- 1 univers: Medieval Fantasy
- 3 périodes: Haut Moyen-Âge / Médiéval / Renaissance

**Livrables:**
- App mobile-first fonctionnelle
- Système de contexte opérationnel
- Base de données items complète
- Calcul de prix dynamique

### Phase 2: Extension Gameplay (Q2)
**Scope:**
- 3 nouvelles scènes (Temple, Donjon, Port)
- Générateur d'événements aléatoires
- Système de quêtes secondaires
- Sauvegarde de PNJ récurrents
- Import/Export de contextes

**Livrables:**
- 7 scènes totales
- Persistance locale (localStorage)
- Partage de configurations

### Phase 3: Multi-Univers (Q3)
**Scope:**
- Science-fiction (4 scènes + 50 items)
- Cyberpunk (4 scènes + 50 items)
- Post-apocalyptique (4 scènes + 50 items)
- Adaptation du système de contexte

**Livrables:**
- 4 univers jouables
- Sélecteur d'univers
- Thèmes visuels adaptés

### Phase 4: Communauté & Monétisation (Q4)
**Scope:**
- MJ créent items/scènes custom
- Marketplace de contenus
- Packs premium par univers
- Générateur IA avancé (items légendaires)

**Livrables:**
- Éditeur de contenu
- Système de partage
- Modèle freemium
- Packs payants (5-10€)

## 💡 Cas d'Usage Typiques

### Scénario 1: Improvisation Taverne
```
Situation: Joueurs décident spontanément d'aller à la taverne

MJ:
1. Ouvre JDR Coffee
2. Sélectionne scène "Taverne"
3. Génère aubergiste → Lit dialogue d'accroche
4. Joueurs demandent le menu → Génère "Plat du jour"
5. Joueurs veulent dormir → Affiche "Services disponibles"

Temps: 30 secondes vs 5 minutes d'improvisation/recherche
```

### Scénario 2: Shopping Équipement
```
Situation: Joueurs veulent acheter armes avant donjon

MJ:
1. Sélectionne scène "Forgeron"
2. Génère forgeron PNJ
3. Configure contexte: Urbain + Acier disponible
4. Affiche liste armes avec prix calculés
5. Joueurs négocient → Prix cohérents automatiquement

Résultat: Économie cohérente, pas de price check manuel
```

### Scénario 3: Voyage Multi-Régions
```
Situation: Campagne traverse plusieurs régions

Village rural:
- Contexte: Rural + Pauvre
- Pain: 3pc / Épée: 12po

Capitale:
- Contexte: Urbain + Riche
- Pain: 8pc / Épée: 45po

Forge naine:
- Contexte: Montagne + Expert
- Pain: 12pc / Épée: 120po

Résultat: Cohérence économique automatique par région
```

## 🎯 Métriques de Succès

### Métriques Produit
- **Temps moyen de génération**: < 5 secondes
- **Taux d'utilisation en partie**: > 3 générations/session
- **Satisfaction contexte**: Prix jugés cohérents (feedback)

### Métriques Business
- **Phase 1**: 100 utilisateurs actifs
- **Phase 2**: 500 utilisateurs actifs
- **Phase 3**: 1000+ utilisateurs, 100 payants (10%)
- **Phase 4**: 5000+ utilisateurs, 500+ payants (10%)

### Métriques Engagement
- **Rétention J7**: > 40%
- **Sessions/semaine**: 2-3 (fréquence parties JDR)
- **Durée session**: 10-30 minutes (durée partie JDR)

## 🔒 Contraintes & Limitations

### Techniques
- **Mobile-first obligatoire**: 360px largeur max
- **Performance**: Génération instantanée (< 1s)
- **Offline-first**: Fonctionne sans connexion (items hardcodés)
- **IA optionnelle**: Descriptions PNJ dégradées si pas de connexion

### Business
- **Solo developer**: Pas de CI/CD complexe
- **Prototypage rapide**: MVP en 3 mois max
- **Budget limité**: API IA gratuite/faible coût
- **Pas de backend lourd**: Génération client-side

### Scope
- **MVP = 1 univers**: Medieval Fantasy uniquement
- **Pas de combat**: Focus RP/exploration
- **Pas de système de jeu**: Neutre (compatible tous JDR)
- **Pas de campagne**: Génération ponctuelle, pas de suivi

## 📚 Ressources & Références

### Outils Existants (Inspiration)
- **Donjon**: Générateurs aléatoires classiques
- **Fantasy Name Generators**: Noms procéduraux
- **D&D Beyond**: Items database (mais statique)
- **Azgaar's Fantasy Map**: Génération procédurale complexe

### Données de Référence
- **D&D 5e PHB**: Prix équipement standard
- **Pathfinder Price List**: Variations matériaux
- **Medieval Price List (PDF)**: Historique réaliste
- **GURPS Low-Tech**: Technologies par période

### Communautés
- **r/DnDBehindTheScreen**: Outils MJ
- **r/DMAcademy**: Conseils improvisation
- **Discord JDR FR**: Communauté francophone
- **JDR.txt**: Forum français

---

**Document mis à jour**: 2025-12-06
**Version**: 1.0 - Pivot vers assistant mobile contextuel
