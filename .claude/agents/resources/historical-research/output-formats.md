# Formats de Sortie Adaptatifs

Templates de réponse selon le type de question historique posée.

## 🎯 Détection du type de question

L'agent détecte automatiquement le type de question et adapte le format de sortie.

| Pattern de question | Type détecté | Format à utiliser |
|---------------------|--------------|-------------------|
| "Est-ce que X existait..." | Validation | Format 1 |
| "Les X existaient-ils..." | Validation | Format 1 |
| "Combien coûtait..." | Prix/Économie | Format 2 |
| "Quel était le prix..." | Prix/Économie | Format 2 |
| "Quand..." | Événement/Date | Format 3 |
| "Comment était/faisait..." | Contexte culturel | Format 4 |
| "Qui était..." | Personnage | Format 5 |
| "Qu'est-ce que..." | Définition/Concept | Format 6 |
| Multiple facettes | Recherche générale | Format 7 |

---

## Format 1 : Validation d'anachronisme

**Usage** : Vérifier si quelque chose existait à une période donnée.

### Template

```markdown
# Validation : [Sujet] - [Période]

## ✅/❌ Réponse directe

[OUI/NON] - [Une phrase de synthèse]

## 📅 Chronologie

- **Première apparition** : [Date] - [Lieu]
- **Introduction en [région concernée]** : [Date]
- **Période concernée ([période de la question])** : [Disponible/Non disponible]

## 📚 Détails historiques

[Explication détaillée de l'histoire de l'objet/concept]

### Variations régionales
- **[Région 1]** : [Info]
- **[Région 2]** : [Info]

## 🔍 Sources

1. **[Titre]** - [Auteur] ([Année])
   - Type : [Academic/Museum/Archive]
   - Fiabilité : ★★★★★
   - URL : [lien]
   - Citation pertinente : "[extrait]"

2. [Source 2...]

3. [Source 3...]

## 📝 Notes complémentaires

[Nuances, débats académiques, limites de l'information]

## 💡 Pour aller plus loin

[Recherches connexes suggérées, liens avec autres entrées du corpus]

---

**Fiabilité de cette information** : [Haute/Moyenne/Basse]
**Ajouté au corpus** : `entry-XXX-[description]`
```

### Exemple concret

```markdown
# Validation : Pommes de terre - Moyen Âge européen

## ❌ Réponse directe

NON - Les pommes de terre n'existaient pas en Europe au Moyen Âge.

## 📅 Chronologie

- **Première apparition** : ~8000 BCE - Andes (Amérique du Sud)
- **Introduction en Europe** : 1570 CE - Espagne
- **Période médiévale (500-1500 CE)** : Non disponible en Europe

## 📚 Détails historiques

La pomme de terre (Solanum tuberosum) est originaire des Andes, où elle
a été domestiquée il y a environ 10 000 ans. Elle n'a été introduite en
Europe qu'après la découverte des Amériques par Christophe Colomb (1492).

Les conquistadores espagnols ont rapporté les premières pommes de terre
vers 1570. Elle ne s'est répandue en Europe qu'aux XVIIe-XVIIIe siècles,
rencontrant d'abord une forte résistance culturelle.

### Variations régionales
- **Espagne** : Introduction ~1570, adoption lente
- **Irlande** : Adoption massive XVIIe siècle
- **France** : Popularisée par Parmentier XVIIIe siècle

## 🔍 Sources

1. **The Cambridge World History of Food** - K. Kiple & K. Ornelas (2000)
   - Type : Academic
   - Fiabilité : ★★★★★
   - Volume 1, Part 3, Chapter on Potatoes
   - Citation : "The potato remained unknown in Europe until after 1492"

2. **The Potato: How the Humble Spud Rescued the Western World** - L. Zuckerman (1998)
   - Type : Academic Book
   - Fiabilité : ★★★★☆
   - Chapter 1-2
   - Detailed chronology of introduction

3. **Smithsonian Magazine - History of the Potato** (2011)
   - Type : Museum Publication
   - Fiabilité : ★★★★☆
   - URL : [lien]

## 📝 Notes complémentaires

Anachronisme très fréquent dans la fiction médiévale. Au Moyen Âge européen,
les féculents de base étaient :
- Céréales : blé, seigle, orge, avoine
- Légumineuses : pois, fèves, lentilles
- Panais, navets (légumes racines disponibles)

## 💡 Pour aller plus loin

- Voir `entry-XXX` : Alimentation médiévale européenne
- Voir `entry-YYY` : Échanges post-colombiens (Columbian Exchange)

---

**Fiabilité de cette information** : Haute (consensus académique)
**Ajouté au corpus** : `entry-042-potato-medieval-europe-anachronism`
```

