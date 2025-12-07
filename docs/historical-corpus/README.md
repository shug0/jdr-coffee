# Historical Knowledge Base

Base de connaissances historiques construite par l'agent `historical-research`.

## Structure

```
historical-corpus/
├── README.md           # Ce fichier
├── index.json          # Index de recherche (source de vérité)
├── entries/            # Entrées de connaissances
└── metadata/           # Métadonnées pour statistiques
```

## Usage

**Pour l'agent** : Lire `index.json` en priorité pour rechercher dans le corpus.

**Pour les humains** : Naviguer dans `entries/` pour consulter les recherches historiques.

**Pour les universitaires** : Chaque entrée contient sources académiques et méthodologie.

## Statistiques

Voir `index.json` → `statistics` pour données à jour.

---

**Maintenance** : Géré automatiquement par l'agent `historical-research`.