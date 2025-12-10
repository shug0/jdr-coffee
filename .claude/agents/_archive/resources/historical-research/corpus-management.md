# Gestion du Corpus Historique

Guide pour maintenir et enrichir efficacement le corpus de connaissances historiques.

## 🎯 Philosophie du corpus

### Objectifs
1. **Capitaliser** sur chaque recherche effectuée
2. **Éviter** de refaire la même recherche deux fois
3. **Partager** les connaissances entre sessions
4. **Améliorer** la qualité au fil du temps

### Principes
- **Atomicité** : 1 entrée = 1 sujet précis
- **Richesse** : Tags multiples pour faciliter recherche
- **Fiabilité** : Toujours citer sources
- **Évolutivité** : Possibilité de mettre à jour

---

## 🔍 Recherche dans le corpus

### Étape par étape

#### 1. Lire l'index
```javascript
// Pseudo-code
const index = readJSON('docs/historical-corpus/index.json')
const query = extractKeywordsFromQuestion(userQuestion)
```

#### 2. Extraire mots-clés de la question

**Exemple** :
```
Question : "Combien coûtait une épée longue en France au XVe siècle ?"

Mots-clés extraits :
- Principaux : épée, sword, prix, price, coût, cost
- Période : XVe, 15th, 1400, medieval, médiéval
- Région : France, french, europe
- Thème : economy, warfare, weapon
```

#### 3. Chercher dans l'index

**Méthode 1 : Par keywords**
```javascript
// Chercher entries dont keywords contiennent un des mots-clés
const matches = index.entries.filter(entry =>
  entry.keywords.some(kw => query.includes(kw.toLowerCase()))
)
```

**Méthode 2 : Par tags**
```javascript
// Chercher entries avec tags pertinents
const matches = index.entries.filter(entry =>
  entry.period === 'medieval' &&
  entry.region === 'europe' &&
  (entry.theme === 'economy' || entry.theme === 'warfare')
)
```

**Méthode 3 : Par titre**
```javascript
// Similarité de titre
const matches = index.entries.filter(entry =>
  calculateSimilarity(entry.title, userQuestion) > 0.7
)
```

#### 4. Évaluer la pertinence

**Match exact** (retourner directement) :
- Même sujet exact
- Même période (ou période incluse)
- Même région (ou région incluse)

**Match partiel** (mentionner + nouvelle recherche) :
- Sujet proche mais contexte différent
- Période adjacente
- Région différente mais info transférable

**Pas de match** (nouvelle recherche) :
- Aucune entrée pertinente
- Procéder à recherche web complète

### Exemples de recherche

#### Exemple 1 : Match exact

```
Question : "Prix d'une épée longue médiévale ?"

Recherche dans index :
- Keywords : ["sword", "épée", "medieval", "price"]
- Trouve : entry-001 "Medieval Longsword Price"
- Tags match : medieval, economy, warfare, europe

→ MATCH EXACT : Retourner entry-001
```

#### Exemple 2 : Match partiel

```
Question : "Prix d'un katana au Japon féodal ?"

Recherche dans index :
- Keywords : ["katana", "sword", "price", "japan"]
- Trouve : entry-001 "Medieval Longsword Price" (Europe)
- Même thème mais région différente

→ MATCH PARTIEL : Mentionner que corpus a info sur épées
européennes, mais faire nouvelle recherche pour Japon
```

#### Exemple 3 : Pas de match

```
Question : "Prix d'un parchemin en Égypte antique ?"

Recherche dans index :
- Keywords : ["parchemin", "parchment", "egypt", "ancient", "price"]
- Aucune entrée trouvée

→ PAS DE MATCH : Procéder à recherche web complète
```

---

## ➕ Ajout d'une entrée

### Workflow complet

#### 1. Déterminer l'ID

```bash
# Lire le dernier ID utilisé
lastEntry=$(jq -r '.entries[-1].id' docs/historical-corpus/index.json)
# Exemple : "entry-042"

# Calculer le prochain
nextId="entry-043"
```

#### 2. Créer le fichier

**Nom de fichier** :
```
docs/historical-corpus/entries/entry-XXX-description.md
```

**Conventions de nommage** :
- Utiliser kebab-case (tirets)
- Description courte mais spécifique
- Inclure période si pertinent

**Exemples** :
```
entry-001-medieval-sword-price.md
entry-002-gunpowder-introduction-europe.md
entry-003-roman-concrete-architecture.md
entry-004-potato-medieval-anachronism.md
entry-005-black-death-chronology-europe.md
```