---

## Format 2 : Prix et économie

**Usage** : Questions sur coût, valeur, prix d'objets ou services.

### Template

```markdown
# Prix historique : [Objet/Service] - [Période] - [Région]

## 💰 Réponse synthétique

**Prix moyen** : [Montant] [Monnaie]
**Équivalent moderne** : ~[Montant] [monnaie actuelle] (estimation)
**En jours de salaire** : [X] jours de salaire d'[ouvrier/artisan/etc.]

## 📊 Détails des prix

### Fourchette de prix
- **Bas de gamme** : [Prix] - [Description qualité]
- **Moyenne** : [Prix] - [Description qualité]
- **Haut de gamme** : [Prix] - [Description qualité]
- **Exceptionnelle** : [Prix] - [Description qualité]

### Variations
- **Par région** :
  - [Région 1] : [Prix] - [Raison de variation]
  - [Région 2] : [Prix] - [Raison de variation]

- **Par période** :
  - [Sous-période 1] : [Prix]
  - [Sous-période 2] : [Prix]

## 💵 Contexte économique

### Système monétaire
[Explication du système monétaire de l'époque]

**Exemple** :
- 1 livre = 20 shillings = 240 pence
- 1 shilling = 12 pence

### Salaires de référence
- **Ouvrier non qualifié** : [X] [monnaie]/jour
- **Artisan qualifié** : [X] [monnaie]/jour
- **Maître artisan** : [X] [monnaie]/jour

### Prix d'autres biens (pour comparaison)
- [Bien 1] : [Prix]
- [Bien 2] : [Prix]
- [Bien 3] : [Prix]

## 🔍 Sources

[Même format que Format 1]

## 📝 Facteurs de variation

[Explication de ce qui faisait varier le prix : qualité, rareté, région, etc.]

## 🎲 Usage JDR (optionnel)

**Si la question vient d'un contexte JDR** :

### Prix de base suggéré
- **Monnaie de jeu** : [X] pièces [type]
- **Rareté** : [Commune/Peu commune/Rare/Très rare]

### Multiplicateurs suggérés
- **Qualité médiocre** : ×0.5
- **Qualité standard** : ×1.0
- **Bonne qualité** : ×1.5
- **Qualité exceptionnelle** : ×3.0
- **Qualité légendaire** : ×10.0

### Notes game design
[Recommandations pour équilibrer dans un jeu]

---

**Fiabilité** : [Haute/Moyenne/Basse]
**Ajouté au corpus** : `entry-XXX-[description]`
```

---

## Format 3 : Événement/Date

**Usage** : "Quand...", questions sur chronologie.

### Template

```markdown
# Événement historique : [Nom de l'événement]

## 📅 Réponse directe

**Date** : [Date précise ou fourchette]
**Lieu** : [Lieu(x)]

## ⏱️ Chronologie détaillée

### Avant l'événement
- **[Date]** : [Contexte/cause 1]
- **[Date]** : [Contexte/cause 2]

### L'événement
- **[Date précise]** : [Déroulement]

### Après l'événement
- **[Date]** : [Conséquence 1]
- **[Date]** : [Conséquence 2]

## 📚 Contexte historique

[Explication du contexte, causes, enjeux]

## 🔍 Sources

[Format standard]

## 📝 Débats et incertitudes

[Si des divergences existent entre sources sur les dates/faits]

---

**Fiabilité** : [Haute/Moyenne/Basse]
**Ajouté au corpus** : `entry-XXX-[description]`
```

---

## Format 4 : Contexte culturel

**Usage** : "Comment...", "À quoi ressemblait...", questions descriptives.

### Template

```markdown
# [Sujet] - [Période] - [Région]

## 📝 Synthèse

[Résumé en 2-3 phrases]

## 📖 Description détaillée

### [Sous-aspect 1]
[Description]

### [Sous-aspect 2]
[Description]

### [Sous-aspect 3]
[Description]

## 🌍 Variations

### Par région
- **[Région 1]** : [Spécificités]
- **[Région 2]** : [Spécificités]

### Par classe sociale
- **Noblesse** : [Pratiques]
- **Bourgeoisie** : [Pratiques]
- **Paysannerie** : [Pratiques]

### Par période
- **[Sous-période 1]** : [Évolution]
- **[Sous-période 2]** : [Évolution]

## 🔍 Sources

[Format standard]

## 📝 Nuances importantes

[Ce qui n'est pas certain, stéréotypes à éviter, complexité]

---

**Fiabilité** : [Haute/Moyenne/Basse]
**Ajouté au corpus** : `entry-XXX-[description]`
```

