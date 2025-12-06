# Historical Knowledge Base

Base de connaissances historiques construite et enrichie par l'agent de recherche historique.

## 📋 Structure

```
historical-corpus/
├── README.md           # Ce fichier
├── index.json          # Index de recherche rapide
├── entries/            # Entrées de connaissances (1 fichier = 1 sujet)
└── metadata/           # Métadonnées pour recherche avancée
    ├── tags.json       # Index par tags
    ├── periods.json    # Index par période
    ├── regions.json    # Index par région
    └── themes.json     # Index par thème
```

## 🔍 Comment ça fonctionne

### 1. Recherche dans le corpus
L'agent lit `index.json` en premier pour voir si l'information existe déjà.

### 2. Si trouvé
- Retourne l'information avec sources
- Propose mise à jour si sources obsolètes (>1 an)

### 3. Si pas trouvé
- Fait recherche web
- Crée nouvelle entrée dans `entries/`
- Met à jour `index.json` et métadonnées

## 📝 Format d'une entrée

Chaque fichier dans `entries/` suit ce format :

```markdown
---
id: entry-XXX
title: "Titre descriptif"
created: YYYY-MM-DD
updated: YYYY-MM-DD
tags: [tag1, tag2, tag3]
period: période_principale
region: région_principale
theme: thème_principal
reliability: high|medium|low
sources: nombre_de_sources
---

# Titre

## Question originale
La question qui a motivé cette recherche.

## Réponse synthétique
Réponse courte et directe.

## Sources
Liste des sources avec URLs et évaluation.

## Détails historiques
Informations détaillées avec contexte.

## Contexte complémentaire
Contexte économique, social, culturel selon besoin.

## Notes
Informations additionnelles, nuances, débats académiques.

## Usage JDR (optionnel)
Adaptations pour usage en jeu de rôle si applicable.
```

## 🏷️ Système de tags

### Périodes
- `prehistory` - Préhistoire
- `ancient` - Antiquité (jusqu'à ~500 CE)
- `medieval` - Moyen Âge (~500-1500 CE)
- `renaissance` - Renaissance (~1400-1600 CE)
- `early-modern` - Début moderne (~1600-1800 CE)
- `modern` - Moderne (1800+)
- `contemporary` - Contemporain (1900+)

### Régions
- `europe`, `asia`, `africa`, `americas`, `oceania`
- Sous-régions : `western-europe`, `east-asia`, etc.

### Thèmes
- `economy` - Économie, prix, commerce
- `warfare` - Guerre, armes, tactiques
- `technology` - Technologies, inventions
- `culture` - Culture, arts, traditions
- `society` - Société, structure sociale
- `architecture` - Architecture, construction
- `religion` - Religion, croyances
- `politics` - Politique, gouvernance
- `science` - Sciences, connaissances
- `daily-life` - Vie quotidienne

### Fiabilité
- `high` - 3+ sources académiques concordantes
- `medium` - 2 sources fiables ou sources mixtes
- `low` - 1 source ou sources non-académiques

## 📊 Statistiques

Voir `index.json` pour statistiques à jour :
- Nombre total d'entrées
- Répartition par période
- Répartition par région
- Répartition par thème
- Taux de fiabilité moyen

## 🔄 Maintenance

### Mise à jour d'une entrée
1. Modifier le fichier dans `entries/`
2. Mettre à jour `updated` date
3. Mettre à jour `index.json`
4. Si tags changent, mettre à jour métadonnées

### Ajout d'une entrée
1. Créer fichier dans `entries/` avec ID unique
2. Ajouter à `index.json`
3. Mettre à jour métadonnées correspondantes

### Recherche manuelle
```bash
# Rechercher par mot-clé
grep -r "sword" entries/

# Lister par période
jq '.entries[] | select(.period=="medieval")' index.json

# Compter par thème
jq '.statistics.byTheme' index.json
```

---

**Dernière mise à jour du corpus** : Voir `index.json` → `lastUpdated`
**Nombre d'entrées** : Voir `index.json` → `totalEntries`
