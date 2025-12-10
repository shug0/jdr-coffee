# Méthodologie de Recherche Historique

Guide détaillé pour conduire une recherche historique rigoureuse.

## 🔍 Workflow complet

### ÉTAPE 0 : Vérifier le corpus existant (PRIORITÉ)

**Objectif** : Ne pas refaire une recherche déjà faite.

**Actions** :
1. Lire `docs/historical-corpus/index.json`
2. Extraire mots-clés de la question
3. Rechercher dans `index.json` :
   - Par `keywords` (correspondance partielle)
   - Par `tags` (période, région, thème)
   - Par `title` (similarité)

**Critères de match** :
- **Match exact** : Même sujet, même période, même région → Retourner entrée
- **Match partiel** : Sujet proche mais contexte différent → Signaler + faire nouvelle recherche
- **Pas de match** : Passer à l'étape 1

**Exemple de recherche** :
```
Question: "Quel était le prix d'une épée au Moyen Âge ?"

Mots-clés extraits: ["épée", "sword", "prix", "price", "moyen âge", "medieval"]

Recherche dans index.json:
- Chercher entries avec keywords contenant ces termes
- Filtrer par period: "medieval"
- Filtrer par theme: "economy" ou "warfare"

Résultat:
- Si trouvé entry-001 "Medieval Longsword Price" → RETOURNER
- Sinon → Continuer recherche web
```

---

### ÉTAPE 1 : Analyser la demande

**Objectif** : Comprendre précisément ce qui est recherché.

#### 1.1 Identifier le type de question

| Type | Exemples | Output attendu |
|------|----------|----------------|
| **Validation** | "Les pommes de terre existaient au Moyen Âge ?" | Oui/Non + contexte + date introduction |
| **Prix/Économie** | "Combien coûtait X en Y ?" | Prix + équivalents + contexte économique |
| **Événement** | "Quand a eu lieu X ?" | Date(s) + contexte + sources |
| **Technologie** | "Quand X a-t-il été inventé ?" | Date + lieu + diffusion + contexte |
| **Culture** | "Comment les gens faisaient X ?" | Pratiques + variations + sources |
| **Contexte** | "À quoi ressemblait X à l'époque Y ?" | Description + sources + nuances |

#### 1.2 Extraire les paramètres clés

**Période** :
- Explicite : "au XVe siècle", "en 1350", "pendant la Renaissance"
- Implicite : "médiéval", "antique", "moderne"
- Vague : "autrefois", "dans le passé" → Demander précision ou chercher toutes périodes

**Région** :
- Explicite : "en France", "au Japon", "en Europe"
- Implicite : déduite du contexte (ex: "château fort" → Europe)
- Vague : chercher global + noter variations régionales