#### 3. Remplir le contenu

**Front matter** :
```yaml
---
id: entry-XXX
title: "Titre descriptif complet"
summary: "Résumé contextuel de 2-3 phrases pour recherche sémantique"
created: 2025-12-06
updated: 2025-12-06
tags: [medieval, europe, economy, sword, weapon, warfare]
period: medieval
regions: [europe]
themes: [economy, warfare]
reliability: high
sources: 3
---
```

**Corps** :
Utiliser le format approprié de `output-formats.md`

#### 4. Choisir les tags

**Tags obligatoires** :
- Au moins 1 période (ou "multi-period" si plusieurs)
- Au moins 1 région (ou "global" si mondial)
- Au moins 1 thème

**Tags recommandés** :
- Mots-clés principaux de la question
- Synonymes (français + anglais)
- Concepts liés

**Exemple pour épée médiévale** :
```yaml
tags: [
  medieval,           # période
  europe,            # région
  economy,           # thème
  warfare,           # thème secondaire
  sword,             # mot-clé EN
  épée,              # mot-clé FR
  longsword,         # type spécifique
  weapon,            # catégorie
  price,             # aspect
  prix               # aspect FR
]
```

**Règles** :
- 5-15 tags typiquement
- Pas de tags trop génériques seuls (toujours combiner)
- Penser : "Comment je rechercherais cette info ?"

#### 5. Mettre à jour index.json

**Ajouter à la liste entries** :
```json
{
  "id": "entry-XXX",
  "title": "Medieval Longsword Price (Europe, 1300-1400)",
  "summary": "Cette entrée documente les prix des épées longues médiévales en Europe entre 1300-1400, couvrant les variations selon la qualité, le contexte économique et les comparaisons avec d'autres biens.",
  "file": "entries/entry-XXX-medieval-sword-price.md",
  "period": "medieval",
  "regions": ["europe"],
  "themes": ["economy", "warfare"],
  "tags": ["medieval", "europe", "economy", "sword", "weapon", "warfare"],
  "keywords": [
    "épée", "sword", "longsword", "épée longue",
    "prix", "price", "cost", "coût",
    "medieval", "médiéval", "moyen âge", "middle ages",
    "1300", "1400", "XIVe", "14th century"
  ],
  "reliability": "high",
  "sources": 3,
  "created": "2025-12-06",
  "updated": "2025-12-06"
}
```

**Mettre à jour compteurs** :
```json
{
  "totalEntries": 43,  // Incrémenter de 1
  "lastUpdated": "2025-12-09"  // Date actuelle
}
```

**Note importante** :
- Les statistiques détaillées (byPeriod, byRegion, etc.) ne sont plus stockées
- Elles sont calculables à la demande depuis `entries[]`
- La taxonomy est dans `index.json → taxonomy` (référentiel fixe de définitions)

#### 6. Validation avec taxonomy

**Vérifier que les codes sont valides** :
```javascript
// Avant d'ajouter une entrée, valider :
const taxonomy = index.taxonomy

// Vérifier period
if (!taxonomy.periods[entry.period]) {
  error(`Période invalide: ${entry.period}`)
}

// Vérifier regions
entry.regions.forEach(region => {
  if (!taxonomy.regions[region]) {
    error(`Région invalide: ${region}`)
  }
})

// Vérifier themes
entry.themes.forEach(theme => {
  if (!taxonomy.themes[theme]) {
    error(`Thème invalide: ${theme}`)
  }
})
```

**Taxonomy** (référentiel fixe) :
- Définitions dans `index.json → taxonomy`
- Ne pas modifier lors de l'ajout d'entrées
- Structure :
  - `periods` : {label, range: [start, end], desc}
  - `regions` : {code: "Label"}
  - `themes` : {code: "Label"}

---

## 🔄 Mise à jour d'une entrée

### Quand mettre à jour ?

**Mise à jour nécessaire si** :
- Nouvelles sources plus fiables disponibles
- Informations obsolètes (débat académique résolu)
- Entrée incomplète (manque contexte important)
- Erreur détectée

**Ne PAS mettre à jour si** :
- Juste reformulation sans info nouvelle
- Ajout mineur qui peut être nouvelle entrée
- Info complémentaire qui mérite entrée séparée

### Processus