---

## Format 5 : Personnage historique

**Usage** : "Qui était...", questions biographiques.

### Template

```markdown
# [Nom du personnage] ([Dates de vie])

## 👤 Synthèse

[Qui était cette personne en 1-2 phrases]

## 📅 Chronologie

- **[Date naissance]** : Naissance à [lieu]
- **[Date]** : [Événement marquant 1]
- **[Date]** : [Événement marquant 2]
- **[Date mort]** : Mort à [lieu]

## 🎭 Rôle historique

[Importance historique, contributions, impact]

## 📚 Contexte

[Contexte politique/social/culturel de son époque]

## 🔍 Sources

[Format standard]

## 📝 Légende vs réalité

[Démêler faits historiques des mythes/légendes si applicable]

---

**Fiabilité** : [Haute/Moyenne/Basse]
**Ajouté au corpus** : `entry-XXX-[description]`
```

---

## Format 6 : Définition/Concept

**Usage** : "Qu'est-ce que...", "C'était quoi..."

### Template

```markdown
# Concept : [Nom du concept]

## 📖 Définition

[Définition claire et concise]

## 📚 Explication détaillée

[Développement du concept, comment ça fonctionnait]

## 📅 Histoire du concept

- **Origine** : [Date/période] - [Contexte]
- **Évolution** : [Changements dans le temps]
- **Fin/Transformation** : [Si applicable]

## 🌍 Variations

[Différences régionales ou contextuelles]

## 🔍 Sources

[Format standard]

---

**Fiabilité** : [Haute/Moyenne/Basse]
**Ajouté au corpus** : `entry-XXX-[description]`
```

---

## Format 7 : Recherche générale

**Usage** : Questions complexes ou multi-facettes.

### Template

```markdown
# Recherche : [Sujet général]

## 📝 Synthèse

[Vue d'ensemble en quelques paragraphes]

## 📚 Aspects détaillés

### [Aspect 1]
[Développement]

### [Aspect 2]
[Développement]

### [Aspect 3]
[Développement]

## 📅 Chronologie (si pertinent)

[Timeline des développements majeurs]

## 🌍 Contexte géographique (si pertinent)

[Variations régionales]

## 🔍 Sources

[Format standard, possiblement plus de sources vu la complexité]

## 📝 Pour aller plus loin

[Pistes de recherches complémentaires, entrées liées du corpus]

---

**Fiabilité** : [Haute/Moyenne/Basse]
**Ajouté au corpus** : `entry-XXX-[description]`
```

---

## 🎨 Adaptation contextuelle

### Détection du contexte JDR

**Indices que c'est pour un JDR** :
- Mention explicite : "pour mon JDR", "pour ma partie"
- Contexte game design : "équilibré", "fun", "gameplay"
- Questions de pricing game : "combien devrais-je..."
- Référence à JDR Coffee ou système de jeu

**Si contexte JDR détecté** :
- Ajouter section "Usage JDR" à la fin
- Adapter ton (rester factuel mais inclure recommandations game design)
- Suggérer multiplicateurs/variations pour équilibrage

**Si pas de contexte JDR** :
- Omettre section "Usage JDR"
- Rester purement historique
- Ton académique

---

## 🔧 Règles de formatage

### Titres
- H1 (#) : Titre principal unique
- H2 (##) : Sections principales
- H3 (###) : Sous-sections

### Listes
- Listes à puces pour énumérations simples
- Listes numérotées pour chronologies ou étapes
- Tables pour comparaisons structurées

### Emphase
- **Gras** : Informations clés, chiffres importants
- *Italique* : Termes techniques, mots étrangers
- `Code` : IDs d'entrées corpus, filenames

### Citations
```markdown
> Citation textuelle d'une source primaire
> — Auteur, Œuvre, Date
```

### Liens internes corpus
```markdown
Voir aussi : `entry-XXX-description` - [Titre]
```

---

## ⚡ Réponse si info déjà dans corpus

**Template rapide** :

```markdown
# [Sujet] - [Période]

✅ **Information déjà dans le corpus** : `entry-XXX-description`

## 📝 Synthèse

[Reprendre réponse synthétique de l'entrée]

## 📚 Détails

[Reprendre détails clés]

## 🔍 Sources

[Reprendre sources]

---

💡 **Note** : Cette information est issue du corpus existant (dernière mise à jour : [date]).
Si vous souhaitez une mise à jour avec des sources plus récentes, demandez explicitement.

**Source corpus** : `docs/historical-corpus/entries/entry-XXX-description.md`
```

---

**Dernière mise à jour** : 2025-12-06
