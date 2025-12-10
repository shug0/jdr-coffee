# Historical Knowledge Base

Base de connaissances historiques construite par l'agent `historical-research`.

## Structure

```
historical-corpus/
├── README.md           # Ce fichier
├── index.json          # Index unique (source de vérité)
└── entries/            # Entrées de connaissances (.md)
```

## Architecture simplifiée

Tout est centralisé dans `index.json` :
- **entries[]** : Liste des entrées avec métadonnées complètes
- **searchIndex** : Index optimisés (byKeyword, byContent, relations)
- **statistics** : Compteurs auto-calculés (byPeriod, byRegion, byTheme, byReliability)
- **taxonomy** : Définitions des périodes/régions/thèmes (référentiel fixe)
- **cache** : Optimisation des requêtes fréquentes

## Format des entrées

Chaque entrée suit ce format Markdown + YAML :

```markdown
---
id: entry-XXX
title: "Titre descriptif"
summary: "Résumé contextuel de 2-3 phrases pour recherche sémantique"
period: "medieval"
regions: ["europe"]
themes: ["economy", "warfare"]
tags: ["mot-clé1", "keyword1", "mot-clé2"]
reliability: "high"
sources: 3
created: "2025-12-09"
updated: "2025-12-09"
---

# Titre

## Synthèse
...

## Contenu détaillé
...

## Sources
1. Source académique 1
2. Source académique 2
```

## Usage

**Pour l'agent** : Lire `index.json` en priorité pour rechercher dans le corpus.

**Pour les humains** : Naviguer dans `entries/` pour consulter les recherches historiques.

**Pour les universitaires** : Chaque entrée contient sources académiques et méthodologie.

## Statistiques

Voir `index.json` → `statistics` pour données à jour.

---

**Maintenance** : Géré automatiquement par l'agent `historical-research`.