#### 1. Modifier le fichier
```markdown
---
id: entry-XXX
title: "Titre (inchangé sauf si nécessaire)"
created: 2025-12-06      # NE PAS CHANGER
updated: 2025-12-08      # METTRE À JOUR
tags: [...]              # Ajuster si nécessaire
reliability: high        # Peut changer
sources: 5               # Mettre à jour si ajout de sources
---

[Contenu mis à jour]

## 📝 Historique des mises à jour

**2025-12-08** : Ajout de 2 sources académiques récentes, précision sur variations régionales
**2025-12-06** : Création initiale
```

#### 2. Mettre à jour index.json
```json
{
  "id": "entry-XXX",
  "title": "...",
  // Mettre à jour si changements :
  "tags": [...],
  "keywords": [...],
  "reliability": "high"
}
```

#### 3. Mettre à jour lastUpdated global
```json
{
  "version": "1.0.0",
  "lastUpdated": "2025-12-08",  // Mettre à jour
  // ...
}
```

---

## 🗑️ Suppression/archivage

### Quand supprimer une entrée ?

**Raisons valides** :
- Information prouvée fausse
- Doublon exact d'une autre entrée
- Entrée devenue obsolète et non pertinente

**Processus** :
1. Déplacer vers `docs/historical-corpus/archived/`
2. Retirer de `index.json`
3. Retirer des métadonnées
4. Mettre à jour statistiques
5. Documenter raison dans `archived/README.md`

### Fusion de doublons

**Si deux entrées similaires** :
1. Identifier la plus complète
2. Fusionner informations de l'autre
3. Archiver la moins complète
4. Mettre à jour entrée conservée avec infos fusionnées

---

## 📊 Maintenance du corpus

### Tâches régulières

#### Hebdomadaire
- Vérifier cohérence des statistiques
- S'assurer que tous les fichiers sont bien indexés

#### Mensuel
- Revoir entrées à faible fiabilité
- Chercher nouvelles sources pour entrées anciennes
- Identifier doublons potentiels

#### Annuel
- Audit complet du corpus
- Mise à jour des sources devenues obsolètes
- Réorganisation si nécessaire

### Commandes utiles

**Vérifier cohérence** :
```bash
# Compter fichiers entries
ls docs/historical-corpus/entries/*.md | wc -l

# Compter entrées dans index
jq '.totalEntries' docs/historical-corpus/index.json

# Les deux nombres doivent correspondre
```

**Trouver entrées sans sources** :
```bash
jq '.entries[] | select(.sources < 2) | .id' docs/historical-corpus/index.json
```

**Lister par fiabilité** :
```bash
jq '.entries[] | select(.reliability=="low") | .id' docs/historical-corpus/index.json
```

**Statistiques des tags les plus utilisés** :
```bash
# Calculer dynamiquement les tags les plus fréquents
jq '[.entries[].tags[]] | group_by(.) | map({tag: .[0], count: length}) | sort_by(.count) | reverse | .[0:10]' \
  docs/historical-corpus/index.json
```

---

## 🎯 Bonnes pratiques

### Pour l'agent

✅ **Faire** :
- TOUJOURS chercher dans corpus en premier
- Créer entrée après chaque recherche web
- Utiliser tags généreux (penser réutilisabilité)
- Citer sources complètes avec URLs
- Mentionner incertitudes et débats

❌ **Ne pas faire** :
- Sauter recherche corpus par impatience
- Créer entrée trop générique ou trop spécifique
- Oublier de mettre à jour index.json
- Copier-coller sans vérifier cohérence
- Mélanger plusieurs sujets dans une entrée

### Pour la qualité

**Priorité 1 : Fiabilité**
- Minimum 2 sources pour fiabilité moyenne
- Minimum 3 sources académiques pour fiabilité haute
- Toujours mentionner divergences entre sources

**Priorité 2 : Réutilisabilité**
- Tags multiples et bien choisis
- Keywords en FR et EN
- Titre clair et descriptif

**Priorité 3 : Maintenabilité**
- Format cohérent
- Métadonnées à jour
- Historique des modifications

---

## 🔮 Évolutions futures

### Extensions possibles

**Corpus de fiction** :
- Entrées pour mythologie, folklore
- Tag spécial `fictional: true`
- Sources : textes mythologiques, études folkloriques

**Multi-langue** :
- Entrées en plusieurs langues
- Liens entre versions
- Keywords multilingues

**Médias enrichis** :
- Images d'objets historiques
- Cartes géographiques
- Chronologies visuelles

**Liens sémantiques** :
- Relations entre entrées (causes, conséquences, parallèles)
- Graphe de connaissances
- Navigation par associations

---

**Dernière mise à jour** : 2025-12-06