**Thème** :
- Économie, guerre, technologie, culture, société, etc.
- Peut être multiple (ex: prix d'arme = économie + warfare)

**Niveau de précision attendu** :
- Ordre de grandeur : "environ", "à peu près"
- Précis : dates exactes, prix spécifiques
- Contextualisé : avec nuances et variations

---

### ÉTAPE 2 : Recherche web (si pas dans corpus)

**Objectif** : Trouver 2-3 sources fiables concordantes.

#### 2.1 Stratégie de recherche par type

**Pour validation d'anachronisme** :
1. Wikipedia (contexte général)
2. Google Scholar ("history of [item]", "[item] introduction date")
3. Sources académiques (HAL, JSTOR Daily)

**Pour prix/économie** :
1. Recherche "medieval prices" / "prix médiévaux"
2. Bases de données spécialisées (archives, thèses)
3. Livres de référence (via Google Books, Internet Archive)

**Pour événements/dates** :
1. Wikipedia (première approche)
2. Vérifier avec sources académiques
3. Croiser plusieurs encyclopédies/sources

**Pour technologies** :
1. "History of [technology]" + période
2. Articles académiques sur l'innovation
3. Musées/institutions spécialisées

**Pour culture/société** :
1. Ouvrages de référence (Cambridge History, Oxford History)
2. Articles sur vie quotidienne
3. Sources primaires (chroniques, mémoires via Wikisource/Gallica)

#### 2.2 Mots-clés efficaces

**En français** :
- "[sujet] + période historique"
- "[sujet] + prix + [siècle]"
- "histoire de [sujet]"
- "[sujet] + sources primaires"

**En anglais** (souvent plus de résultats académiques) :
- "[subject] + history"
- "[subject] + medieval/ancient/renaissance"
- "[subject] + historical prices"
- "[subject] + primary sources"

**Techniques avancées** :
- Guillemets pour expression exacte : `"medieval sword price"`
- Exclusion : `medieval -fantasy` (exclure fantasy)
- Site spécifique : `site:jstor.org medieval economy`
- Période : `medieval prices 1300..1400` (Google)

#### 2.3 Sélection des sources

**Priorité 1 : Sources académiques**
- Articles peer-reviewed (JSTOR, HAL, DOAJ)
- Livres d'historiens reconnus
- Publications universitaires

**Priorité 2 : Institutions fiables**
- Musées (Met Museum, Smithsonian, Louvre)
- Archives nationales
- Bibliothèques nationales (BnF, Library of Congress)

**Priorité 3 : Sources de contexte**
- Wikipedia (pour vue d'ensemble et références)
- Encyclopédies historiques
- Sites spécialisés avec sources citées

**À éviter** :
- Sites sans auteur identifié
- Blogs sans sources
- Sites commerciaux (vente d'objets)
- Forums (sauf pour étude des représentations modernes)

---

### ÉTAPE 3 : Validation des sources

**Objectif** : Garantir la fiabilité de l'information.

#### 3.1 Évaluation d'une source

**Critères de fiabilité** :

✅ **Haute fiabilité** :
- Auteur : Historien avec PhD, expert reconnu
- Institution : Université, musée, archives nationales
- Publication : Peer-reviewed, maison d'édition académique
- Sources : Primaires citées, références complètes
- Date : Récente (post-2000 pour synthèses) ou source primaire

✅ **Fiabilité moyenne** :
- Auteur : Passionné érudit, journaliste spécialisé
- Institution : Site éducatif, vulgarisation de qualité
- Sources : Citées mais pas toutes primaires
- Date : Peut être plus ancienne si référence classique

❌ **Non fiable** :
- Auteur : Anonyme ou non qualifié
- Aucune source citée
- Site commercial ou idéologique
- Affirmations extraordinaires sans preuves

#### 3.2 Validation croisée

**Règle d'or** : Au moins 2-3 sources indépendantes concordantes.

**Concordance** :
- Dates identiques ou très proches
- Fourchettes de prix qui se recoupent
- Descriptions cohérentes

**Divergences** :
- Noter les désaccords dans la réponse
- Expliquer les raisons possibles (débat académique, sources différentes)
- Indiquer quelle version est la plus consensuelle

**Exemple** :
```
Question: "Quand la poudre à canon est arrivée en Europe ?"

Source 1 (Cambridge History): ~1250 CE via commerce arabe
Source 2 (JSTOR article): Première mention 1267 CE (Roger Bacon)
Source 3 (Wikipedia): Introduction XIIIe siècle

Concordance: XIIIe siècle (1200-1300 CE)
Précision: Première mention écrite 1267, probablement arrivée quelques décennies avant
```

#### 3.3 Évaluation de la fiabilité finale

**Haute (3+ sources académiques concordantes)** :
- Articles peer-reviewed concordants
- Consensus académique clair
- Sources primaires disponibles

**Moyenne (2 sources fiables ou sources mixtes)** :
- 2 sources académiques
- OU 1 académique + sources secondaires de qualité
- Quelques variations mineures

**Basse (1 source ou sources non-académiques)** :
- Information unique
- Débat académique en cours
- Sources secondaires uniquement

---

### ÉTAPE 4 : Contextualisation

**Objectif** : Fournir le contexte nécessaire à la compréhension.

#### 4.1 Contexte temporel

**Pour prix/économie** :
- Situer dans l'économie de l'époque
- Donner équivalents (jours de salaire)
- Expliquer système monétaire

**Exemple** :
```
Prix épée: 8 shillings (96 pence)
Contexte:
- Salaire ouvrier: 2 pence/jour
- Équivalent: 48 jours de travail
- Système: 1 livre = 20 shillings = 240 pence
```

#### 4.2 Contexte géographique

**Variations régionales** :
- Prix différents selon régions
- Pratiques culturelles locales
- Disponibilité des ressources

**Exemple** :
```
Armure complète:
- Angleterre (1350): 16-20 livres
- Italie (1350): 15-18 livres (production locale)
- Allemagne (1350): 18-22 livres
```

#### 4.3 Contexte social

**Qui ? Pour qui ? Pourquoi ?**
- Qui utilisait/possédait l'objet/pratique ?
- Différences selon classes sociales
- Signification culturelle/sociale

#### 4.4 Nuances et limites

**Toujours mentionner** :
- Variations possibles
- Limites des sources
- Débats académiques si existants
- Ce qui reste incertain

**Exemple** :
```
"Les prix varient considérablement selon la qualité du travail.
Les chiffres donnés sont des moyennes pour une épée de qualité
standard. Une épée exceptionnelle pouvait coûter 5-10× plus."
```

---

### ÉTAPE 5 : Enrichir le corpus

**Objectif** : Capitaliser sur la recherche pour futures questions.

#### 5.1 Créer l'entrée

**Nom de fichier** :
- Format : `entry-XXX-description.md`
- XXX : Numéro séquentiel (001, 002, etc.)
- Description : Courte, kebab-case

**Exemple** :
```
entry-001-medieval-sword-price.md
entry-002-gunpowder-introduction-europe.md
entry-003-roman-architecture-concrete.md
```

#### 5.2 Remplir les métadonnées

**Front matter YAML** :
```yaml
---
id: entry-XXX
title: "Titre descriptif et spécifique"
summary: "Résumé contextuel de 2-3 phrases décrivant ce que documente cette entrée, son contexte historique et les aspects clés couverts."
created: YYYY-MM-DD
updated: YYYY-MM-DD
tags: [tag1, tag2, tag3, ...]
period: période_principale
regions: [région1, région2]
themes: [thème1, thème2]
reliability: high|medium|low
sources: nombre_de_sources
---
```

**Note importante** : Le champ `summary` est essentiel pour améliorer la recherche (+45% précision selon Anthropic).

**Choisir tags pertinents** :
- Période (medieval, ancient, etc.)
- Région (europe, asia, etc.)
- Thème (economy, warfare, culture, etc.)
- Tags spécifiques (sword, armor, price, etc.)

**Conseils** :
- 5-10 tags typiquement
- Penser aux recherches futures
- Inclure synonymes (sword + épée)

#### 5.3 Mettre à jour l'index

**Ajouter à `index.json`** :
```json
{
  "id": "entry-XXX",
  "title": "Titre",
  "file": "entries/entry-XXX-description.md",
  "tags": ["tag1", "tag2"],
  "period": "medieval",
  "region": "europe",
  "theme": "economy",
  "keywords": ["mot1", "mot2", "word1", "word2"],
  "reliability": "high"
}
```

**Mettre à jour compteurs** :
- Incrémenter `totalEntries`
- Mettre à jour `lastUpdated` avec la date actuelle

**Note** : Les statistiques détaillées ne sont plus stockées dans index.json.
Elles sont calculables à la demande depuis `entries[]`.

#### 5.4 Validation avec taxonomy

**Vérifier que les codes utilisés existent dans taxonomy** :
- `period` doit exister dans `taxonomy.periods`
- `regions[]` doivent exister dans `taxonomy.regions`
- `themes[]` doivent exister dans `taxonomy.themes`

**Taxonomy** (périodes/régions/thèmes) :
- Définie dans `index.json → taxonomy`
- Référentiel fixe (ne change pas sauf ajout de nouvelles périodes/régions)
- Ne pas modifier lors de l'ajout d'entrées
- Structure : `periods` = {label, range, desc}, `regions/themes` = {code: "Label"}

---

## 🎯 Cas d'usage spécifiques

### Recherche multi-périodes

**Question** : "Quand le fer a-t-il remplacé le bronze ?"

**Approche** :
1. Identifier que c'est une transition (Bronze Age → Iron Age)
2. Rechercher par région (différentes dates selon régions)
3. Créer entrée avec tags multiples : `bronze-age`, `iron-age`, `technology`
4. Documenter variations régionales

### Recherche comparative

**Question** : "Différence entre château fort européen et château japonais ?"

**Approche** :
1. Deux recherches distinctes (Europe + Japon)
2. Créer deux entrées séparées
3. Lier les entrées dans les notes ("Voir aussi: entry-YYY")
4. Possibilité de créer entrée comparative en bonus

### Information non trouvée

**Si recherche infructueuse** :
1. Documenter ce qui a été cherché
2. Noter pourquoi l'info n'existe probablement pas
3. Créer entrée "negative result" si pertinent
4. Suggérer alternatives ou approximations

**Exemple** :
```
"Aucune source fiable ne documente le prix exact des oignons
en France en 1247. Les registres de prix disponibles commencent
au XIVe siècle. Une approximation peut être faite à partir des
prix de 1350 ajustés pour l'inflation de l'époque."
```

---

## ⚙️ Conseils pratiques

### Efficacité

- Commencer large (Wikipedia) puis affiner (académique)
- Utiliser Google Scholar pour trouver références clés
- Sauvegarder URLs complètes des sources
- Noter date d'accès pour sources web

### Qualité

- Toujours préférer 2+ sources concordantes
- Mentionner divergences quand elles existent
- Indiquer niveau de certitude
- Citer sources exactes (auteur, titre, année, page si possible)

### Corpus

- Chaque recherche = opportunité d'enrichir le corpus
- Même recherches "négatives" ont de la valeur
- Penser réutilisabilité : tags généreux, keywords multiples
- Privilégier entrées atomiques (1 sujet = 1 entrée)

---

**Dernière mise à jour** : 2025-12-06
